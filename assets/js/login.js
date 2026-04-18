/**
 * login.js — Poway Woman's Club
 *
 * Handles sign-in and registration forms, both backed by the Flask API.
 * On success, writes the user object to sessionStorage and redirects
 * to the profile page.
 *
 * SESSION CONTRACT (must match profile.js):
 *   sessionStorage.setItem('pwc_user', JSON.stringify({
 *     id, username, firstName, lastName, email, role,
 *     bio, languages[], interests[]
 *   }));
 */

(function () {
  'use strict';

  /* ── Config ─────────────────────────────────────────────────── */

  var BASE = '/pwc';
  var API_BASE_URL = (window.PWC_API_BASE_URL || 'http://localhost:8327').replace(/\/$/, '');
  var REDIRECT_AFTER_LOGIN = BASE + '/navigation/social';

  /* ── Helpers ─────────────────────────────────────────────────── */

  function el(id) { return document.getElementById(id); }

  function isNetworkFailure(err) {
    if (!err) return false;
    if (err.name === 'TypeError') return true;
    var m = String(err.message || err).toLowerCase();
    return m.indexOf('failed to fetch') !== -1 || m.indexOf('networkerror') !== -1
      || m.indexOf('load failed') !== -1 || m.indexOf('aborted') !== -1;
  }

  function networkHelpMessage() {
    return "We're having trouble connecting. Please try again in a moment.";
  }

  function showApiError(err) {
    showAlert(isNetworkFailure(err) ? networkHelpMessage() : (err.message || String(err)));
  }

  function showAlert(msg) {
    var a = el('loginAlert');
    a.textContent = msg;
    a.classList.add('visible');
    var s = el('successAlert');
    s.textContent = '';
    s.classList.remove('visible');
  }

  function showSuccess(msg) {
    var s = el('successAlert');
    s.textContent = msg;
    s.classList.add('visible');
    var a = el('loginAlert');
    a.textContent = '';
    a.classList.remove('visible');
  }

  function hideAlerts() {
    el('loginAlert').textContent = '';
    el('loginAlert').classList.remove('visible');
    el('successAlert').textContent = '';
    el('successAlert').classList.remove('visible');
  }

  function setLoading(btnId, on, label) {
    var btn = el(btnId);
    btn.disabled = on;
    btn.textContent = on ? label + '…' : label;
  }

  /* ── Form toggling (Sign In ↔ Register) ────────────────────── */

  function showLoginForm() {
    el('loginForm').style.display = '';
    el('registerForm').style.display = 'none';
    el('formTitle').textContent = 'Member Login';
    el('formSubtitle').textContent = "Poway Woman's Club — Members Area";
    hideAlerts();
  }

  function showRegisterForm() {
    el('loginForm').style.display = 'none';
    el('registerForm').style.display = '';
    el('formTitle').textContent = 'Create Account';
    el('formSubtitle').textContent = 'Join the Poway Woman\'s Club';
    hideAlerts();
  }

  el('showRegister').addEventListener('click', function (e) { e.preventDefault(); showRegisterForm(); });
  el('showLogin').addEventListener('click', function (e) { e.preventDefault(); showLoginForm(); });

  /* ── API helpers ────────────────────────────────────────────── */

  function apiCall(endpoint, body) {
    return fetch(API_BASE_URL + endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.text().then(function (t) {
        var data = {};
        try { data = t ? JSON.parse(t) : {}; } catch (_) {}
        if (!res.ok) {
          throw new Error((data && data.error) || 'Something went wrong.');
        }
        return data;
      });
    });
  }

  function storeAndRedirect(user) {
    // Store the user object from the backend directly — it's the source of truth
    var session = {
      id:        user.id,
      username:  user.username,
      email:     user.email,
      role:      user.role,
      firstName: user.firstName || '',
      lastName:  user.lastName  || '',
      bio:       user.bio       || '',
      languages: user.languages || [],
      interests: user.interests || [],
      hasGoogleLinked: !!user.hasGoogleLinked,
      avatar_url:      user.avatar_url || '',
      avatar_custom:   !!user.avatar_custom,
    };
    sessionStorage.setItem('pwc_user', JSON.stringify(session));
    window.location.href = REDIRECT_AFTER_LOGIN;
  }

  /* ── Login ──────────────────────────────────────────────────── */

  function doLogin() {
    var username = el('username').value.trim();
    var password = el('password').value;

    hideAlerts();

    if (!username || !password) {
      showAlert('Please enter your username and password.');
      return;
    }

    setLoading('loginBtn', true, 'Signing in');

    apiCall('/api/auth/login', { username: username, password: password })
      .then(function (user) {
        storeAndRedirect(user);
      })
      .catch(function (err) {
        setLoading('loginBtn', false, 'Sign In');
        showApiError(err);
        el('password').value = '';
        el('password').focus();
      });
  }

  /* ── Registration ───────────────────────────────────────────── */

  function doRegister() {
    var firstName = el('regFirstName').value.trim();
    var lastName  = el('regLastName').value.trim();
    var username  = el('regUsername').value.trim();
    var email     = el('regEmail').value.trim();
    var password  = el('regPassword').value;
    var confirm   = el('regConfirm').value;

    hideAlerts();

    if (!firstName || !lastName) {
      showAlert('Please enter your first and last name.');
      return;
    }
    if (!username) {
      showAlert('Please choose a username.');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showAlert('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      showAlert('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      showAlert('Passwords do not match.');
      return;
    }

    setLoading('registerBtn', true, 'Creating account');

    apiCall('/api/auth/register', {
      username: username,
      email: email,
      password: password
    })
    .then(function (user) {
      // After registration, update the profile with first/last name
      return fetch(API_BASE_URL + '/api/profile/me', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: firstName, lastName: lastName })
      }).then(function (res) {
        return res.json();
      }).then(function (updated) {
        storeAndRedirect(updated);
      });
    })
    .catch(function (err) {
      setLoading('registerBtn', false, 'Create Account');
      showApiError(err);
    });
  }

  /* ── Password show/hide ──────────────────────────────────────── */

  function bindPasswordToggle(toggleId, inputId) {
    var toggle = el(toggleId);
    var input  = el(inputId);
    if (!toggle || !input) return;
    toggle.addEventListener('click', function () {
      var isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      toggle.textContent = isHidden ? 'Hide' : 'Show';
      toggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
      toggle.style.fontSize = '0.75rem';
      toggle.style.fontWeight = '700';
    });
  }

  /* ── has-content class for input styling ─────────────────────── */

  function bindInputStyling() {
    var ids = ['username', 'password', 'regFirstName', 'regLastName', 'regUsername', 'regEmail', 'regPassword', 'regConfirm'];
    ids.forEach(function (id) {
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
    ['regFirstName', 'regLastName', 'regUsername', 'regEmail', 'regPassword', 'regConfirm'].forEach(function (id) {
      var input = el(id);
      if (!input) return;
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { doRegister(); }
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

  window.PWC_GOOGLE_ERROR = function (err) {
    var e = err && err.message ? err : new Error(err != null ? String(err) : '');
    showApiError(e);
  };

  if (window.PWCGoogleOAuth) {
    window.PWCGoogleOAuth.initLoginGoogle(storeAndRedirect, function () {
      showAlert('Google sign-in is not configured on the server. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the Flask .env and restart.');
    });
  }

  el('loginBtn').addEventListener('click', doLogin);
  el('registerBtn').addEventListener('click', doRegister);
  bindPasswordToggle('pwToggle', 'password');
  bindPasswordToggle('regPwToggle', 'regPassword');
  bindInputStyling();
  bindEnterKey();

  // Focus username field on load
  var uField = el('username');
  if (uField) { uField.focus(); }

  /* Proactive check on production Pages: wrong events_api_base_url shows a clear banner */
  (function checkApiReachable() {
    try {
      var h = location.hostname;
      if (h === 'localhost' || h === '127.0.0.1') return;
      fetch(API_BASE_URL + '/api/health', { method: 'GET', credentials: 'omit' })
        .then(function (r) {
          if (!r.ok) showAlert(networkHelpMessage());
        })
        .catch(function () {
          showAlert(networkHelpMessage());
        });
    } catch (_) { /* no-op */ }
  })();

})();
