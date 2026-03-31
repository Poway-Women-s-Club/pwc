/* ==========================================================================
   GroupRenderer — all groups DOM rendering.
   Single responsibility: turn data into HTML and update the page.
   Never makes HTTP requests; never manages application state.
   ========================================================================== */

var GroupRenderer = (function () {
  "use strict";

  /* ── Helpers ─────────────────────────────────────────────────────────── */

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function formatDate(iso) {
    var d = new Date(iso);
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  function joinOrApplyCardButton(g, isMember, currentUser) {
    if (!currentUser || isMember) return "";
    if (g.requires_application) {
      var my = g.my_application;
      if (my && my.status === "pending") {
        return '<button type="button" class="pwc-btn pwc-btn-muted pwc-btn-sm" disabled>Application pending</button>';
      }
      var label = my && my.status === "denied" ? "Apply again" : "Apply";
      return '<button type="button" class="pwc-btn pwc-btn-sage pwc-btn-sm" onclick="event.stopPropagation(); Groups.showApply(' + g.id + ')">' + label + "</button>";
    }
    return '<button type="button" class="pwc-btn pwc-btn-sage pwc-btn-sm" onclick="event.stopPropagation(); Groups.joinGroup(' + g.id + ')">Join</button>';
  }

  function joinOrApplyDetailBlock(group, isMember, currentUser) {
    if (!currentUser) return "";
    if (isMember) {
      return '<button type="button" class="pwc-btn pwc-btn-muted" onclick="Groups.leaveGroup(' + group.id + ')">Leave Group</button>';
    }
    if (group.requires_application) {
      var my = group.my_application;
      if (my && my.status === "pending") {
        return '<p class="pwc-groups-pending-note">Your application is pending review.</p>'
          + '<button type="button" class="pwc-btn pwc-btn-muted" disabled>Application pending</button>';
      }
      if (my && my.status === "denied") {
        return '<p class="pwc-groups-denied-note">Your last application was not approved. You may submit a new one.</p>'
          + '<button type="button" class="pwc-btn pwc-btn-sage" onclick="Groups.showApply(' + group.id + ')">Apply again</button>';
      }
      return '<button type="button" class="pwc-btn pwc-btn-sage" onclick="Groups.showApply(' + group.id + ')">Apply to join</button>';
    }
    return '<button type="button" class="pwc-btn pwc-btn-sage" onclick="Groups.joinGroup(' + group.id + ')">Join Group</button>';
  }

  /* ── Group list ─────────────────────────────────────────────────────── */

  function renderGroups(groups, myGroupIds, currentUser) {
    var container = document.getElementById("groups-list");
    if (!groups || groups.length === 0) {
      container.innerHTML = '<div class="pwc-groups-empty">No groups yet. Be the first to create one!</div>';
      return;
    }

    var html = "";
    groups.forEach(function (g) {
      var isMember = myGroupIds.indexOf(g.id) !== -1;
      var isOwner  = currentUser && currentUser.id === g.created_by;
      var isAdmin  = currentUser && currentUser.role === "admin";

      var memberBadge = isMember
        ? '<span class="pwc-groups-badge pwc-groups-badge--member">Member</span>'
        : "";
      var applyBadge = !isMember && g.requires_application
        ? '<span class="pwc-groups-badge pwc-groups-badge--apply">Application required</span>'
        : "";

      var actionBtn = "";
      if (currentUser) {
        if (isMember) {
          actionBtn = '<button type="button" class="pwc-btn pwc-btn-muted pwc-btn-sm" onclick="event.stopPropagation(); Groups.leaveGroup(' + g.id + ')">Leave</button>';
        } else {
          actionBtn = joinOrApplyCardButton(g, isMember, currentUser);
        }
      }

      var adminBtns = "";
      if (isOwner || isAdmin) {
        adminBtns += '<button class="pwc-blog-admin-btn" onclick="event.stopPropagation(); Groups.showEdit(' + g.id + ')" title="Edit">Edit</button>';
        adminBtns += '<button class="pwc-blog-admin-btn pwc-blog-admin-btn--danger" onclick="event.stopPropagation(); Groups.deleteGroup(' + g.id + ')" title="Delete">Delete</button>';
      }

      html += '<article class="pwc-groups-card' + (isMember ? ' pwc-groups-card--member' : '') + '" onclick="Groups.openGroup(' + g.id + ')">'
        + '<div class="pwc-groups-card-top">'
        +   memberBadge
        +   applyBadge
        +   '<div class="pwc-blog-card-admin">' + adminBtns + '</div>'
        + '</div>'
        + '<h2 class="pwc-groups-card-title">' + escapeHtml(g.name) + '</h2>'
        + '<p class="pwc-groups-card-desc">'   + escapeHtml(g.description || "No description.") + '</p>'
        + '<div class="pwc-groups-card-meta">'
        +   '<span class="pwc-groups-card-members">' + g.member_count + ' member' + (g.member_count !== 1 ? 's' : '') + '</span>'
        +   '<span class="pwc-blog-card-date">' + formatDate(g.created_at) + '</span>'
        +   actionBtn
        + '</div>'
        + '</article>';
    });

    container.innerHTML = html;
  }

  /* ── Group detail ───────────────────────────────────────────────────── */

  function renderGroupDetail(group, myGroupIds, currentUser, pendingApplications) {
    var content = document.getElementById("groups-detail-content");
    var isMember = myGroupIds.indexOf(group.id) !== -1;

    var policyLine = group.requires_application
      ? '<span class="pwc-groups-policy-tag">Application required to join</span>'
      : '<span class="pwc-groups-policy-tag pwc-groups-policy-tag--open">Open to join</span>';

    var html = '<article class="pwc-groups-detail">'
      + '<h1>' + escapeHtml(group.name) + '</h1>'
      + '<p class="pwc-groups-detail-desc">' + escapeHtml(group.description || "No description.") + '</p>'
      + '<div class="pwc-groups-detail-meta">'
      +   policyLine
      +   '<span>' + group.member_count + ' member' + (group.member_count !== 1 ? 's' : '') + '</span>'
      +   '<span>Created ' + formatDate(group.created_at) + '</span>'
      + '</div>'
      + '<div class="pwc-groups-detail-actions">' + joinOrApplyDetailBlock(group, isMember, currentUser) + '</div>';

    html += '</article>';

    html += '<section class="pwc-groups-members">'
      + '<h3>Members</h3>';

    if (group.members && group.members.length > 0) {
      group.members.forEach(function (m) {
        var name = ((m.firstName || "") + " " + (m.lastName || "")).trim() || m.username;
        html += '<div class="pwc-groups-member">'
          + '<div class="pwc-groups-member-avatar">' + escapeHtml((m.firstName || "?").charAt(0) + (m.lastName || "").charAt(0)) + '</div>'
          + '<div class="pwc-groups-member-info">'
          +   '<span class="pwc-groups-member-name">' + escapeHtml(name) + '</span>'
          +   '<span class="pwc-groups-member-username">@' + escapeHtml(m.username) + '</span>'
          + '</div>'
          + '</div>';
      });
    } else {
      html += '<p class="pwc-groups-no-members">No members yet.</p>';
    }

    html += '</section>';

    if (pendingApplications !== null && pendingApplications !== undefined) {
      html += '<section class="pwc-groups-applications-admin">'
        + '<h3>Pending applications</h3>';
      if (!pendingApplications.length) {
        html += '<p class="pwc-groups-no-members">No pending applications.</p>';
      } else {
        pendingApplications.forEach(function (a) {
          var u = a.user || {};
          var name = ((u.firstName || "") + " " + (u.lastName || "")).trim() || u.username || "User";
          html += '<div class="pwc-groups-application-row">'
            + '<div class="pwc-groups-application-user">'
            +   '<span class="pwc-groups-application-name">' + escapeHtml(name) + '</span>'
            +   '<span class="pwc-groups-application-username">@' + escapeHtml(u.username || "") + '</span>'
            + '</div>';
          if (a.message) {
            html += '<p class="pwc-groups-application-msg">' + escapeHtml(a.message) + '</p>';
          }
          html += '<div class="pwc-groups-application-actions">'
            + '<button type="button" class="pwc-btn pwc-btn-sage pwc-btn-sm" onclick="Groups.approveApplication(' + group.id + "," + a.id + ')">Accept</button>'
            + '<button type="button" class="pwc-btn pwc-btn-muted pwc-btn-sm" onclick="Groups.denyApplication(' + group.id + "," + a.id + ')">Deny</button>'
            + '</div>'
            + '</div>';
        });
      }
      html += '</section>';
    }

    content.innerHTML = html;
  }

  /* ── Loading / error states ────────────────────────────────────────── */

  function showLoading() {
    document.getElementById("groups-list").innerHTML = '<div class="pwc-blog-loading">Loading groups...</div>';
  }

  function showError(message) {
    document.getElementById("groups-list").innerHTML = '<div class="pwc-blog-empty">' + escapeHtml(message) + '</div>';
  }

  function showDetailLoading() {
    document.getElementById("groups-detail-content").innerHTML = '<div class="pwc-blog-loading">Loading...</div>';
  }

  function setCreateButton(visible) {
    var btn = document.getElementById("groups-new-btn");
    if (btn) btn.style.display = visible ? "" : "none";
  }

  return {
    renderGroups:       renderGroups,
    renderGroupDetail:  renderGroupDetail,
    showLoading:        showLoading,
    showError:          showError,
    showDetailLoading:  showDetailLoading,
    setCreateButton:    setCreateButton,
  };

})();
