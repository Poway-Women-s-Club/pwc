/* ==========================================================================
   ProfileFriends — friends list and pending requests view.
   Single responsibility: render and manage the Friends tab on the profile page.
   Depends on: FriendsAPI (must be loaded first).
   Call ProfileFriends.init(user, callbacks) to activate.
   ========================================================================== */

var ProfileFriends = (function () {
  "use strict";

  /* ── Private state ───────────────────────────────────────────────────── */

  var currentUser      = null;
  var onMessage        = null;   /* callback(userObj) */
  var onRequestsLoaded = null;   /* callback(count) */

  /* ── Helpers ─────────────────────────────────────────────────────────── */

  function el(id) { return document.getElementById(id); }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function userDisplayName(u) {
    var name = ((u.firstName || "") + " " + (u.lastName || "")).trim();
    return name || u.username || "Member";
  }

  function userInitials(u) {
    return ((u.firstName || "").charAt(0) + (u.lastName || "").charAt(0)).toUpperCase() || "?";
  }

  /* ── Render helpers ──────────────────────────────────────────────────── */

  function makeAvatar(u) {
    if (u.avatar_url) {
      return '<div class="pwc-friend-avatar"><img src="' + escapeHtml(u.avatar_url) + '" alt="" class="pwc-friend-avatar-img"></div>';
    }
    return '<div class="pwc-friend-avatar">' + escapeHtml(userInitials(u)) + '</div>';
  }

  /* ── Pending requests section ────────────────────────────────────────── */

  function renderRequests(container, requests) {
    var section = document.createElement("section");
    section.className = "pwc-friends-section";

    var heading = document.createElement("h2");
    heading.className = "pwc-friends-section-title";
    heading.textContent = "Pending Requests (" + requests.length + ")";
    section.appendChild(heading);

    if (!requests.length) {
      var empty = document.createElement("p");
      empty.className = "pwc-friends-empty";
      empty.textContent = "No pending friend requests.";
      section.appendChild(empty);
      container.appendChild(section);
      return;
    }

    var list = document.createElement("ul");
    list.className = "pwc-friends-list";

    requests.forEach(function (item) {
      var u = item.user;
      var li = document.createElement("li");
      li.className = "pwc-friend-card";

      li.innerHTML =
        makeAvatar(u) +
        '<div class="pwc-friend-card-info">' +
          '<div class="pwc-friend-card-name">' + escapeHtml(userDisplayName(u)) + '</div>' +
          '<div class="pwc-friend-card-sub">'  + escapeHtml(u.username || "") + '</div>' +
        '</div>' +
        '<div class="pwc-friend-card-actions" id="req-actions-' + u.id + '">' +
          '<button class="pwc-btn pwc-btn-sage pwc-btn-sm" data-accept="' + u.id + '">Accept</button>' +
          '<button class="pwc-btn pwc-btn-border pwc-btn-sm" data-decline="' + u.id + '">Decline</button>' +
        '</div>';

      li.querySelector('[data-accept]').addEventListener("click", function () {
        handleAccept(u, li.querySelector('#req-actions-' + u.id));
      });
      li.querySelector('[data-decline]').addEventListener("click", function () {
        handleDecline(u, li);
      });

      list.appendChild(li);
    });

    section.appendChild(list);
    container.appendChild(section);
  }

  function handleAccept(u, actionsEl) {
    FriendsAPI.accept(u.id)
      .then(function () {
        actionsEl.innerHTML = '<span class="pwc-friend-status-tag pwc-friend-status-tag--accepted">Friends ✓</span>';
        /* Reload the full view to move them to the friends list */
        setTimeout(load, 800);
      })
      .catch(function (err) { alert(err.message); });
  }

  function handleDecline(u, liEl) {
    FriendsAPI.decline(u.id)
      .then(function () {
        liEl.style.opacity = "0.4";
        liEl.style.pointerEvents = "none";
        setTimeout(function () { liEl.remove(); }, 500);
        /* Update badge */
        load();
      })
      .catch(function (err) { alert(err.message); });
  }

  /* ── Friends list section ────────────────────────────────────────────── */

  function renderFriendsList(container, friends) {
    var section = document.createElement("section");
    section.className = "pwc-friends-section";

    var heading = document.createElement("h2");
    heading.className = "pwc-friends-section-title";
    heading.textContent = "Friends (" + friends.length + ")";
    section.appendChild(heading);

    if (!friends.length) {
      var empty = document.createElement("p");
      empty.className = "pwc-friends-empty";
      empty.textContent = "You haven't added any friends yet. Add someone from a blog post!";
      section.appendChild(empty);
      container.appendChild(section);
      return;
    }

    var list = document.createElement("ul");
    list.className = "pwc-friends-list";

    friends.forEach(function (u) {
      var li = document.createElement("li");
      li.className = "pwc-friend-card";

      li.innerHTML =
        makeAvatar(u) +
        '<div class="pwc-friend-card-info">' +
          '<div class="pwc-friend-card-name">' + escapeHtml(userDisplayName(u)) + '</div>' +
          '<div class="pwc-friend-card-sub">'  + escapeHtml(u.username || "") + '</div>' +
        '</div>' +
        '<div class="pwc-friend-card-actions">' +
          '<button class="pwc-btn pwc-btn-sage pwc-btn-sm" data-msg="' + u.id + '">Message</button>' +
          '<button class="pwc-btn pwc-btn-border pwc-btn-sm pwc-btn-danger-outline" data-unfriend="' + u.id + '">Unfriend</button>' +
        '</div>';

      li.querySelector('[data-msg]').addEventListener("click", function () {
        if (typeof onMessage === "function") onMessage(u);
      });

      li.querySelector('[data-unfriend]').addEventListener("click", function () {
        handleUnfriend(u, li);
      });

      list.appendChild(li);
    });

    section.appendChild(list);
    container.appendChild(section);
  }

  function handleUnfriend(u, liEl) {
    if (!confirm("Remove " + userDisplayName(u) + " as a friend?")) return;
    FriendsAPI.unfriend(u.id)
      .then(function () {
        liEl.style.opacity = "0.4";
        liEl.style.pointerEvents = "none";
        setTimeout(function () { liEl.remove(); }, 500);
      })
      .catch(function (err) { alert(err.message); });
  }

  /* ── Load / render ───────────────────────────────────────────────────── */

  function load() {
    var container = el("friends-view-content");
    if (!container) return;

    container.innerHTML = '<div class="pwc-friends-loading">Loading…</div>';

    Promise.all([FriendsAPI.getRequests(), FriendsAPI.getFriends()])
      .then(function (results) {
        var requests = results[0] || [];
        var friends  = results[1] || [];

        container.innerHTML = "";
        renderRequests(container, requests);
        renderFriendsList(container, friends);

        if (typeof onRequestsLoaded === "function") {
          onRequestsLoaded(requests.length);
        }
      })
      .catch(function () {
        container.innerHTML = '<div class="pwc-friends-empty">Could not load friends. Is the backend running?</div>';
      });
  }

  /* ── Search ──────────────────────────────────────────────────────────── */

  var searchTimer = null;

  function initSearch() {
    var input   = el("friendSearchInput");
    var results = el("friendSearchResults");
    if (!input || !results) return;

    input.addEventListener("input", function () {
      clearTimeout(searchTimer);
      var q = input.value.trim();
      if (!q) {
        results.hidden = true;
        results.innerHTML = "";
        return;
      }
      searchTimer = setTimeout(function () { runSearch(q, results); }, 300);
    });
  }

  function runSearch(q, results) {
    results.innerHTML = '<p class="pwc-friends-empty">Searching…</p>';
    results.hidden = false;

    FriendsAPI.searchUsers(q)
      .then(function (users) {
        renderSearchResults(results, users || []);
      })
      .catch(function () {
        results.innerHTML = '<p class="pwc-friends-empty">Search failed. Is the backend running?</p>';
      });
  }

  function renderSearchResults(results, users) {
    results.innerHTML = "";

    if (!users.length) {
      results.innerHTML = '<p class="pwc-friends-empty">No members found.</p>';
      return;
    }

    var list = document.createElement("ul");
    list.className = "pwc-friends-list";

    users.forEach(function (u) {
      var li = document.createElement("li");
      li.className = "pwc-friend-card";

      var actionsId = "search-actions-" + u.id;
      li.innerHTML =
        makeAvatar(u) +
        '<div class="pwc-friend-card-info">' +
          '<div class="pwc-friend-card-name">' + escapeHtml(userDisplayName(u)) + '</div>' +
          '<div class="pwc-friend-card-sub">'  + escapeHtml(u.username || "") + '</div>' +
        '</div>' +
        '<div class="pwc-friend-card-actions" id="' + actionsId + '">' +
          buildSearchActionBtn(u) +
        '</div>';

      wireSearchActions(li, u, actionsId);
      list.appendChild(li);
    });

    results.appendChild(list);
  }

  function buildSearchActionBtn(u) {
    switch (u.friendship_status) {
      case "accepted":
        return '<span class="pwc-friend-status-tag pwc-friend-status-tag--accepted">Already Friends</span>';
      case "pending_sent":
        return '<button class="pwc-btn pwc-btn-border pwc-btn-sm" disabled>Request Sent</button>';
      case "pending_received":
        return '<button class="pwc-btn pwc-btn-sage pwc-btn-sm" data-search-accept="' + u.id + '">Accept</button>';
      default:
        /* "none" or "declined" */
        return '<button class="pwc-btn pwc-btn-fill pwc-btn-sm" data-search-add="' + u.id + '">Add Friend</button>';
    }
  }

  function wireSearchActions(li, u, actionsId) {
    var addBtn    = li.querySelector('[data-search-add]');
    var acceptBtn = li.querySelector('[data-search-accept]');
    var actionsEl = el(actionsId);

    if (addBtn) {
      addBtn.addEventListener("click", function () {
        addBtn.disabled = true;
        FriendsAPI.sendRequest(u.id)
          .then(function () {
            actionsEl.innerHTML = '<button class="pwc-btn pwc-btn-border pwc-btn-sm" disabled>Request Sent</button>';
          })
          .catch(function (err) {
            addBtn.disabled = false;
            alert(err.message);
          });
      });
    }

    if (acceptBtn) {
      acceptBtn.addEventListener("click", function () {
        acceptBtn.disabled = true;
        FriendsAPI.accept(u.id)
          .then(function () {
            actionsEl.innerHTML = '<span class="pwc-friend-status-tag pwc-friend-status-tag--accepted">Friends ✓</span>';
            setTimeout(load, 800);
          })
          .catch(function (err) {
            acceptBtn.disabled = false;
            alert(err.message);
          });
      });
    }
  }

  /* ── Public init ─────────────────────────────────────────────────────── */

  function init(user, callbacks) {
    currentUser      = user;
    onMessage        = (callbacks && callbacks.onMessage)        || null;
    onRequestsLoaded = (callbacks && callbacks.onRequestsLoaded) || null;

    initSearch();

    /* Pre-fetch request count for badge */
    FriendsAPI.getRequests()
      .then(function (requests) {
        if (typeof onRequestsLoaded === "function") {
          onRequestsLoaded((requests || []).length);
        }
      })
      .catch(function () {});
  }

  return {
    init: init,
    load: load,
  };

})();
