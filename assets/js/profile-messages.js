/* ==========================================================================
   ProfileMessages — the complete direct-messaging (DM) feature.
   Single responsibility: manage, store, and render member conversations.
   Depends on: nothing. Call ProfileMessages.init(user) to activate.
   ========================================================================== */

var ProfileMessages = (function () {
  "use strict";

  /* ── Private state ───────────────────────────────────────────────────── */

  var currentUser   = null;
  var activeContact = null;
  var DEMO_CONTACTS = [];

  /* ── Helpers ─────────────────────────────────────────────────────────── */

  function el(id) { return document.getElementById(id); }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatTime(ts) {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function formatDate(ts) {
    var d         = new Date(ts);
    var today     = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString())     return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  }

  /* ── Message storage (localStorage) ─────────────────────────────────── */

  function dmKey(a, b) {
    return "pwc_dm_" + [a, b].sort().join("_");
  }

  function loadMessages(contactUsername) {
    try {
      return JSON.parse(localStorage.getItem(dmKey(currentUser.username, contactUsername))) || [];
    } catch (_) { return []; }
  }

  function saveMessages(contactUsername, msgs) {
    localStorage.setItem(dmKey(currentUser.username, contactUsername), JSON.stringify(msgs));
  }

  /* ── Demo message seeding ────────────────────────────────────────────── */

  function seedDemo() {
    var seeds = {
      "admin": [
        { from: "admin", text: "Welcome to Poway Woman's Club! Let us know if you have any questions.", ts: Date.now() - 86400000 * 2 },
        { from: "admin", text: "Our next meeting is on the 2nd Tuesday. Hope to see you there!",        ts: Date.now() - 86400000 },
      ],
      "jsmith": [
        { from: "jsmith", text: "Hi! Great to meet you at last month's meeting.", ts: Date.now() - 3600000 * 5 },
      ],
    };
    Object.keys(seeds).forEach(function (contact) {
      var key = dmKey(currentUser.username, contact);
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(seeds[contact]));
      }
    });
  }

  /* ── Unread badge ────────────────────────────────────────────────────── */

  function countUnread(contactUsername) {
    var msgs     = loadMessages(contactUsername);
    var lastRead = parseInt(
      localStorage.getItem("pwc_lastread_" + dmKey(currentUser.username, contactUsername)) || "0",
      10
    );
    return msgs.filter(function (m) { return m.from !== currentUser.username && m.ts > lastRead; }).length;
  }

  function markRead(contactUsername) {
    localStorage.setItem(
      "pwc_lastread_" + dmKey(currentUser.username, contactUsername),
      String(Date.now())
    );
    updateUnreadBadge();
  }

  function totalUnread() {
    return DEMO_CONTACTS.reduce(function (sum, c) { return sum + countUnread(c.username); }, 0);
  }

  function updateUnreadBadge() {
    var n     = totalUnread();
    var badge = el("unreadBadge");
    if (n > 0) { badge.style.display = ""; badge.textContent = n > 99 ? "99+" : String(n); }
    else        { badge.style.display = "none"; }
  }

  /* ── Conversation list ───────────────────────────────────────────────── */

  function renderDmList(filter) {
    filter = (filter || "").toLowerCase();
    var list = el("dmList");
    list.innerHTML = "";

    DEMO_CONTACTS.forEach(function (contact) {
      if (filter && !(contact.firstName + " " + contact.lastName).toLowerCase().includes(filter)) return;

      var msgs     = loadMessages(contact.username);
      var last     = msgs[msgs.length - 1];
      var unread   = countUnread(contact.username);
      var initials = (contact.firstName.charAt(0) + contact.lastName.charAt(0)).toUpperCase();

      var li = document.createElement("li");
      li.className = "pwc-dm-item"
        + (unread                              ? " has-unread" : "")
        + (activeContact === contact.username  ? " active"     : "");

      li.innerHTML =
        '<div class="pwc-dm-item-avatar">' + initials + "</div>" +
        '<div class="pwc-dm-item-body">' +
          '<div class="pwc-dm-item-name">' + contact.firstName + " " + contact.lastName + "</div>" +
          '<div class="pwc-dm-item-preview">' +
            (last
              ? (last.from === currentUser.username ? "You: " : "") + escapeHtml(last.text)
              : "No messages yet") +
          "</div>" +
        "</div>" +
        '<div class="pwc-dm-item-meta">' +
          '<div class="pwc-dm-item-time">'   + (last ? formatTime(last.ts) : "") + "</div>" +
          '<div class="pwc-dm-item-unread">' + (unread || "")                    + "</div>" +
        "</div>";

      li.addEventListener("click", function () { openConvo(contact); });
      list.appendChild(li);
    });
  }

  /* ── Active conversation ─────────────────────────────────────────────── */

  function openConvo(contact) {
    activeContact = contact.username;
    markRead(contact.username);

    var initials = (contact.firstName.charAt(0) + contact.lastName.charAt(0)).toUpperCase();
    el("convoAvatar").textContent = initials;
    el("convoName").textContent   = contact.firstName + " " + contact.lastName;
    el("convoStatus").textContent = contact.role;

    el("dmEmpty").style.display = "none";
    el("dmConvo").style.display = "flex";

    renderMessages(contact.username);
    renderDmList(el("dmSearch").value);
    el("dmInput").focus();
  }

  function renderMessages(contactUsername) {
    var msgs      = loadMessages(contactUsername);
    var container = el("dmMessages");
    container.innerHTML = "";

    var lastDate = null;

    msgs.forEach(function (msg) {
      var dateLabel = formatDate(msg.ts);
      if (dateLabel !== lastDate) {
        lastDate = dateLabel;
        var divider = document.createElement("div");
        divider.className = "pwc-dm-date-divider";
        divider.innerHTML = "<span>" + dateLabel + "</span>";
        container.appendChild(divider);
      }

      var isMine = msg.from === currentUser.username;
      var wrap   = document.createElement("div");
      wrap.className = "pwc-dm-bubble-wrap " + (isMine ? "mine" : "theirs");
      wrap.innerHTML =
        '<div class="pwc-dm-bubble">'      + escapeHtml(msg.text) + "</div>" +
        '<div class="pwc-dm-bubble-time">' + formatTime(msg.ts)   + "</div>";
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

    var msgs = loadMessages(activeContact);
    msgs.push({ from: currentUser.username, text: text, ts: Date.now() });
    saveMessages(activeContact, msgs);
    markRead(activeContact);

    input.value        = "";
    input.style.height = "";
    renderMessages(activeContact);
    renderDmList(el("dmSearch").value);
  }

  /* ── Event binding ───────────────────────────────────────────────────── */

  function bindEvents() {
    el("dmSend").addEventListener("click", sendMessage);

    el("dmInput").addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    el("dmInput").addEventListener("input", function () {
      this.style.height = "";
      this.style.height = Math.min(this.scrollHeight, 120) + "px";
    });

    el("dmSearch").addEventListener("input", function () {
      renderDmList(this.value);
    });
  }

  /* ── Public init ─────────────────────────────────────────────────────── */

  function init(user) {
    currentUser = user;

    DEMO_CONTACTS = [
      { username: "admin",   firstName: "Club",    lastName: "Admin",  role: "Administrator" },
      { username: "jsmith",  firstName: "Joan",    lastName: "Smith",  role: "Member" },
      { username: "mlopez",  firstName: "Maria",   lastName: "Lopez",  role: "Member" },
      { username: "bchang",  firstName: "Barbara", lastName: "Chang",  role: "Member" },
      { username: "rwilson", firstName: "Ruth",    lastName: "Wilson", role: "Member" },
    ].filter(function (c) { return c.username !== user.username; });

    seedDemo();
    bindEvents();
    renderDmList();
    updateUnreadBadge();
  }

  return {
    init:              init,
    renderDmList:      renderDmList,
    updateUnreadBadge: updateUnreadBadge,
  };

})();
