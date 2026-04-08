/* ==========================================================================
   UserProfileModal — shared author / member profile pop-up.
   Self-contained: injects its own overlay HTML, fetches user + friend data,
   renders the card, and handles all friend actions.

   Usage (call once after currentUser is known):
     UserProfileModal.init(currentUser, { onStatusChange: fn(authorId, status) });
   Then to open:
     UserProfileModal.open(userId);
   ========================================================================== */

var UserProfileModal = (function () {
  "use strict";

  /* ── State ───────────────────────────────────────────────────────────── */

  var _currentUser    = null;
  var _onStatusChange = null;   /* callback(authorId, status) */
  var _viewingId      = null;   /* numeric id of user currently shown */

  /* ── HTML injection ──────────────────────────────────────────────────── */

  function inject() {
    if (document.getElementById("upm-overlay")) return;
    var el = document.createElement("div");
    el.id        = "upm-overlay";
    el.className = "pwc-blog-overlay";
    el.style.display = "none";
    el.setAttribute("onclick", "UserProfileModal.close(event)");
    el.innerHTML =
      '<div class="pwc-author-modal-card" onclick="event.stopPropagation()">'
      + '<button class="pwc-blog-close" onclick="UserProfileModal.close()">&times;</button>'
      + '<div id="upm-body"></div>'
      + '</div>';
    document.body.appendChild(el);
  }

  /* ── Public: init ────────────────────────────────────────────────────── */

  function init(user, opts) {
    _currentUser    = user || null;
    _onStatusChange = (opts && opts.onStatusChange) || null;
    if (document.readyState !== "loading") {
      inject();
    } else {
      document.addEventListener("DOMContentLoaded", inject);
    }
  }

  /* ── Public: open ────────────────────────────────────────────────────── */

  function open(userId) {
    if (!_currentUser || typeof FriendsAPI === "undefined") return;
    _viewingId = parseInt(userId, 10);

    if (!document.getElementById("upm-overlay")) inject();
    var overlay = document.getElementById("upm-overlay");
    var body    = document.getElementById("upm-body");

    body.innerHTML = '<div class="pwc-author-modal-loading">Loading profile\u2026</div>';
    overlay.style.display      = "flex";
    document.body.style.overflow = "hidden";

    Promise.all([
      FriendsAPI.getUser(userId),
      FriendsAPI.getStatus(userId),
    ])
      .then(function (res) { render(res[0], res[1].status); })
      .catch(function () {
        body.innerHTML = '<div class="pwc-author-modal-loading">Could not load profile.</div>';
      });
  }

  /* ── Public: close ───────────────────────────────────────────────────── */

  function close(e) {
    /* Allow backdrop click to close; inner-card clicks are stopped upstream */
    if (e && e.target !== document.getElementById("upm-overlay")) return;
    var overlay = document.getElementById("upm-overlay");
    if (overlay) overlay.style.display = "none";
    document.body.style.overflow = "";
  }

  /* ── Helpers ─────────────────────────────────────────────────────────── */

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function friendButtonHtml(authorId, status) {
    var id = parseInt(authorId, 10);
    switch (status) {
      case "none":
        return '<button class="pwc-blog-friend-btn pwc-blog-friend-btn--add"'
          + ' onclick="UserProfileModal.addFriend(' + id + ')">+ Add Friend</button>';
      case "pending_sent":
        return '<span class="pwc-blog-friend-btn pwc-blog-friend-btn--muted">Request Sent</span>';
      case "pending_received":
        return '<button class="pwc-blog-friend-btn pwc-blog-friend-btn--accept"'
          + ' onclick="UserProfileModal.acceptFriend(' + id + ')">Accept</button>'
          + '<button class="pwc-blog-friend-btn pwc-blog-friend-btn--decline"'
          + ' onclick="UserProfileModal.declineFriend(' + id + ')">Decline</button>';
      case "accepted":
        return '<span class="pwc-blog-friend-btn pwc-blog-friend-btn--friends">Friends \u2713</span>';
      default:
        return "";
    }
  }

  /* ── Render ──────────────────────────────────────────────────────────── */

  function render(user, friendStatus) {
    var body = document.getElementById("upm-body");
    if (!body) return;

    var url = (user.avatar_url || "").trim();
    if (url && location.protocol === "https:" && url.indexOf("http://") === 0) {
      url = "https://" + url.slice("http://".length);
    }
    var avatarHtml = url
      ? '<img src="' + escapeHtml(url) + '" class="pwc-author-modal-avatar-img" alt="">'
      : '<span class="pwc-author-modal-avatar-initials">'
          + escapeHtml(
              ((user.firstName || "").charAt(0) + (user.lastName || "").charAt(0)).toUpperCase() || "?"
            )
          + '</span>';

    var name    = ((user.firstName || "") + " " + (user.lastName || "")).trim() || user.username || "Member";
    var bioHtml = user.bio
      ? '<p class="pwc-author-modal-bio">' + escapeHtml(user.bio) + '</p>'
      : "";
    var interests = user.interests || [];
    var tagHtml = interests.length
      ? '<div class="pwc-author-modal-tags">'
          + interests.map(function (t) {
              return '<span class="pwc-tag pwc-tag--rose">' + escapeHtml(t) + "</span>";
            }).join("")
          + "</div>"
      : "";
    var friendBtnHtml = (_currentUser && user.id !== _currentUser.id)
      ? '<div class="pwc-author-modal-friend" id="upm-friend-btn">'
          + friendButtonHtml(user.id, friendStatus)
          + "</div>"
      : "";

    body.innerHTML =
      '<div class="pwc-author-modal-avatar">' + avatarHtml + "</div>"
      + '<div class="pwc-author-modal-name">'     + escapeHtml(name)                 + "</div>"
      + '<div class="pwc-author-modal-username">@' + escapeHtml(user.username || "") + "</div>"
      + bioHtml + tagHtml + friendBtnHtml;
  }

  /* ── Public: update the friend button inside the modal ──────────────── */

  function updateFriendButton(authorId, status) {
    if (_viewingId !== parseInt(authorId, 10)) return;
    var wrap = document.getElementById("upm-friend-btn");
    if (wrap) wrap.innerHTML = friendButtonHtml(authorId, status);
  }

  /* ── Public: friend actions (called from modal HTML) ────────────────── */

  function addFriend(authorId) {
    if (typeof FriendsAPI === "undefined") return;
    FriendsAPI.sendRequest(authorId)
      .then(function () {
        updateFriendButton(authorId, "pending_sent");
        if (_onStatusChange) _onStatusChange(authorId, "pending_sent");
      })
      .catch(function (err) { alert(err.message); });
  }

  function acceptFriend(authorId) {
    if (typeof FriendsAPI === "undefined") return;
    FriendsAPI.accept(authorId)
      .then(function () {
        updateFriendButton(authorId, "accepted");
        if (_onStatusChange) _onStatusChange(authorId, "accepted");
      })
      .catch(function (err) { alert(err.message); });
  }

  function declineFriend(authorId) {
    if (typeof FriendsAPI === "undefined") return;
    FriendsAPI.decline(authorId)
      .then(function () {
        updateFriendButton(authorId, "none");
        if (_onStatusChange) _onStatusChange(authorId, "none");
      })
      .catch(function (err) { alert(err.message); });
  }

  /* ── Public API ──────────────────────────────────────────────────────── */

  return {
    init:               init,
    open:               open,
    close:              close,
    updateFriendButton: updateFriendButton,
    addFriend:          addFriend,
    acceptFriend:       acceptFriend,
    declineFriend:      declineFriend,
  };

})();
