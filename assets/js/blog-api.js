/* ==========================================================================
   BlogAPI — all HTTP communication with the blog backend.
   Single responsibility: fetch data from / send data to the server.
   ========================================================================== */

var BlogAPI = (function () {
  "use strict";

  function resolveApiBase() {
    if (typeof window !== "undefined" && window.PWC_API_BASE_URL) {
      return String(window.PWC_API_BASE_URL).replace(/\/$/, "");
    }
    if (typeof API !== "undefined" && API) {
      return String(API).replace(/\/$/, "");
    }
    return "http://localhost:8327";
  }

  var BASE     = resolveApiBase();
  var API_BASE = BASE + "/api/blog";

  function getCurrentUser() {
    return fetch(BASE + "/api/auth/me", { credentials: "include" })
      .then(function (r) { return r.ok ? r.json() : null; });
  }

  function getPosts(params) {
    return fetch(API_BASE + "/posts?" + params.toString(), { credentials: "include" })
      .then(function (r) {
        if (!r.ok) throw new Error("Failed to load posts");
        return r.json();
      });
  }

  function getPost(id) {
    return fetch(API_BASE + "/posts/" + id, { credentials: "include" })
      .then(function (r) {
        if (!r.ok) throw new Error("Post not found");
        return r.json();
      });
  }

  function createPost(title, body, groupId) {
    var payload = { title: title, body: body };
    if (groupId) payload.group_id = groupId;
    return fetch(API_BASE + "/posts", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (d) { throw new Error(d.error || "Failed"); });
      return r.json();
    });
  }

  function updatePost(id, title, body, groupId) {
    var payload = { title: title, body: body, group_id: groupId || null };
    return fetch(API_BASE + "/posts/" + id, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (d) { throw new Error(d.error || "Failed"); });
      return r.json();
    });
  }

  function deletePost(id) {
    return fetch(API_BASE + "/posts/" + id, {
      method: "DELETE",
      credentials: "include",
    }).then(function (r) {
      if (!r.ok) throw new Error("Failed");
    });
  }

  function createComment(postId, body) {
    return fetch(API_BASE + "/posts/" + postId + "/comments", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: body }),
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (d) { throw new Error(d.error || "Failed"); });
      return r.json();
    });
  }

  function deleteComment(commentId) {
    return fetch(BASE + "/api/blog/comments/" + commentId, {
      method: "DELETE",
      credentials: "include",
    }).then(function (r) {
      if (!r.ok) throw new Error("Failed to delete");
    });
  }

  function pinPost(postId, days) {
    return fetch(API_BASE + "/posts/" + postId + "/pin", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ days: days || 0 }),
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (d) { throw new Error(d.error || "Failed"); });
    });
  }

  function unpinPost(postId) {
    return fetch(API_BASE + "/posts/" + postId + "/pin", {
      method: "DELETE",
      credentials: "include",
    }).then(function (r) {
      if (!r.ok) throw new Error("Failed");
    });
  }

  return {
    getCurrentUser: getCurrentUser,
    getPosts:       getPosts,
    getPost:        getPost,
    createPost:     createPost,
    updatePost:     updatePost,
    deletePost:     deletePost,
    createComment:  createComment,
    deleteComment:  deleteComment,
    pinPost:        pinPost,
    unpinPost:      unpinPost,
  };

})();
