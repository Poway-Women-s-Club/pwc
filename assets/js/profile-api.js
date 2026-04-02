/* ==========================================================================
   ProfileAPI — all HTTP communication for profile and authentication.
   Single responsibility: fetch data from / send data to the server.
   ========================================================================== */

var ProfileAPI = (function () {
  "use strict";

  function apiBase() {
    return (window.PWC_API_BASE_URL || "http://localhost:8327").replace(/\/$/, "");
  }

  function validateSession() {
    return fetch(apiBase() + "/api/auth/me", { credentials: "include" })
      .then(function (res) {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      });
  }

  function saveProfile(data) {
    return fetch(apiBase() + "/api/profile/me", {
      method:      "PUT",
      credentials: "include",
      headers:     { "Content-Type": "application/json" },
      body:        JSON.stringify(data),
    }).then(function (res) {
      return res.json().then(function (body) {
        if (!res.ok) throw new Error((body && body.error) || "Failed to save profile.");
        return body;
      });
    });
  }

  function changePassword(currentPassword, newPassword, confirmPassword) {
    return fetch(apiBase() + "/api/profile/password", {
      method:      "PUT",
      credentials: "include",
      headers:     { "Content-Type": "application/json" },
      body:        JSON.stringify({
        currentPassword: currentPassword,
        newPassword:     newPassword,
        confirmPassword: confirmPassword,
      }),
    }).then(function (res) {
      return res.json().then(function (body) {
        if (!res.ok) throw new Error((body && body.error) || "Failed to update password.");
        return body;
      });
    });
  }

  function logout() {
    return fetch(apiBase() + "/api/auth/logout", {
      method:      "POST",
      credentials: "include",
    }).catch(function () {});
  }

  function linkGoogle() {
    if (!window.PWCGoogleOAuth || !window.PWCGoogleOAuth.linkGoogleAccount) {
      return Promise.reject(new Error("Google linking is not available on this page."));
    }
    return window.PWCGoogleOAuth.linkGoogleAccount();
  }

  function uploadAvatar(blob) {
    var fd = new FormData();
    fd.append("file", blob, "avatar.jpg");
    return fetch(apiBase() + "/api/profile/avatar", {
      method:      "POST",
      credentials: "include",
      body:        fd,
    }).then(function (res) {
      return res.json().then(function (body) {
        if (!res.ok) throw new Error((body && body.error) || "Failed to upload photo.");
        return body;
      });
    });
  }

  function deleteAvatar() {
    return fetch(apiBase() + "/api/profile/avatar", {
      method:      "DELETE",
      credentials: "include",
    }).then(function (res) {
      return res.json().then(function (body) {
        if (!res.ok) throw new Error((body && body.error) || "Failed to remove photo.");
        return body;
      });
    });
  }

  function getRecommendations(topGroups, topEvents) {
    var g = topGroups != null ? topGroups : 5;
    var e = topEvents != null ? topEvents : 5;
    var q = "?top_groups=" + encodeURIComponent(g) + "&top_events=" + encodeURIComponent(e);
    return fetch(apiBase() + "/api/profile/recommendations" + q, {
      credentials: "include",
    }).then(function (res) {
      return res.json().then(function (body) {
        if (!res.ok) throw new Error((body && body.error) || "Recommendations failed.");
        return body;
      });
    });
  }

  return {
    validateSession: validateSession,
    saveProfile:     saveProfile,
    changePassword:  changePassword,
    logout:          logout,
    linkGoogle:      linkGoogle,
    uploadAvatar:    uploadAvatar,
    deleteAvatar:    deleteAvatar,
    getRecommendations: getRecommendations,
  };

})();
