/**
 * Google Identity Services — OAuth 2.0 authorization code (popup) + backend exchange.
 * Depends on window.PWC_API_BASE_URL (same as login / profile).
 */
(function (global) {
  'use strict';

  var API_BASE = (global.PWC_API_BASE_URL || 'http://localhost:8327').replace(/\/$/, '');

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('Failed to load ' + src)); };
      document.head.appendChild(s);
    });
  }

  function fetchGoogleConfig() {
    return fetch(API_BASE + '/api/auth/google-config', { credentials: 'omit' })
      .then(function (r) { return r.json(); });
  }

  function pageOrigin() {
    try {
      return (global.location && global.location.origin) ? global.location.origin : '';
    } catch (e) {
      return '';
    }
  }

  function exchangeCode(apiPath, code) {
    var origin = pageOrigin();
    if (!origin) {
      return Promise.reject(new Error('Cannot read page origin for Google OAuth.'));
    }
    return fetch(API_BASE + apiPath, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code, redirect_uri: origin })
    }).then(function (res) {
      return res.text().then(function (t) {
        var data = {};
        try { data = t ? JSON.parse(t) : {}; } catch (_) {}
        if (!res.ok) throw new Error((data && data.error) ? data.error : 'Google sign-in failed.');
        return data;
      });
    });
  }

  function ensureGsiLoaded() {
    if (global.google && global.google.accounts && global.google.accounts.oauth2) {
      return Promise.resolve();
    }
    return loadScript('https://accounts.google.com/gsi/client');
  }

  function initGoogleButton(wrapId, btnId, apiPath, onUser, onNotConfigured) {
    return fetchGoogleConfig()
      .then(function (cfg) {
        if (!cfg || !cfg.enabled || !cfg.clientId) {
          if (onNotConfigured) onNotConfigured();
          return;
        }
        return ensureGsiLoaded().then(function () {
          var origin = pageOrigin();
          var clientOpts = {
            client_id: cfg.clientId,
            scope: 'openid email profile',
            ux_mode: 'popup',
            callback: function (resp) {
              if (!resp || !resp.code) return;
              exchangeCode(apiPath, resp.code)
                .then(onUser)
                .catch(function (err) {
                  if (global.PWC_GOOGLE_ERROR) global.PWC_GOOGLE_ERROR(err);
                });
            },
            error_callback: function (err) {
              var msg = (err && err.type ? err.type + ': ' : '') + (err && err.message ? err.message : 'Google sign-in was cancelled or blocked.');
              if (global.PWC_GOOGLE_ERROR) global.PWC_GOOGLE_ERROR({ message: msg });
            }
          };
          if (origin) {
            clientOpts.redirect_uri = origin;
          }
          var client = global.google.accounts.oauth2.initCodeClient(clientOpts);
          var wrap = document.getElementById(wrapId);
          var btn = document.getElementById(btnId);
          if (wrap) wrap.hidden = false;
          if (btn) {
            btn.addEventListener('click', function () {
              try {
                client.requestCode();
              } catch (e) {
                if (global.PWC_GOOGLE_ERROR) global.PWC_GOOGLE_ERROR(e);
              }
            });
          }
        });
      })
      .catch(function (err) {
        var msg = 'Could not reach the API for Google sign-in settings. Check events_api_base_url in _config.yml matches your Flask URL (e.g. http://localhost:8327) and that the browser origin is allowed by Flask CORS.';
        if (global.PWC_GOOGLE_ERROR) global.PWC_GOOGLE_ERROR({ message: msg });
        try { console.warn('google-config fetch failed', err); } catch (e) { /* no-op */ }
      });
  }

  /** Login + register pages: wire primary Google buttons */
  function initLoginGoogle(onUser, onNotConfigured) {
    initGoogleButton('googleSignInWrap', 'googleSignInBtn', '/api/auth/google', onUser, onNotConfigured);
    initGoogleButton(
      'googleSignInWrapRegister',
      'googleSignInBtnRegister',
      '/api/auth/google',
      onUser,
      onNotConfigured
    );
  }

  /**
   * Link Google to current session; resolves with updated user JSON.
   */
  function linkGoogleAccount() {
    return fetchGoogleConfig().then(function (cfg) {
      if (!cfg || !cfg.enabled || !cfg.clientId) {
        throw new Error('Google sign-in is not configured on the server.');
      }
      return ensureGsiLoaded().then(function () {
        return new Promise(function (resolve, reject) {
          var origin = pageOrigin();
          var linkOpts = {
            client_id: cfg.clientId,
            scope: 'openid email profile',
            ux_mode: 'popup',
            callback: function (resp) {
              if (!resp || !resp.code) return;
              exchangeCode('/api/auth/google/link', resp.code).then(resolve).catch(reject);
            },
            error_callback: function (err) {
              reject(new Error((err && err.message) ? err.message : 'Google sign-in was cancelled or blocked.'));
            }
          };
          if (origin) linkOpts.redirect_uri = origin;
          var client = global.google.accounts.oauth2.initCodeClient(linkOpts);
          try {
            client.requestCode();
          } catch (e) {
            reject(e);
          }
        });
      });
    });
  }

  global.PWCGoogleOAuth = {
    fetchGoogleConfig: fetchGoogleConfig,
    initGoogleButton: initGoogleButton,
    initLoginGoogle: initLoginGoogle,
    linkGoogleAccount: linkGoogleAccount
  };
})(window);
