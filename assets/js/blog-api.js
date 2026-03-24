/* ==========================================================================
   BlogAPI — all HTTP communication with the blog backend.
   Single responsibility: fetch data from / send data to the server.
   ========================================================================== */

var BlogAPI = (function () {
  "use strict";

  var BASE     = (typeof API !== "undefined" ? API : "http://localhost:5001");
  var API_BASE = BASE + "/api/blog";

  function getCurrentUser() {
    return fetch(BASE + "/api/auth/me", { credentials: "include" })
      .then(function (r) { return r.ok ? r.json() : null; });
  }

  function getPosts(params) {
    return fetch(API_BASE + "/posts?" + params.toString())
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

  function createPost(title, body) {
    return fetch(API_BASE + "/posts", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title, body: body }),
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (d) { throw new Error(d.error || "Failed"); });
      return r.json();
    });
  }

  function updatePost(id, title, body) {
    return fetch(API_BASE + "/posts/" + id, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title, body: body }),
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
