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

      html += '<article class="pwc-blog-card' + (p.is_pinned ? ' pwc-blog-card--pinned' : '') + '" onclick="Blog.openPost(' + p.id + ')">'
        + '<div class="pwc-blog-card-top">'
        +   pinBadge + groupBadge
        +   '<div class="pwc-blog-card-admin">' + editBtn + adminBtns + '</div>'
        + '</div>'
        + '<h2 class="pwc-blog-card-title">'   + escapeHtml(p.title)             + '</h2>'
        + '<p class="pwc-blog-card-preview">'   + escapeHtml(preview)             + '</p>'
        + '<div class="pwc-blog-card-meta">'
        +   '<span class="pwc-blog-card-author">'   + escapeHtml(p.author || "Unknown") + '</span>'
        +   '<span class="pwc-blog-card-date">'     + date                             + '</span>'
        +   '<span class="pwc-blog-card-comments">' + p.comment_count + ' comment' + (p.comment_count !== 1 ? 's' : '') + '</span>'
        + '</div>'
        + '</article>';
    });

    container.innerHTML = html;
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

    var html = '<article class="pwc-blog-detail">'
      + pinLabel + groupLabel
      + '<h1>'                        + escapeHtml(post.title)             + '</h1>'
      + '<div class="pwc-blog-detail-meta">'
      +   '<span>By <strong>'         + escapeHtml(post.author || "Unknown") + '</strong></span>'
      +   '<span>'                    + date                                + '</span>'
      + '</div>'
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

  /* ── Misc UI ─────────────────────────────────────────────────────────── */

  function setNewPostButton(visible) {
    var btn = document.getElementById("blog-new-btn");
    if (btn) btn.style.display = visible ? "" : "none";
  }

  return {
    renderPosts:        renderPosts,
    renderPagination:   renderPagination,
    renderPostDetail:   renderPostDetail,
    renderAuthorFilter: renderAuthorFilter,
    showLoading:        showLoading,
    showError:          showError,
    showDetailLoading:  showDetailLoading,
    showDetailError:    showDetailError,
    setNewPostButton:   setNewPostButton,
  };

})();
