/* ==========================================================================
   GroupAPI — all HTTP communication with the groups backend.
   Single responsibility: fetch data from / send data to the server.
   ========================================================================== */

var GroupAPI = (function () {
  "use strict";

  var BASE     = (typeof API !== "undefined" ? API : "http://localhost:5001");
  var API_BASE = BASE + "/api/groups";

  function getGroups() {
    return fetch(API_BASE + "/", { credentials: "include" })
      .then(function (r) {
        if (!r.ok) throw new Error("Failed to load groups");
        return r.json();
      });
  }

  function getGroup(id) {
    return fetch(API_BASE + "/" + id, { credentials: "include" })
      .then(function (r) {
        if (!r.ok) throw new Error("Group not found");
        return r.json();
      });
  }

  function getMyGroups() {
    return fetch(API_BASE + "/my", { credentials: "include" })
      .then(function (r) {
        if (!r.ok) return [];
        return r.json();
      });
  }

  function createGroup(name, description, requiresApplication) {
    return fetch(API_BASE + "/", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        description: description || "",
        requires_application: !!requiresApplication,
      }),
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (d) { throw new Error(d.error || "Failed"); });
      return r.json();
    });
  }

  function updateGroup(id, name, description, requiresApplication) {
    return fetch(API_BASE + "/" + id, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        description: description,
        requires_application: !!requiresApplication,
      }),
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (d) { throw new Error(d.error || "Failed"); });
      return r.json();
    });
  }

  function deleteGroup(id) {
    return fetch(API_BASE + "/" + id, {
      method: "DELETE",
      credentials: "include",
    }).then(function (r) {
      if (!r.ok) throw new Error("Failed to delete");
    });
  }

  function joinGroup(id) {
    return fetch(API_BASE + "/" + id + "/join", {
      method: "POST",
      credentials: "include",
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (d) { throw new Error(d.error || "Failed"); });
      return r.json();
    });
  }

  function leaveGroup(id) {
    return fetch(API_BASE + "/" + id + "/leave", {
      method: "DELETE",
      credentials: "include",
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (d) { throw new Error(d.error || "Failed"); });
      return r.json();
    });
  }

  function submitApplication(groupId, message) {
    return fetch(API_BASE + "/" + groupId + "/applications", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message || "" }),
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (d) { throw new Error(d.error || "Failed"); });
      return r.json();
    });
  }

  function getPendingApplications(groupId) {
    return fetch(API_BASE + "/" + groupId + "/applications?status=pending", {
      credentials: "include",
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (d) { throw new Error(d.error || "Failed"); });
      return r.json();
    });
  }

  function approveApplication(groupId, applicationId) {
    return fetch(
      API_BASE + "/" + groupId + "/applications/" + applicationId + "/approve",
      { method: "POST", credentials: "include" }
    ).then(function (r) {
      if (!r.ok) return r.json().then(function (d) { throw new Error(d.error || "Failed"); });
      return r.json();
    });
  }

  function denyApplication(groupId, applicationId) {
    return fetch(
      API_BASE + "/" + groupId + "/applications/" + applicationId + "/deny",
      { method: "POST", credentials: "include" }
    ).then(function (r) {
      if (!r.ok) return r.json().then(function (d) { throw new Error(d.error || "Failed"); });
      return r.json();
    });
  }

  return {
    getGroups:             getGroups,
    getGroup:              getGroup,
    getMyGroups:           getMyGroups,
    createGroup:           createGroup,
    updateGroup:           updateGroup,
    deleteGroup:           deleteGroup,
    joinGroup:             joinGroup,
    leaveGroup:            leaveGroup,
    submitApplication:     submitApplication,
    getPendingApplications: getPendingApplications,
    approveApplication:    approveApplication,
    denyApplication:       denyApplication,
  };

})();
