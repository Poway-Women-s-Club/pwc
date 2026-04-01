/**
 * profile.js — Poway Woman's Club
 *
 * Coordinator: validates the session (via ProfileAPI), then initialises
 * the profile UI and hands off the messaging feature to ProfileMessages.
 *
 * Depends on (must be loaded first):
 *   profile-api.js      — HTTP calls
 *   profile-messages.js — DM system
 *
 * SESSION CONTRACT (must match login.js):
 *   sessionStorage.setItem('pwc_user', JSON.stringify({
 *     id, username, firstName, lastName, email, role,
 *     bio, languages[], interests[]
 *   }));
 */

(function () {
  "use strict";

  /* ── Config ──────────────────────────────────────────────────────────── */

  var LOGIN_URL = (window.PWC_BASE || "/pwc") + "/navigation/login";

  /* ── Helpers ─────────────────────────────────────────────────────────── */

  function el(id) { return document.getElementById(id); }

  function getInitials(u) {
    return ((u.firstName || "").charAt(0) + (u.lastName || "").charAt(0)).toUpperCase() || "?";
  }

  function showMsg(msgEl, text, isError) {
    msgEl.textContent = text;
    msgEl.className   = "pwc-save-msg visible" + (isError ? " error" : "");
    setTimeout(function () { msgEl.className = "pwc-save-msg"; }, 3000);
  }

  function getSession() {
    try { return JSON.parse(sessionStorage.getItem("pwc_user")); }
    catch (_) { return null; }
  }

  function saveSession(user) {
    sessionStorage.setItem("pwc_user", JSON.stringify(user));
  }

  /* ── Auth check — validate session against backend ───────────────────── */

  var cachedUser = getSession();

  /* Show app immediately with cached data while we wait for backend */
  if (cachedUser) {
    el("pwc-auth-gate").style.display  = "none";
    el("pwc-profile-app").style.display = "block";
  } else {
    el("pwc-auth-gate").style.display  = "";
    el("pwc-profile-app").style.display = "none";
  }

  ProfileAPI.validateSession()
    .then(function (backendUser) {
      var user = {
        id:        backendUser.id,
        username:  backendUser.username,
        email:     backendUser.email,
        role:      backendUser.role,
        firstName: backendUser.firstName || "",
        lastName:  backendUser.lastName  || "",
        bio:       backendUser.bio       || "",
        languages: backendUser.languages || [],
        interests: backendUser.interests || [],
        hasGoogleLinked: !!backendUser.hasGoogleLinked,
      };
      saveSession(user);
      initApp(user);
    })
    .catch(function () {
      sessionStorage.removeItem("pwc_user");
      el("pwc-auth-gate").style.display  = "";
      el("pwc-profile-app").style.display = "none";
    });

  /* ── Main app initialisation ─────────────────────────────────────────── */

  function initApp(user) {
    el("pwc-auth-gate").style.display  = "none";
    el("pwc-profile-app").style.display = "block";

    /* Hand off the entire messaging feature */
    ProfileMessages.init(user);

    /* ── View switching (Profile ↔ Messages topbar) ────────────────────── */

    function switchView(viewName) {
      document.querySelectorAll(".pwc-topbar-tab").forEach(function (btn) {
        btn.classList.toggle("active", btn.getAttribute("data-view") === viewName);
      });
      document.querySelectorAll(".pwc-view").forEach(function (v) {
        v.classList.toggle("active", v.id === "view-" + viewName);
      });
      document.body.style.overflow = (viewName === "messages") ? "hidden" : "";
      window.scrollTo(0, 0);
    }

    document.querySelectorAll(".pwc-topbar-tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        switchView(btn.getAttribute("data-view"));
      });
    });

    /* ── Topbar display ────────────────────────────────────────────────── */

    function renderTopbar() {
      el("topbarName").textContent   = (user.firstName + " " + user.lastName).trim() || user.username;
      el("topbarAvatar").textContent = getInitials(user);
    }

    /* ── Profile overview rendering ────────────────────────────────────── */

    function renderTagList(containerId, items, useRose) {
      var container = el(containerId);
      container.innerHTML = "";
      if (!items.length) {
        container.innerHTML = '<span style="font-size:0.82rem;color:var(--pwc-muted)">None added yet</span>';
        return;
      }
      items.forEach(function (item) {
        var span = document.createElement("span");
        span.className   = "pwc-tag" + (useRose ? " pwc-tag--rose" : "");
        span.textContent = item;
        container.appendChild(span);
      });
    }

    function renderOverview() {
      el("avatarInitials").textContent = getInitials(user);
      el("topbarAvatar").textContent   = getInitials(user);
      el("sidebarName").textContent    = (user.firstName + " " + user.lastName).trim() || user.username;
      el("topbarName").textContent     = (user.firstName + " " + user.lastName).trim() || user.username;
      el("sidebarEmail").textContent   = user.email || "";
      el("ov-name").textContent        = ((user.firstName || "") + " " + (user.lastName || "")).trim() || "—";
      el("ov-email").textContent       = user.email || "—";
      el("ov-bio").textContent         = user.bio   || "—";
      renderTagList("ov-languages", user.languages || [], false);
      renderTagList("ov-interests", user.interests  || [], true);
      loadUserGroups();
    }

    function loadUserGroups() {
      var container = el("ov-groups");
      if (!container) return;
      if (typeof GroupAPI === "undefined") {
        container.innerHTML = '<span style="font-size:0.82rem;color:var(--pwc-muted)">—</span>';
        return;
      }
      GroupAPI.getMyGroups()
        .then(function (groups) {
          if (!groups || !groups.length) {
            container.innerHTML = '<span style="font-size:0.82rem;color:var(--pwc-muted)">No groups joined yet</span>';
            return;
          }
          container.innerHTML = "";
          groups.forEach(function (g) {
            var span = document.createElement("span");
            span.className   = "pwc-tag";
            span.textContent = g.name;
            container.appendChild(span);
          });
        })
        .catch(function () {
          container.innerHTML = '<span style="font-size:0.82rem;color:var(--pwc-muted)">—</span>';
        });
    }

    /* ── Edit form — tag chips ──────────────────────────────────────────── */

    var langTags     = (user.languages || []).slice();
    var interestTags = (user.interests  || []).slice();

    function renderChips(containerId, tags, useRose) {
      var container = el(containerId);
      container.innerHTML = "";
      tags.forEach(function (tag, i) {
        var chip  = document.createElement("span");
        chip.className = "pwc-chip" + (useRose ? " pwc-chip--rose" : "");
        var label = document.createElement("span");
        label.textContent = tag;
        var btn = document.createElement("button");
        btn.className   = "pwc-chip-remove";
        btn.textContent = "\u00d7";
        btn.setAttribute("type", "button");
        btn.addEventListener("click", (function (idx, arr, cId, rose) {
          return function () { arr.splice(idx, 1); renderChips(cId, arr, rose); };
        })(i, tags, containerId, useRose));
        chip.appendChild(label);
        chip.appendChild(btn);
        container.appendChild(chip);
      });
    }

    function bindTagInput(inputId, tags, chipsId, useRose) {
      var input = el(inputId);
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === ",") {
          e.preventDefault();
          var val = input.value.trim().replace(/,$/, "");
          if (val && !tags.includes(val)) { tags.push(val); renderChips(chipsId, tags, useRose); }
          input.value = "";
        }
        if (e.key === "Backspace" && input.value === "" && tags.length) {
          tags.pop(); renderChips(chipsId, tags, useRose);
        }
      });
    }

    function fillEditForm() {
      el("firstName").value = user.firstName || "";
      el("lastName").value  = user.lastName  || "";
      el("email").value     = user.email     || "";
      el("bio").value       = user.bio       || "";
      // Mutate in place so the bindTagInput closures keep the correct reference.
      // Reassigning the variables would silently disconnect the keydown handlers.
      langTags.splice(0, langTags.length);
      (user.languages || []).forEach(function (l) { langTags.push(l); });
      interestTags.splice(0, interestTags.length);
      (user.interests || []).forEach(function (i) { interestTags.push(i); });
      renderChips("langChips",     langTags,     false);
      renderChips("interestChips", interestTags, true);
    }

    bindTagInput("langInput",     langTags,     "langChips",     false);
    bindTagInput("interestInput", interestTags, "interestChips", true);

    function renderGoogleLinkUi() {
      var status = el("googleLinkStatus");
      var btn = el("googleLinkBtn");
      if (!status || !btn) { return; }
      if (user.hasGoogleLinked) {
        status.textContent =
          "Your member account is linked with Google. You can turn on email reminders when you RSVP to events on the calendar.";
        btn.hidden = true;
      } else {
        status.textContent =
          "Link Google using the same email as your profile (" +
          (user.email || "") +
          ") to receive meeting reminders.";
        btn.hidden = false;
      }
    }
    renderGoogleLinkUi();

    /* ── Save profile ───────────────────────────────────────────────────── */

    el("saveBtn").addEventListener("click", function () {
      var fn = el("firstName").value.trim();
      var ln = el("lastName").value.trim();
      var em = el("email").value.trim();
      if (!fn || !ln) { showMsg(el("saveMsg"), "First and last name are required.", true); return; }
      if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { showMsg(el("saveMsg"), "Please enter a valid email.", true); return; }

      var saveBtn = el("saveBtn");
      saveBtn.disabled    = true;
      saveBtn.textContent = "Saving\u2026";

      ProfileAPI.saveProfile({
        firstName: fn,
        lastName:  ln,
        email:     em,
        bio:       el("bio").value.trim(),
        languages: langTags.slice(),
        interests: interestTags.slice(),
      })
        .then(function (updated) {
          user.firstName = updated.firstName || "";
          user.lastName  = updated.lastName  || "";
          user.email     = updated.email     || "";
          user.bio       = updated.bio       || "";
          user.languages = updated.languages || [];
          user.interests = updated.interests || [];
          user.hasGoogleLinked = !!updated.hasGoogleLinked;
          saveSession(user);
          renderOverview();
          renderGoogleLinkUi();
          showMsg(el("saveMsg"), "Profile saved.", false);
        })
        .catch(function (err) {
          showMsg(el("saveMsg"), err.message || "Failed to save.", true);
        })
        .finally(function () {
          saveBtn.disabled    = false;
          saveBtn.textContent = "Save Changes";
        });
    });

    /* ── Change password ────────────────────────────────────────────────── */

    el("changePwBtn").addEventListener("click", function () {
      var cur = el("currentPw").value;
      var nw  = el("newPw").value;
      var cf  = el("confirmPw").value;

      if (!cur || !nw || !cf) { showMsg(el("pwMsg"), "All fields are required.",                   true); return; }
      if (nw.length < 8)       { showMsg(el("pwMsg"), "Password must be at least 8 characters.",   true); return; }
      if (nw !== cf)            { showMsg(el("pwMsg"), "Passwords do not match.",                   true); return; }

      var pwBtn = el("changePwBtn");
      pwBtn.disabled    = true;
      pwBtn.textContent = "Updating\u2026";

      ProfileAPI.changePassword(cur, nw, cf)
        .then(function () {
          el("currentPw").value = "";
          el("newPw").value     = "";
          el("confirmPw").value = "";
          showMsg(el("pwMsg"), "Password updated.", false);
        })
        .catch(function (err) {
          showMsg(el("pwMsg"), err.message || "Failed to update password.", true);
        })
        .finally(function () {
          pwBtn.disabled    = false;
          pwBtn.textContent = "Update Password";
        });
    });

    el("googleLinkBtn").addEventListener("click", function () {
      var gBtn = el("googleLinkBtn");
      gBtn.disabled = true;
      ProfileAPI.linkGoogle()
        .then(function (updated) {
          user.hasGoogleLinked = !!updated.hasGoogleLinked;
          saveSession(user);
          renderGoogleLinkUi();
          showMsg(el("googleLinkMsg"), "Google account connected.", false);
        })
        .catch(function (err) {
          showMsg(el("googleLinkMsg"), err.message || "Could not link Google.", true);
        })
        .finally(function () {
          gBtn.disabled = false;
        });
    });

    /* ── Logout ─────────────────────────────────────────────────────────── */

    el("logoutBtn").addEventListener("click", function () {
      ProfileAPI.logout().finally(function () {
        sessionStorage.removeItem("pwc_user");
        window.location.href = LOGIN_URL;
      });
    });

    /* ── Profile sidebar tab switching ──────────────────────────────────── */

    document.querySelectorAll(".pwc-sidenav-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-tab");
        document.querySelectorAll(".pwc-sidenav-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        document.querySelectorAll(".pwc-tab").forEach(function (t) { t.classList.remove("active"); });
        el("tab-" + target).classList.add("active");
        if (target === "edit") { fillEditForm(); }
      });
    });

    /* ── Cursor picker ──────────────────────────────────────────────────── */

    function buildCursorSwatch(c, saved) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pwc-cursor-swatch" + (c.key === saved ? " active" : "");
      btn.setAttribute("data-cursor", c.key);
      btn.title = c.label;

      var preview = document.createElement("div");
      preview.className = "pwc-cursor-preview";

      if (c.key === "default") {
        preview.classList.add("pwc-cursor-preview--default");
        preview.innerHTML =
          "<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'>" +
          "<path d='M5 2 L5 22 L10 17 L13 25 L16 24 L13 16 L19 16 Z'" +
          " fill='#555' stroke='#fff' stroke-width='1.5' stroke-linejoin='round'/>" +
          "</svg>";
      } else if (c.isFlower) {
        /* Flower cursor: show the flower shape on a neutral background */
        preview.innerHTML =
          "<span style='filter:drop-shadow(0 1px 2px rgba(0,0,0,0.25))'>" +
          CursorManager.buildFlowerSVG(c.fill, c.stroke, 36) +
          "</span>";
      } else {
        /* Arrow cursors: show the arrow on a background matching the cursor color */
        /* White cursor needs a dark background so it's visible */
        preview.style.background = c.key === "white" ? "#333333" : c.fill;
        var svgFill   = c.fill;
        var svgStroke = c.stroke;
        preview.innerHTML =
          "<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28'" +
          " style='filter:drop-shadow(0 1px 2px rgba(0,0,0,0.35))'>" +
          "<path d='M5 2 L5 22 L10 17 L13 25 L16 24 L13 16 L19 16 Z'" +
          " fill='" + svgFill + "' stroke='" + svgStroke + "'" +
          " stroke-width='1.5' stroke-linejoin='round'/>" +
          "</svg>";
      }

      var label = document.createElement("span");
      label.className = "pwc-cursor-label";
      label.textContent = c.label;

      btn.appendChild(preview);
      btn.appendChild(label);

      btn.addEventListener("click", function () {
        if (typeof CursorManager !== "undefined") { CursorManager.apply(c.key); }
        document.querySelectorAll(".pwc-cursor-swatch").forEach(function (s) {
          s.classList.remove("active");
        });
        btn.classList.add("active");
        showMsg(el("cursorMsg"), "Cursor updated.", false);
      });

      return btn;
    }

    function initCursorPicker() {
      var stdGrid    = el("cursorGridStandard");
      var themedGrid = el("cursorGridThemed");
      if (!stdGrid || !themedGrid || typeof CursorManager === "undefined") return;

      var saved = CursorManager.getSaved();
      CursorManager.CURSORS.forEach(function (c) {
        var swatch = buildCursorSwatch(c, saved);
        if (c.group === "themed") {
          themedGrid.appendChild(swatch);
        } else {
          stdGrid.appendChild(swatch);
        }
      });
    }

    initCursorPicker();

    /* ── Hide footer (full-app mode) ─────────────────────────────────────── */

    var footer = document.querySelector(".site-footer");
    if (footer) footer.style.display = "none";

    /* ── Initial render ──────────────────────────────────────────────────── */

    renderOverview();
    fillEditForm();
    renderTopbar();
  }

})();
