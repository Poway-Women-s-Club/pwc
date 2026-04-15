/* ==========================================================================
   FriendsAPI — HTTP client for /api/friends and /api/messages endpoints.
   Single responsibility: all network I/O for the social graph and DM system.
   Never touches the DOM; never manages state.
   ========================================================================== */

var FriendsAPI = (function () {
  "use strict";

  function resolveBase() {
    if (typeof window !== "undefined" && window.PWC_API_BASE_URL) {
      return String(window.PWC_API_BASE_URL).replace(/\/$/, "");
    }
    if (typeof API !== "undefined" && API) {
      return String(API).replace(/\/$/, "");
    }
    return "http://localhost:8327";
  }

  var BASE = resolveBase();

  function request(method, path, body) {
    var opts = { method: method, credentials: "include" };
    if (body !== undefined) {
      opts.headers = { "Content-Type": "application/json" };
      opts.body = JSON.stringify(body);
    }
    return fetch(BASE + path, opts).then(function (r) {
      if (!r.ok) {
        return r.json().then(function (d) {
          throw new Error(d.error || "Request failed (" + r.status + ")");
        }).catch(function (e) {
          if (e instanceof SyntaxError) throw new Error("Request failed (" + r.status + ")");
          throw e;
        });
      }
      return r.json();
    });
  }

  function del(path) {
    return fetch(BASE + path, { method: "DELETE", credentials: "include" }).then(function (r) {
      if (!r.ok) {
        return r.json().then(function (d) { throw new Error(d.error || "Request failed"); });
      }
      return r.json();
    });
  }

  // ── Friends ──────────────────────────────────────────────────────────────

  function getUser(userId) {
    return request("GET", "/api/profile/" + userId);
  }

  function getStatus(userId) {
    return request("GET", "/api/friends/status/" + userId);
  }

  function sendRequest(userId) {
    return request("POST", "/api/friends/request/" + userId);
  }

  function accept(userId) {
    return request("POST", "/api/friends/accept/" + userId);
  }

  function decline(userId) {
    return request("POST", "/api/friends/decline/" + userId);
  }

  function unfriend(userId) {
    return del("/api/friends/" + userId);
  }

  function getFriends() {
    return request("GET", "/api/friends");
  }

  function getRequests() {
    return request("GET", "/api/friends/requests");
  }

  function searchUsers(query) {
    return request("GET", "/api/friends/search?q=" + encodeURIComponent(query));
  }

  // ── Messages ─────────────────────────────────────────────────────────────

  function getConversations() {
    return request("GET", "/api/messages/conversations");
  }

  function getThread(userId) {
    return request("GET", "/api/messages/conversations/" + userId);
  }

  function getThreadSince(userId, since) {
    return request("GET", "/api/messages/conversations/" + userId + "?since=" + encodeURIComponent(since));
  }

  function sendMessage(userId, body) {
    return request("POST", "/api/messages/conversations/" + userId, { body: body });
  }

  function markRead(userId) {
    return request("POST", "/api/messages/conversations/" + userId + "/read");
  }

  function getUnreadCount() {
    return request("GET", "/api/messages/unread");
  }

  return {
    // Users
    getUser:          getUser,
    // Friends
    getStatus:        getStatus,
    sendRequest:      sendRequest,
    accept:           accept,
    decline:          decline,
    unfriend:         unfriend,
    getFriends:       getFriends,
    getRequests:      getRequests,
    searchUsers:      searchUsers,
    // Messages
    getConversations: getConversations,
    getThread:        getThread,
    getThreadSince:   getThreadSince,
    sendMessage:      sendMessage,
    markRead:         markRead,
    getUnreadCount:   getUnreadCount,
  };
})();
