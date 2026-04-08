/* ==========================================================================
   ProfileMessages — direct-messaging (DM) feature backed by the real API.
   Replaces the old localStorage demo with live /api/messages endpoints.
   Depends on: FriendsAPI (must be loaded first).
   Call ProfileMessages.init(user) to activate.
   ========================================================================== */

var ProfileMessages = (function () {
  "use strict";

  /* ── Private state ───────────────────────────────────────────────────── */

  var currentUser   = null;
  var activeContact = null;   /* user object from API */
  var conversations = [];     /* from GET /api/messages/conversations */
  var threadCache   = {};     /* userId → messages array */

  /* ── Helpers ─────────────────────────────────────────────────────────── */

  function el(id) { return document.getElementById(id); }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatTime(iso) {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function formatDate(iso) {
    var d         = new Date(iso);
    var today     = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString())     return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  }

  function userInitials(u) {
    return ((u.firstName || "").charAt(0) + (u.lastName || "").charAt(0)).toUpperCase() || "?";
  }

  function userDisplayName(u) {
    var name = ((u.firstName || "") + " " + (u.lastName || "")).trim();
    return name || u.username || "Member";
  }

  /* ── Unread badge ────────────────────────────────────────────────────── */

  function updateUnreadBadge() {
    FriendsAPI.getUnreadCount()
      .then(function (data) {
        var n     = data.unread || 0;
        var badge = el("unreadBadge");
        if (!badge) return;
        if (n > 0) { badge.style.display = ""; badge.textContent = n > 99 ? "99+" : String(n); }
        else        { badge.style.display = "none"; }
      })
      .catch(function () {});
  }

  /* ── Conversation list ───────────────────────────────────────────────── */

  function loadConversations() {
    FriendsAPI.getConversations()
      .then(function (data) {
        conversations = data || [];
        renderDmList(el("dmSearch") ? el("dmSearch").value : "");
      })
      .catch(function () {
        conversations = [];
        renderDmList("");
      });
  }

  function renderDmList(filter) {
    filter = (filter || "").toLowerCase();
    var list = el("dmList");
    if (!list) return;
    list.innerHTML = "";

    if (!conversations.length) {
      var empty = document.createElement("li");
      empty.className = "pwc-dm-list-empty";
      empty.textContent = "No conversations yet. Add friends and start messaging!";
      list.appendChild(empty);
      return;
    }

    conversations.forEach(function (convo) {
      var contact = convo.user;
      var name    = userDisplayName(contact);
      if (filter && !name.toLowerCase().includes(filter)) return;

      var last    = convo.last_message;
      var unread  = convo.unread_count || 0;
      var isActive = activeContact && activeContact.id === contact.id;

      var li = document.createElement("li");
      li.className = "pwc-dm-item"
        + (unread   ? " has-unread" : "")
        + (isActive ? " active"     : "");

      var lastPreview = "";
      if (last) {
        lastPreview = last.sender_id === currentUser.id
          ? "You: " + escapeHtml(last.body)
          : escapeHtml(last.body);
      } else {
        lastPreview = "No messages yet";
      }

      li.innerHTML =
        '<div class="pwc-dm-item-avatar">' + escapeHtml(userInitials(contact)) + "</div>" +
        '<div class="pwc-dm-item-body">' +
          '<div class="pwc-dm-item-name">' + escapeHtml(name) + "</div>" +
          '<div class="pwc-dm-item-preview">' + lastPreview + "</div>" +
        "</div>" +
        '<div class="pwc-dm-item-meta">' +
          '<div class="pwc-dm-item-time">'   + (last ? formatTime(last.created_at) : "") + "</div>" +
          '<div class="pwc-dm-item-unread">' + (unread || "")                            + "</div>" +
        "</div>";

      li.addEventListener("click", function () { openConvo(contact); });
      list.appendChild(li);
    });
  }

  /* ── Active conversation ─────────────────────────────────────────────── */

  function openConvo(contact) {
    activeContact = contact;

    el("convoAvatar").textContent = userInitials(contact);
    el("convoName").textContent   = userDisplayName(contact);
    el("convoStatus").textContent = contact.role || "Member";

    el("dmEmpty").style.display = "none";
    el("dmConvo").style.display = "flex";

    renderDmList(el("dmSearch") ? el("dmSearch").value : "");

    /* Load thread from API */
    FriendsAPI.getThread(contact.id)
      .then(function (data) {
        threadCache[contact.id] = data.messages || [];
        renderMessages(threadCache[contact.id]);
        /* Mark as read */
        FriendsAPI.markRead(contact.id)
          .then(function () {
            /* Update unread count in conversation list */
            conversations.forEach(function (c) {
              if (c.user.id === contact.id) c.unread_count = 0;
            });
            renderDmList(el("dmSearch") ? el("dmSearch").value : "");
            updateUnreadBadge();
          })
          .catch(function () {});
      })
      .catch(function (err) {
        var container = el("dmMessages");
        container.innerHTML = '<div class="pwc-dm-thread-error">' + escapeHtml(err.message || "Could not load messages") + '</div>';
      });

    if (el("dmInput")) el("dmInput").focus();
  }

  /* Open a conversation by user ID — called from Friends page "Message" button */
  function openConvoById(userId, userInfo) {
    /* Check if we already have a conversation with this user */
    var existing = null;
    for (var i = 0; i < conversations.length; i++) {
      if (conversations[i].user.id === userId) { existing = conversations[i].user; break; }
    }
    if (existing) {
      openConvo(existing);
      return;
    }
    /* New conversation — use the provided user info */
    if (userInfo) {
      openConvo(userInfo);
    }
  }

  function renderMessages(messages) {
    var container = el("dmMessages");
    if (!container) return;
    container.innerHTML = "";

    if (!messages || messages.length === 0) {
      var hint = document.createElement("div");
      hint.className = "pwc-dm-thread-hint";
      hint.textContent = "No messages yet. Say hello!";
      container.appendChild(hint);
      return;
    }

    var lastDate = null;
    messages.forEach(function (msg) {
      var dateLabel = formatDate(msg.created_at);
      if (dateLabel !== lastDate) {
        lastDate = dateLabel;
        var divider = document.createElement("div");
        divider.className = "pwc-dm-date-divider";
        divider.innerHTML = "<span>" + escapeHtml(dateLabel) + "</span>";
        container.appendChild(divider);
      }

      var isMine = msg.sender_id === currentUser.id;
      var wrap   = document.createElement("div");
      wrap.className = "pwc-dm-bubble-wrap " + (isMine ? "mine" : "theirs");
      wrap.innerHTML =
        '<div class="pwc-dm-bubble">'      + escapeHtml(msg.body)        + "</div>" +
        '<div class="pwc-dm-bubble-time">' + formatTime(msg.created_at)  + "</div>";
      container.appendChild(wrap);
    });

    container.scrollTop = container.scrollHeight;
  }

  /* ── Send message ────────────────────────────────────────────────────── */

  function sendMessage() {
    if (!activeContact) return;
    var input = el("dmInput");
    var text  = input.value.trim();
    if (!text) return;

    var sendBtn = el("dmSend");
    if (sendBtn) sendBtn.disabled = true;

    FriendsAPI.sendMessage(activeContact.id, text)
      .then(function (msg) {
        input.value        = "";
        input.style.height = "";

        /* Append new message to cache and re-render */
        if (!threadCache[activeContact.id]) threadCache[activeContact.id] = [];
        threadCache[activeContact.id].push(msg);
        renderMessages(threadCache[activeContact.id]);

        /* Refresh conversation list to update preview */
        loadConversations();
      })
      .catch(function (err) {
        alert(err.message || "Could not send message.");
      })
      .finally(function () {
        if (sendBtn) sendBtn.disabled = false;
      });
  }

  /* ── Event binding ───────────────────────────────────────────────────── */

  function bindEvents() {
    var sendBtn = el("dmSend");
    if (sendBtn) sendBtn.addEventListener("click", sendMessage);

    var input = el("dmInput");
    if (input) {
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
      });
      input.addEventListener("input", function () {
        this.style.height = "";
        this.style.height = Math.min(this.scrollHeight, 120) + "px";
      });
    }

    var searchInput = el("dmSearch");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        renderDmList(this.value);
      });
    }
  }

  /* ── Public init ─────────────────────────────────────────────────────── */

  function init(user) {
    currentUser = user;
    bindEvents();
    loadConversations();
    updateUnreadBadge();
  }

  return {
    init:              init,
    openConvoById:     openConvoById,
    renderDmList:      renderDmList,
    updateUnreadBadge: updateUnreadBadge,
    reload:            loadConversations,
  };

})();
