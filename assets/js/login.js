/**
 * login.js — Poway Woman's Club
 *
 * On successful login, writes the user object to sessionStorage.
 * profile.js reads this on the profile page to gate access and
 * pre-populate all fields.
 *
 * SESSION CONTRACT (must match profile.js):
 *   sessionStorage.setItem('pwc_user', JSON.stringify({
 *     username, firstName, lastName, email,
 *     bio, languages[], interests[]
 *   }));
 *
 * ── DEMO MODE ──────────────────────────────────────────────────
 * Two hardcoded users are included so you can test end-to-end
 * without a backend. Replace attemptLogin() with a real fetch()
 * call when your auth API is ready.
 * ───────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── Config ─────────────────────────────────────────────────── */

  // Base URL — matches _config.yml baseurl
  var BASE = '/wc-FE';

  // Where to send the user after a successful login
  var REDIRECT_AFTER_LOGIN = BASE + '/navigation/profile';

  /* ── Demo users (replace with real API call) ─────────────────── */
  var DEMO_USERS = {
    'member': {
      username:  'member',
      password:  'password123',
      firstName: 'Jane',
      lastName:  'Doe',
      email:     'jane.doe@example.com',
      bio:       '',
      languages: ['English'],
      interests: []
    },
    'admin': {
      username:  'admin',
      password:  'admin123',
      firstName: 'Club',
      lastName:  'Admin',
      email:     'admin@powaywoman.org',
      bio:       'Club administrator.',
      languages: ['English', 'Spanish'],
      interests: ['Arts', 'Civic Engagement']
    }
  };

  /* ── Helpers ─────────────────────────────────────────────────── */

  function el(id) { return document.getElementById(id); }

  function showAlert(msg) {
    var a = el('loginAlert');
    a.textContent = msg;
    a.classList.add('visible');
  }

  function hideAlert() {
    var a = el('loginAlert');
    a.textContent = '';
    a.classList.remove('visible');
  }

  function setLoading(on) {
    var btn = el('loginBtn');
    btn.disabled = on;
    btn.textContent = on ? 'Signing in…' : 'Sign In';
  }

  /* ── Auth ────────────────────────────────────────────────────── */

  /**
   * attemptLogin(username, password)
   * Returns a Promise that resolves with the user object on success,
   * or rejects with an error message string on failure.
   *
   * SWAP THIS FUNCTION for a real fetch() when your backend is ready:
   *
   *   return fetch('/api/login', {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json' },
   *     body: JSON.stringify({ username, password })
   *   }).then(function(res) {
   *     if (!res.ok) throw new Error('Invalid username or password.');
   *     return res.json();
   *   });
   */
  function attemptLogin(username, password) {
    return new Promise(function (resolve, reject) {
      // Simulate a small network delay
      setTimeout(function () {
        var user = DEMO_USERS[username.toLowerCase()];
        if (!user || user.password !== password) {
          reject('Invalid username or password. Please try again.');
          return;
        }
        // Return a copy without the password field
        var safe = Object.assign({}, user);
        delete safe.password;
        resolve(safe);
      }, 400);
    });
  }

  function doLogin() {
    var username = el('username').value.trim();
    var password = el('password').value;

    hideAlert();

    if (!username || !password) {
      showAlert('Please enter your username and password.');
      return;
    }

    setLoading(true);

    attemptLogin(username, password)
      .then(function (user) {
        // Merge any previously saved profile data (languages, interests, bio, etc.)
        var saved = null;
        try { saved = JSON.parse(localStorage.getItem('pwc_profile_' + user.username)); }
        catch (_) {}
        if (saved) { user = Object.assign({}, user, saved); }

        // Write to sessionStorage — profile.js reads this
        sessionStorage.setItem('pwc_user', JSON.stringify(user));

        // Redirect to profile
        window.location.href = REDIRECT_AFTER_LOGIN;
      })
      .catch(function (msg) {
        setLoading(false);
        showAlert(msg);
        el('password').value = '';
        el('password').focus();
      });
  }

  /* ── Password show/hide ──────────────────────────────────────── */

  function bindPasswordToggle() {
    var toggle = el('pwToggle');
    var input  = el('password');
    if (!toggle || !input) return;

    toggle.addEventListener('click', function () {
      var isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      toggle.textContent = isHidden ? 'Hide' : 'Show';
      toggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password'); toggle.style.fontSize = '0.75rem'; toggle.style.fontWeight = '700';
    });
  }

  /* ── has-content class for input styling ─────────────────────── */

  function bindInputStyling() {
    ['username', 'password'].forEach(function (id) {
      var input = el(id);
      if (!input) return;
      input.addEventListener('input', function () {
        input.classList.toggle('has-content', input.value.length > 0);
      });
    });
  }

  /* ── Enter key support ───────────────────────────────────────── */

  function bindEnterKey() {
    ['username', 'password'].forEach(function (id) {
      var input = el(id);
      if (!input) return;
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { doLogin(); }
      });
    });
  }

  /* ── Init ────────────────────────────────────────────────────── */

  // If already logged in, skip straight to profile
  try {
    if (sessionStorage.getItem('pwc_user')) {
      window.location.href = REDIRECT_AFTER_LOGIN;
    }
  } catch (_) {}

  el('loginBtn').addEventListener('click', doLogin);
  bindPasswordToggle();
  bindInputStyling();
  bindEnterKey();

  // Focus username field on load
  var uField = el('username');
  if (uField) { uField.focus(); }

})();