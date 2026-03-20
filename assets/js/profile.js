/**
 * profile.js — Poway Woman's Club
 * Handles: session validation via backend, profile tabs, topbar view switching, DM messages
 *
 * On load, validates the session by calling GET /api/auth/me.
 * Profile edits and password changes are synced to the backend.
 */

(function () {
  'use strict';

  /* ── Config ────────────────────────────────────────────────── */

  var API_BASE_URL = (window.PWC_API_BASE_URL || 'http://localhost:5001').replace(/\/$/, '');
  var LOGIN_URL = (window.PWC_BASE || '/wc-FE') + '/navigation/login';

  /* ── Helpers ──────────────────────────────────────────────── */

  function getSession() {
    try { return JSON.parse(sessionStorage.getItem('pwc_user')); }
    catch (_) { return null; }
  }

  function saveSession(user) {
    sessionStorage.setItem('pwc_user', JSON.stringify(user));
  }

  function el(id) { return document.getElementById(id); }

  function showMsg(msgEl, text, isError) {
    msgEl.textContent = text;
    msgEl.className = 'pwc-save-msg visible' + (isError ? ' error' : '');
    setTimeout(function () { msgEl.className = 'pwc-save-msg'; }, 3000);
  }

  function getInitials(u) {
    return ((u.firstName || '').charAt(0) + (u.lastName || '').charAt(0)).toUpperCase() || '?';
  }

  function formatTime(ts) {
    var d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function formatDate(ts) {
    var d = new Date(ts);
    var today = new Date();
    var yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  /* ── Auth check — validate session against backend ─────────── */

  var cachedUser = getSession();

  // Always validate with the backend to ensure the session cookie is still valid
  fetch(API_BASE_URL + '/api/auth/me', { credentials: 'include' })
    .then(function (res) {
      if (!res.ok) throw new Error('Not authenticated');
      return res.json();
    })
    .then(function (backendUser) {
      // Backend is the source of truth — update sessionStorage
      var user = {
        id:        backendUser.id,
        username:  backendUser.username,
        email:     backendUser.email,
        role:      backendUser.role,
        firstName: backendUser.firstName || '',
        lastName:  backendUser.lastName  || '',
        bio:       backendUser.bio       || '',
        languages: backendUser.languages || [],
        interests: backendUser.interests || []
      };
      saveSession(user);
      initApp(user);
    })
    .catch(function () {
      // Session invalid — clear and show auth gate
      sessionStorage.removeItem('pwc_user');
      el('pwc-auth-gate').style.display = '';
      el('pwc-profile-app').style.display = 'none';
    });

  // Show loading state or auth gate while we validate
  if (cachedUser) {
    // Show app immediately with cached data (will be refreshed by backend response)
    el('pwc-auth-gate').style.display = 'none';
    el('pwc-profile-app').style.display = 'block';
  } else {
    el('pwc-auth-gate').style.display = '';
    el('pwc-profile-app').style.display = 'none';
  }

  /* ── Main app initialization (called after session is validated) */

  function initApp(user) {
    el('pwc-auth-gate').style.display = 'none';
    el('pwc-profile-app').style.display = 'block';

    /* ── Demo contacts & message store ───────────────────────── */

    var DEMO_CONTACTS = [
      { username: 'admin',   firstName: 'Club',    lastName: 'Admin',   role: 'Administrator' },
      { username: 'jsmith',  firstName: 'Joan',    lastName: 'Smith',   role: 'Member' },
      { username: 'mlopez',  firstName: 'Maria',   lastName: 'Lopez',   role: 'Member' },
      { username: 'bchang',  firstName: 'Barbara', lastName: 'Chang',   role: 'Member' },
      { username: 'rwilson', firstName: 'Ruth',    lastName: 'Wilson',  role: 'Member' },
    ].filter(function (c) { return c.username !== user.username; });

    function dmKey(a, b) {
      return 'pwc_dm_' + [a, b].sort().join('_');
    }

    function loadMessages(contactUsername) {
      try { return JSON.parse(localStorage.getItem(dmKey(user.username, contactUsername))) || []; }
      catch (_) { return []; }
    }

    function saveMessages(contactUsername, msgs) {
      localStorage.setItem(dmKey(user.username, contactUsername), JSON.stringify(msgs));
    }

    /* ── Seed demo messages for first-time visitors ───────────── */
    (function seedDemo() {
      var seeds = {
        'admin': [
          { from: 'admin', text: 'Welcome to Poway Woman\'s Club! Let us know if you have any questions.', ts: Date.now() - 86400000 * 2 },
          { from: 'admin', text: 'Our next meeting is on the 2nd Tuesday. Hope to see you there!', ts: Date.now() - 86400000 }
        ],
        'jsmith': [
          { from: 'jsmith', text: 'Hi! Great to meet you at last month\'s meeting.', ts: Date.now() - 3600000 * 5 }
        ]
      };
      Object.keys(seeds).forEach(function (contact) {
        var key = dmKey(user.username, contact);
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, JSON.stringify(seeds[contact]));
        }
      });
    })();

    /* ══════════════════════════════════════════════════════════
       TOPBAR — view switching (Profile ↔ Messages)
    ══════════════════════════════════════════════════════════ */

    function switchView(viewName) {
      document.querySelectorAll('.pwc-topbar-tab').forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
      });
      document.querySelectorAll('.pwc-view').forEach(function (v) {
        v.classList.toggle('active', v.id === 'view-' + viewName);
      });
      // Prevent page-level scrolling when messages view is active
      document.body.style.overflow = (viewName === 'messages') ? 'hidden' : '';
      // Scroll to top so the topbar is visible
      window.scrollTo(0, 0);
    }

    document.querySelectorAll('.pwc-topbar-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchView(btn.getAttribute('data-view'));
      });
    });

    /* ══════════════════════════════════════════════════════════
       TOPBAR USER DISPLAY
    ══════════════════════════════════════════════════════════ */

    function renderTopbar() {
      el('topbarName').textContent = (user.firstName + ' ' + user.lastName).trim() || user.username;
      el('topbarAvatar').textContent = getInitials(user);
    }

    /* ══════════════════════════════════════════════════════════
       PROFILE — sidebar, overview, edit, security
    ══════════════════════════════════════════════════════════ */

    function renderOverview() {
      el('avatarInitials').textContent = getInitials(user);
      el('topbarAvatar').textContent   = getInitials(user);
      el('sidebarName').textContent    = (user.firstName + ' ' + user.lastName).trim() || user.username;
      el('topbarName').textContent     = (user.firstName + ' ' + user.lastName).trim() || user.username;
      el('sidebarEmail').textContent   = user.email || '';
      el('ov-name').textContent        = ((user.firstName || '') + ' ' + (user.lastName || '')).trim() || '—';
      el('ov-email').textContent       = user.email || '—';
      el('ov-bio').textContent         = user.bio   || '—';
      renderTagList('ov-languages', user.languages || [], false);
      renderTagList('ov-interests', user.interests  || [], true);
    }

    function renderTagList(containerId, items, useRose) {
      var container = el(containerId);
      container.innerHTML = '';
      if (!items.length) {
        container.innerHTML = '<span style="font-size:0.82rem;color:var(--pwc-muted)">None added yet</span>';
        return;
      }
      items.forEach(function (item) {
        var span = document.createElement('span');
        span.className = 'pwc-tag' + (useRose ? ' pwc-tag--rose' : '');
        span.textContent = item;
        container.appendChild(span);
      });
    }

    // Tag chip state
    var langTags     = (user.languages || []).slice();
    var interestTags = (user.interests  || []).slice();

    function fillEditForm() {
      el('firstName').value = user.firstName || '';
      el('lastName').value  = user.lastName  || '';
      el('email').value     = user.email     || '';
      el('bio').value       = user.bio       || '';
      langTags     = (user.languages || []).slice();
      interestTags = (user.interests  || []).slice();
      renderChips('langChips',    langTags,     false);
      renderChips('interestChips', interestTags, true);
    }

    function renderChips(containerId, tags, useRose) {
      var container = el(containerId);
      container.innerHTML = '';
      tags.forEach(function (tag, i) {
        var chip  = document.createElement('span');
        chip.className = 'pwc-chip' + (useRose ? ' pwc-chip--rose' : '');
        var label = document.createElement('span');
        label.textContent = tag;
        var btn   = document.createElement('button');
        btn.className   = 'pwc-chip-remove';
        btn.textContent = '\u00d7';
        btn.setAttribute('type', 'button');
        btn.addEventListener('click', (function (idx, arr, cId, rose) {
          return function () { arr.splice(idx, 1); renderChips(cId, arr, rose); };
        })(i, tags, containerId, useRose));
        chip.appendChild(label);
        chip.appendChild(btn);
        container.appendChild(chip);
      });
    }

    function bindTagInput(inputId, tags, chipsId, useRose) {
      var input = el(inputId);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          var val = input.value.trim().replace(/,$/, '');
          if (val && !tags.includes(val)) { tags.push(val); renderChips(chipsId, tags, useRose); }
          input.value = '';
        }
        if (e.key === 'Backspace' && input.value === '' && tags.length) {
          tags.pop(); renderChips(chipsId, tags, useRose);
        }
      });
    }

    bindTagInput('langInput',     langTags,     'langChips',     false);
    bindTagInput('interestInput', interestTags, 'interestChips', true);

    /* ── Save profile → backend ──────────────────────────────── */

    el('saveBtn').addEventListener('click', function () {
      var fn = el('firstName').value.trim();
      var ln = el('lastName').value.trim();
      var em = el('email').value.trim();
      if (!fn || !ln) { showMsg(el('saveMsg'), 'First and last name are required.', true); return; }
      if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { showMsg(el('saveMsg'), 'Please enter a valid email.', true); return; }

      var saveBtn = el('saveBtn');
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving…';

      fetch(API_BASE_URL + '/api/profile/me', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: fn,
          lastName:  ln,
          email:     em,
          bio:       el('bio').value.trim(),
          languages: langTags.slice(),
          interests: interestTags.slice()
        })
      })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error((data && data.error) || 'Failed to save profile.');
          return data;
        });
      })
      .then(function (updated) {
        // Update local state from backend response
        user.firstName = updated.firstName || '';
        user.lastName  = updated.lastName  || '';
        user.email     = updated.email     || '';
        user.bio       = updated.bio       || '';
        user.languages = updated.languages || [];
        user.interests = updated.interests || [];
        saveSession(user);
        renderOverview();
        showMsg(el('saveMsg'), 'Profile saved.', false);
      })
      .catch(function (err) {
        showMsg(el('saveMsg'), err.message || 'Failed to save.', true);
      })
      .finally(function () {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Changes';
      });
    });

    /* ── Change password → backend ───────────────────────────── */

    el('changePwBtn').addEventListener('click', function () {
      var cur = el('currentPw').value;
      var nw  = el('newPw').value;
      var cf  = el('confirmPw').value;

      if (!cur || !nw || !cf) { showMsg(el('pwMsg'), 'All fields are required.', true); return; }
      if (nw.length < 8)       { showMsg(el('pwMsg'), 'Password must be at least 8 characters.', true); return; }
      if (nw !== cf)            { showMsg(el('pwMsg'), 'Passwords do not match.', true); return; }

      var pwBtn = el('changePwBtn');
      pwBtn.disabled = true;
      pwBtn.textContent = 'Updating…';

      fetch(API_BASE_URL + '/api/profile/password', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: cur,
          newPassword:     nw,
          confirmPassword: cf
        })
      })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error((data && data.error) || 'Failed to update password.');
          return data;
        });
      })
      .then(function () {
        el('currentPw').value = '';
        el('newPw').value = '';
        el('confirmPw').value = '';
        showMsg(el('pwMsg'), 'Password updated.', false);
      })
      .catch(function (err) {
        showMsg(el('pwMsg'), err.message || 'Failed to update password.', true);
      })
      .finally(function () {
        pwBtn.disabled = false;
        pwBtn.textContent = 'Update Password';
      });
    });

    /* ── Logout ──────────────────────────────────────────────── */

    el('logoutBtn').addEventListener('click', function () {
      fetch(API_BASE_URL + '/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      }).catch(function () {}).finally(function () {
        sessionStorage.removeItem('pwc_user');
        window.location.href = LOGIN_URL;
      });
    });

    /* ── Profile sidebar tab switching ───────────────────────── */

    document.querySelectorAll('.pwc-sidenav-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-tab');
        document.querySelectorAll('.pwc-sidenav-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        document.querySelectorAll('.pwc-tab').forEach(function (t) { t.classList.remove('active'); });
        el('tab-' + target).classList.add('active');
        if (target === 'edit') { fillEditForm(); }
      });
    });

    /* ══════════════════════════════════════════════════════════
       MESSAGES — DM system
    ══════════════════════════════════════════════════════════ */

    var activeContact = null;

    function countUnread(contactUsername) {
      var msgs = loadMessages(contactUsername);
      var lastRead = parseInt(localStorage.getItem('pwc_lastread_' + dmKey(user.username, contactUsername)) || '0', 10);
      return msgs.filter(function (m) { return m.from !== user.username && m.ts > lastRead; }).length;
    }

    function markRead(contactUsername) {
      localStorage.setItem('pwc_lastread_' + dmKey(user.username, contactUsername), String(Date.now()));
      updateUnreadBadge();
    }

    function totalUnread() {
      return DEMO_CONTACTS.reduce(function (sum, c) { return sum + countUnread(c.username); }, 0);
    }

    function updateUnreadBadge() {
      var n = totalUnread();
      var badge = el('unreadBadge');
      if (n > 0) { badge.style.display = ''; badge.textContent = n > 99 ? '99+' : String(n); }
      else        { badge.style.display = 'none'; }
    }

    function renderDmList(filter) {
      filter = (filter || '').toLowerCase();
      var list = el('dmList');
      list.innerHTML = '';

      DEMO_CONTACTS.forEach(function (contact) {
        if (filter && !(contact.firstName + ' ' + contact.lastName).toLowerCase().includes(filter)) return;

        var msgs    = loadMessages(contact.username);
        var last    = msgs[msgs.length - 1];
        var unread  = countUnread(contact.username);
        var initials = (contact.firstName.charAt(0) + contact.lastName.charAt(0)).toUpperCase();

        var li = document.createElement('li');
        li.className = 'pwc-dm-item' + (unread ? ' has-unread' : '') + (activeContact === contact.username ? ' active' : '');
        li.innerHTML =
          '<div class="pwc-dm-item-avatar">' + initials + '</div>' +
          '<div class="pwc-dm-item-body">' +
            '<div class="pwc-dm-item-name">' + contact.firstName + ' ' + contact.lastName + '</div>' +
            '<div class="pwc-dm-item-preview">' + (last ? (last.from === user.username ? 'You: ' : '') + escapeHtml(last.text) : 'No messages yet') + '</div>' +
          '</div>' +
          '<div class="pwc-dm-item-meta">' +
            '<div class="pwc-dm-item-time">' + (last ? formatTime(last.ts) : '') + '</div>' +
            '<div class="pwc-dm-item-unread">' + (unread || '') + '</div>' +
          '</div>';

        li.addEventListener('click', function () { openConvo(contact); });
        list.appendChild(li);
      });
    }

    function openConvo(contact) {
      activeContact = contact.username;
      markRead(contact.username);

      var initials = (contact.firstName.charAt(0) + contact.lastName.charAt(0)).toUpperCase();
      el('convoAvatar').textContent = initials;
      el('convoName').textContent   = contact.firstName + ' ' + contact.lastName;
      el('convoStatus').textContent = contact.role;

      el('dmEmpty').style.display  = 'none';
      el('dmConvo').style.display  = 'flex';

      renderMessages(contact.username);
      renderDmList(el('dmSearch').value);
      el('dmInput').focus();
    }

    function renderMessages(contactUsername) {
      var msgs      = loadMessages(contactUsername);
      var container = el('dmMessages');
      container.innerHTML = '';

      var lastDate = null;

      msgs.forEach(function (msg) {
        var dateLabel = formatDate(msg.ts);
        if (dateLabel !== lastDate) {
          lastDate = dateLabel;
          var divider = document.createElement('div');
          divider.className = 'pwc-dm-date-divider';
          divider.innerHTML = '<span>' + dateLabel + '</span>';
          container.appendChild(divider);
        }

        var isMine = msg.from === user.username;
        var wrap   = document.createElement('div');
        wrap.className = 'pwc-dm-bubble-wrap ' + (isMine ? 'mine' : 'theirs');
        wrap.innerHTML =
          '<div class="pwc-dm-bubble">' + escapeHtml(msg.text) + '</div>' +
          '<div class="pwc-dm-bubble-time">' + formatTime(msg.ts) + '</div>';
        container.appendChild(wrap);
      });

      container.scrollTop = container.scrollHeight;
    }

    function sendMessage() {
      if (!activeContact) return;
      var input = el('dmInput');
      var text  = input.value.trim();
      if (!text) return;

      var msgs = loadMessages(activeContact);
      msgs.push({ from: user.username, text: text, ts: Date.now() });
      saveMessages(activeContact, msgs);
      markRead(activeContact);

      input.value = '';
      input.style.height = '';
      renderMessages(activeContact);
      renderDmList(el('dmSearch').value);
    }

    function escapeHtml(str) {
      return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    // Send button
    el('dmSend').addEventListener('click', sendMessage);

    // Enter to send (Shift+Enter for newline)
    el('dmInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    // Auto-grow textarea
    el('dmInput').addEventListener('input', function () {
      this.style.height = '';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    // Search filter
    el('dmSearch').addEventListener('input', function () {
      renderDmList(this.value);
    });

    /* ── Init ─────────────────────────────────────────────────── */
    // Hide footer in full-app mode — it adds scroll height
    var footer = document.querySelector('.site-footer');
    if (footer) footer.style.display = 'none';

    renderOverview();
    fillEditForm();
    renderTopbar();
    renderDmList();
    updateUnreadBadge();
  }

})();
