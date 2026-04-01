/**
 * Profile photo: file pick → Cropper.js (square) → POST /api/profile/avatar.
 * Depends: ProfileAPI, global Cropper (cdn), DOM ids from profile.html.
 */
(function (global) {
  "use strict";

  var cropper = null;
  var objectUrl = null;
  var opts = null;

  function el(id) {
    return document.getElementById(id);
  }

  function showCropUi(show) {
    var bd = el("pwcAvatarCropBackdrop");
    var md = el("pwcAvatarCropModal");
    if (!bd || !md) return;
    bd.hidden = !show;
    md.hidden = !show;
    document.body.style.overflow = show ? "hidden" : "";
  }

  function destroyCropper() {
    if (cropper) {
      try {
        cropper.destroy();
      } catch (e) { /* no-op */ }
      cropper = null;
    }
    if (objectUrl) {
      try {
        URL.revokeObjectURL(objectUrl);
      } catch (e) { /* no-op */ }
      objectUrl = null;
    }
    var img = el("pwcCropperImage");
    if (img) {
      img.src = "";
      img.removeAttribute("src");
    }
  }

  function closeCropModal() {
    destroyCropper();
    showCropUi(false);
    var fin = el("avatarFileInput");
    if (fin) fin.value = "";
  }

  function openCropModal(file) {
    destroyCropper();
    objectUrl = URL.createObjectURL(file);
    var img = el("pwcCropperImage");
    if (!img || typeof global.Cropper === "undefined") {
      if (opts && opts.showMsg) opts.showMsg("Image editor failed to load. Refresh the page.", true);
      return;
    }
    img.src = objectUrl;
    showCropUi(true);
    cropper = new global.Cropper(img, {
      aspectRatio: 1,
      viewMode: 1,
      dragMode: "move",
      autoCropArea: 0.92,
      responsive: true,
      background: false,
    });
  }

  function syncRemoveButton() {
    var btn = el("avatarRemoveBtn");
    if (!btn || !opts || !opts.getUser) return;
    var u = opts.getUser();
    btn.hidden = !(u && u.avatar_custom);
  }

  function uploadCropped() {
    if (!cropper || !opts) return;
    var canvas = cropper.getCroppedCanvas({ width: 512, height: 512, imageSmoothingQuality: "high" });
    if (!canvas) {
      if (opts.showMsg) opts.showMsg("Could not read the cropped image.", true);
      return;
    }
    var saveBtn = el("pwcCropSaveBtn");
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = "Uploading…";
    }
    canvas.toBlob(
      function (blob) {
        if (!blob) {
          if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = "Save photo";
          }
          if (opts.showMsg) opts.showMsg("Could not create image file.", true);
          return;
        }
        ProfileAPI.uploadAvatar(blob)
          .then(function (updated) {
            closeCropModal();
            if (opts.setUser) {
              opts.setUser({
                avatar_url: updated.avatar_url || "",
                avatar_custom: !!updated.avatar_custom,
              });
            }
            if (opts.renderAvatars) opts.renderAvatars();
            syncRemoveButton();
            if (opts.showMsg) opts.showMsg("Profile photo updated.", false);
          })
          .catch(function (err) {
            if (opts.showMsg) opts.showMsg(err.message || "Upload failed.", true);
          })
          .finally(function () {
            if (saveBtn) {
              saveBtn.disabled = false;
              saveBtn.textContent = "Save photo";
            }
          });
      },
      "image/jpeg",
      0.92
    );
  }

  function bindDismiss() {
    document.querySelectorAll("[data-crop-dismiss]").forEach(function (node) {
      node.addEventListener("click", function () {
        closeCropModal();
      });
    });
  }

  global.ProfileAvatar = {
    init: function (options) {
      opts = options || {};
      bindDismiss();

      var pick = el("avatarPickBtn");
      var fin = el("avatarFileInput");
      var rm = el("avatarRemoveBtn");
      var saveCrop = el("pwcCropSaveBtn");

      if (pick && fin) {
        pick.addEventListener("click", function () {
          fin.click();
        });
        fin.addEventListener("change", function () {
          var f = fin.files && fin.files[0];
          if (!f) return;
          if (!/^image\//.test(f.type)) {
            if (opts.showMsg) opts.showMsg("Please choose an image file.", true);
            fin.value = "";
            return;
          }
          if (f.size > 3 * 1024 * 1024) {
            if (opts.showMsg) opts.showMsg("Image must be 3 MB or smaller.", true);
            fin.value = "";
            return;
          }
          openCropModal(f);
        });
      }

      if (saveCrop) {
        saveCrop.addEventListener("click", uploadCropped);
      }

      if (rm) {
        rm.addEventListener("click", function () {
          if (!opts.getUser || !opts.getUser().avatar_custom) return;
          rm.disabled = true;
          ProfileAPI.deleteAvatar()
            .then(function (updated) {
              if (opts.setUser) {
                opts.setUser({
                  avatar_url: updated.avatar_url || "",
                  avatar_custom: !!updated.avatar_custom,
                });
              }
              if (opts.renderAvatars) opts.renderAvatars();
              syncRemoveButton();
              if (opts.showMsg) opts.showMsg("Photo removed.", false);
            })
            .catch(function (err) {
              if (opts.showMsg) opts.showMsg(err.message || "Could not remove photo.", true);
            })
            .finally(function () {
              rm.disabled = false;
            });
        });
      }

      syncRemoveButton();
    },

    syncRemoveButton: syncRemoveButton,
  };
})(typeof window !== "undefined" ? window : this);
