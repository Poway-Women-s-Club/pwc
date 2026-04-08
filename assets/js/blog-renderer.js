/* ==========================================================================
   BlogRenderer — all blog DOM rendering.
   Single responsibility: turn data into HTML and update the page.
   Never makes HTTP requests; never manages application state.
   ========================================================================== */

var BlogRenderer = (function () {
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

  function baseUrl() {
    var base = document.querySelector('link[rel="canonical"]');
    if (base) {
      var u = new URL(base.href);
      return u.pathname.replace(/\/navigation\/blog\/?$/, "");
    }
    return "/pwc";
  }

  /* ── Friend button helpers ───────────────────────────────────────────── */

  function friendButtonHtml(authorId, status) {
    var id = parseInt(authorId, 10);
    switch (status) {
      case "none":
        return '<button class="pwc-blog-friend-btn pwc-blog-friend-btn--add" onclick="event.stopPropagation(); Blog.addFriend(' + id + ')">+ Add Friend</button>';
      case "pending_sent":
        return '<span class="pwc-blog-friend-btn pwc-blog-friend-btn--muted">Request Sent</span>';
      case "pending_received":
        return '<button class="pwc-blog-friend-btn pwc-blog-friend-btn--accept" onclick="event.stopPropagation(); Blog.acceptFriend(' + id + ')">Accept</button>'
             + '<button class="pwc-blog-friend-btn pwc-blog-friend-btn--decline" onclick="event.stopPropagation(); Blog.declineFriend(' + id + ')">Decline</button>';
      case "accepted":
        return '<span class="pwc-blog-friend-btn pwc-blog-friend-btn--friends">Friends ✓</span>';
      default:
        return "";
    }
  }

  /* ── Post list ───────────────────────────────────────────────────────── */

  function renderPosts(posts, currentUser) {
    var container = document.getElementById("blog-posts");
    if (!posts || posts.length === 0) {
      container.innerHTML = '<div class="pwc-blog-empty">No posts found.</div>';
      return;
    }

    var html = "";
    posts.forEach(function (p) {
      var pinBadge = p.is_pinned
        ? '<span class="pwc-blog-pin-badge">📌 Pinned</span>'
        : "";
      var groupBadge = p.group_name
        ? '<span class="pwc-blog-group-badge">' + escapeHtml(p.group_name) + '</span>'
        : "";
      var preview = p.body.length > 200 ? p.body.substring(0, 200) + "..." : p.body;
      var date    = formatDate(p.created_at);

      var adminBtns = "";
      if (currentUser && currentUser.role === "admin") {
        if (p.is_pinned) {
          adminBtns += '<button class="pwc-blog-admin-btn" onclick="event.stopPropagation(); Blog.unpinPost(' + p.id + ')" title="Unpin">Unpin</button>';
        } else {
          adminBtns += '<button class="pwc-blog-admin-btn" onclick="event.stopPropagation(); Blog.showPinModal(' + p.id + ')" title="Pin">Pin</button>';
        }
        adminBtns += '<button class="pwc-blog-admin-btn pwc-blog-admin-btn--danger" onclick="event.stopPropagation(); Blog.deletePost(' + p.id + ')" title="Delete">Delete</button>';
      } else if (currentUser && currentUser.id === p.author_id) {
        adminBtns += '<button class="pwc-blog-admin-btn pwc-blog-admin-btn--danger" onclick="event.stopPropagation(); Blog.deletePost(' + p.id + ')" title="Delete">Delete</button>';
      }

      var editBtn = "";
      if (currentUser && (currentUser.id === p.author_id || currentUser.role === "admin")) {
        editBtn = '<button class="pwc-blog-admin-btn" onclick="event.stopPropagation(); Blog.showEdit(' + p.id + ')" title="Edit">Edit</button>';
      }

      /* Friend button placeholder — populated by Blog after status fetch */
      var friendArea = "";
      if (currentUser && p.author_id && p.author_id !== currentUser.id) {
        friendArea = '<div class="pwc-blog-card-friend" data-for-author="' + p.author_id + '"></div>';
      }

      html += '<article class="pwc-blog-card' + (p.is_pinned ? ' pwc-blog-card--pinned' : '') + '" onclick="Blog.openPost(' + p.id + ')">'
        + '<div class="pwc-blog-card-top">'
        +   pinBadge + groupBadge
        +   '<div class="pwc-blog-card-admin">' + editBtn + adminBtns + '</div>'
        + '</div>'
        + '<h2 class="pwc-blog-card-title">'   + escapeHtml(p.title)             + '</h2>'
        + '<p class="pwc-blog-card-preview">'   + escapeHtml(preview)             + '</p>'
        + '<div class="pwc-blog-card-meta">'
        +   '<button class="pwc-blog-card-author pwc-blog-author-btn" onclick="event.stopPropagation(); Blog.openAuthorProfile(' + p.author_id + ')" title="View profile">'
        +     escapeHtml(p.author || "Unknown")
        +   '</button>'
        +   '<span class="pwc-blog-card-date">'     + date                             + '</span>'
        +   '<span class="pwc-blog-card-comments">' + p.comment_count + ' comment' + (p.comment_count !== 1 ? 's' : '') + '</span>'
        + '</div>'
        + friendArea
        + '</article>';
    });

    container.innerHTML = html;
  }

  /* Update friend button on all cards for a given author and on detail overlay */
  function updateFriendButton(authorId, status) {
    var html = friendButtonHtml(authorId, status);
    /* Cards in list */
    var cards = document.querySelectorAll('.pwc-blog-card-friend[data-for-author="' + authorId + '"]');
    for (var i = 0; i < cards.length; i++) {
      cards[i].innerHTML = html;
    }
    /* Detail overlay */
    var detailWrap = document.getElementById("blog-detail-friend-" + authorId);
    if (detailWrap) detailWrap.innerHTML = html;
  }

  /* ── Pagination ──────────────────────────────────────────────────────── */

  function renderPagination(page, pages) {
    var container = document.getElementById("blog-pagination");
    if (pages <= 1) { container.style.display = "none"; return; }
    container.style.display = "";

    var html = "";
    if (page > 1) {
      html += '<button class="pwc-blog-page-btn" onclick="Blog.goPage(' + (page - 1) + ')">← Prev</button>';
    }
    for (var i = 1; i <= pages; i++) {
      html += '<button class="pwc-blog-page-btn' + (i === page ? ' active' : '') + '" onclick="Blog.goPage(' + i + ')">' + i + '</button>';
    }
    if (page < pages) {
      html += '<button class="pwc-blog-page-btn" onclick="Blog.goPage(' + (page + 1) + ')">Next →</button>';
    }
    container.innerHTML = html;
  }

  /* ── Single post detail ──────────────────────────────────────────────── */

  function renderPostDetail(post, currentUser) {
    var content  = document.getElementById("blog-detail-content");
    var date     = formatDate(post.created_at);
    var pinLabel   = post.is_pinned ? '<span class="pwc-blog-pin-badge">📌 Pinned</span>' : "";
    var groupLabel = post.group_name ? '<span class="pwc-blog-group-badge">' + escapeHtml(post.group_name) + '</span>' : "";
    var bodyHtml   = escapeHtml(post.body).replace(/\n/g, "<br>");

    /* Friend button in detail view (populated by Blog after status fetch) */
    var detailFriendArea = "";
    if (currentUser && post.author_id && post.author_id !== currentUser.id) {
      detailFriendArea = '<div class="pwc-blog-detail-friend" id="blog-detail-friend-' + post.author_id + '"></div>';
    }

    var html = '<article class="pwc-blog-detail">'
      + pinLabel + groupLabel
      + '<h1>'                        + escapeHtml(post.title)             + '</h1>'
      + '<div class="pwc-blog-detail-meta">'
      +   '<span>By <button class="pwc-blog-author-btn pwc-blog-author-btn--detail" onclick="Blog.openAuthorProfile(' + post.author_id + ')" title="View profile"><strong>' + escapeHtml(post.author || "Unknown") + '</strong></button></span>'
      +   '<span>'                    + date                                + '</span>'
      + '</div>'
      + detailFriendArea
      + '<div class="pwc-blog-detail-body">' + bodyHtml                    + '</div>'
      + '</article>';

    html += '<section class="pwc-blog-comments">'
      + '<h3>' + (post.comments ? post.comments.length : 0)
      + ' Comment' + ((post.comments && post.comments.length !== 1) ? 's' : '') + '</h3>';

    if (post.comments && post.comments.length > 0) {
      post.comments.forEach(function (c) {
        var canDelete = currentUser && (currentUser.id === c.author_id || currentUser.role === "admin");
        html += '<div class="pwc-blog-comment">'
          + '<div class="pwc-blog-comment-header">'
          +   '<strong>' + escapeHtml(c.author || "Unknown") + '</strong>'
          +   '<span>'   + formatDate(c.created_at)          + '</span>'
          +   (canDelete
                ? '<button class="pwc-blog-comment-del" onclick="Blog.deleteComment(' + c.id + ', ' + post.id + ')" title="Delete comment">&times;</button>'
                : '')
          + '</div>'
          + '<p>' + escapeHtml(c.body) + '</p>'
          + '</div>';
      });
    } else {
      html += '<p class="pwc-blog-no-comments">No comments yet. Be the first!</p>';
    }

    if (currentUser) {
      html += '<form class="pwc-blog-comment-form" onsubmit="Blog.submitComment(event, ' + post.id + ')">'
        + '<textarea id="blog-comment-body" placeholder="Write a comment..." required rows="3"></textarea>'
        + '<button type="submit" class="pwc-btn pwc-btn-sage">Post Comment</button>'
        + '</form>';
    } else {
      html += '<p class="pwc-blog-login-prompt"><a href="' + baseUrl() + '/navigation/login">Log in</a> to leave a comment.</p>';
    }

    html += '</section>';
    content.innerHTML = html;
  }

  /* ── Author filter dropdown ──────────────────────────────────────────── */

  function renderAuthorFilter(authors) {
    var sel = document.getElementById("blog-filter-author");
    if (!sel) return;
    var current  = sel.value;
    var existing = [];
    for (var i = 0; i < sel.options.length; i++) existing.push(sel.options[i].value);
    authors.forEach(function (a) {
      if (existing.indexOf(a) === -1) {
        var opt = document.createElement("option");
        opt.value       = a;
        opt.textContent = a;
        sel.appendChild(opt);
      }
    });
    sel.value = current;
  }

  /* ── Loading / error states ──────────────────────────────────────────── */

  function showLoading() {
    document.getElementById("blog-posts").innerHTML = '<div class="pwc-blog-loading">Loading...</div>';
  }

  function showError(message) {
    document.getElementById("blog-posts").innerHTML = '<div class="pwc-blog-empty">' + escapeHtml(message) + '</div>';
  }

  function showDetailLoading() {
    document.getElementById("blog-detail-content").innerHTML = '<div class="pwc-blog-loading">Loading...</div>';
  }

  function showDetailError() {
    document.getElementById("blog-detail-content").innerHTML = '<div class="pwc-blog-empty">Could not load post.</div>';
  }

  /* ── Author profile modal ────────────────────────────────────────────── */

  function showAuthorProfileLoading() {
    var modal = document.getElementById("blog-author-modal");
    var body  = document.getElementById("blog-author-modal-body");
    if (!modal || !body) return;
    body.innerHTML = '<div class="pwc-author-modal-loading">Loading profile…</div>';
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function renderAuthorProfile(user, friendStatus, currentUser) {
    var body = document.getElementById("blog-author-modal-body");
    if (!body) return;

    var url = (user.avatar_url || "").trim();
    if (url && location.protocol === "https:" && url.indexOf("http://") === 0) {
      url = "https://" + url.slice("http://".length);
    }

    var avatarHtml = url
      ? '<img src="' + escapeHtml(url) + '" class="pwc-author-modal-avatar-img" alt="">'
      : '<span class="pwc-author-modal-avatar-initials">'
          + escapeHtml(((user.firstName || "").charAt(0) + (user.lastName || "").charAt(0)).toUpperCase() || "?")
          + '</span>';

    var name = ((user.firstName || "") + " " + (user.lastName || "")).trim() || user.username || "Member";

    var bioHtml = user.bio
      ? '<p class="pwc-author-modal-bio">' + escapeHtml(user.bio) + '</p>'
      : '';

    var tagHtml = "";
    var interests = user.interests || [];
    if (interests.length) {
      tagHtml = '<div class="pwc-author-modal-tags">'
        + interests.map(function (t) { return '<span class="pwc-tag pwc-tag--rose">' + escapeHtml(t) + '</span>'; }).join("")
        + '</div>';
    }

    var friendBtnHtml = "";
    if (currentUser && user.id !== currentUser.id) {
      friendBtnHtml = '<div class="pwc-author-modal-friend" id="author-modal-friend-' + user.id + '">'
        + friendButtonHtml(user.id, friendStatus)
        + '</div>';
    }

    body.innerHTML =
      '<div class="pwc-author-modal-avatar">' + avatarHtml + '</div>' +
      '<div class="pwc-author-modal-name">'   + escapeHtml(name)            + '</div>' +
      '<div class="pwc-author-modal-username">@' + escapeHtml(user.username || "") + '</div>' +
      bioHtml + tagHtml + friendBtnHtml;
  }

  function showAuthorProfileError() {
    var body = document.getElementById("blog-author-modal-body");
    if (body) body.innerHTML = '<div class="pwc-author-modal-loading">Could not load profile.</div>';
  }

  function hideAuthorProfile() {
    var modal = document.getElementById("blog-author-modal");
    if (modal) modal.style.display = "none";
    document.body.style.overflow = "";
  }

  /* Update the friend button inside the author modal */
  function updateModalFriendButton(authorId, status) {
    var wrap = document.getElementById("author-modal-friend-" + authorId);
    if (wrap) wrap.innerHTML = friendButtonHtml(authorId, status);
  }

  /* ── Misc UI ─────────────────────────────────────────────────────────── */

  function setNewPostButton(visible) {
    var btn = document.getElementById("blog-new-btn");
    if (btn) btn.style.display = visible ? "" : "none";
  }

  return {
    renderPosts:              renderPosts,
    renderPagination:         renderPagination,
    renderPostDetail:         renderPostDetail,
    renderAuthorFilter:       renderAuthorFilter,
    showLoading:              showLoading,
    showError:                showError,
    showDetailLoading:        showDetailLoading,
    showDetailError:          showDetailError,
    setNewPostButton:         setNewPostButton,
    updateFriendButton:       updateFriendButton,
    showAuthorProfileLoading: showAuthorProfileLoading,
    renderAuthorProfile:      renderAuthorProfile,
    showAuthorProfileError:   showAuthorProfileError,
    hideAuthorProfile:        hideAuthorProfile,
    updateModalFriendButton:  updateModalFriendButton,
  };

})();
