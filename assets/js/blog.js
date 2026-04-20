/* ==========================================================================
   Blog — coordinator: manages state, binds events, and delegates to
   BlogAPI (HTTP) and BlogRenderer (DOM).
   ========================================================================== */

var Blog = (function () {
  "use strict";

  /* ── State ───────────────────────────────────────────────────────────── */

  var currentUser   = null;
  var currentPage   = 1;
  var currentSearch = "";
  var currentAuthor = "";
  var currentSort   = "newest";
  var pinnedOnly    = false;
  var debounceTimer = null;
  var authors       = [];
  var myGroups      = [];

  /* ── Init ────────────────────────────────────────────────────────────── */

  function init() {
    /* Restore cached user while we wait for backend validation */
    var stored = sessionStorage.getItem("pwc_user");
    if (stored) {
      try { currentUser = JSON.parse(stored); } catch (_) { currentUser = null; }
    }

    /* Always validate session with backend */
    BlogAPI.getCurrentUser()
      .then(function (u) {
        currentUser = u || null;
        if (u) sessionStorage.setItem("pwc_user", JSON.stringify(u));
        else   sessionStorage.removeItem("pwc_user");
        BlogRenderer.setNewPostButton(!!currentUser);
        UserProfileModal.init(currentUser, { onStatusChange: BlogRenderer.updateFriendButton });
        if (currentUser && typeof GroupAPI !== "undefined") {
          GroupAPI.getMyGroups()
            .then(function (groups) { myGroups = groups || []; })
            .catch(function () { myGroups = []; });
        }
      })
      .catch(function () {
        BlogRenderer.setNewPostButton(!!currentUser);
        UserProfileModal.init(currentUser, { onStatusChange: BlogRenderer.updateFriendButton });
      });

    bindEvents();
    loadPosts();
  }

  /* ── Event binding ───────────────────────────────────────────────────── */

  function bindEvents() {
    var searchInput = document.getElementById("blog-search");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
          currentSearch = searchInput.value;
          currentPage   = 1;
          loadPosts();
        }, 300);
      });
    }

    var sortSelect = document.getElementById("blog-filter-sort");
    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        currentSort = sortSelect.value;
        currentPage = 1;
        loadPosts();
      });
    }

    var authorSelect = document.getElementById("blog-filter-author");
    if (authorSelect) {
      authorSelect.addEventListener("change", function () {
        currentAuthor = authorSelect.value;
        currentPage   = 1;
        loadPosts();
      });
    }

    var pinnedBtn = document.getElementById("blog-filter-pinned");
    if (pinnedBtn) {
      pinnedBtn.addEventListener("click", function () {
        pinnedOnly = !pinnedOnly;
        pinnedBtn.classList.toggle("active", pinnedOnly);
        currentPage = 1;
        loadPosts();
      });
    }
  }

  /* ── Load posts ──────────────────────────────────────────────────────── */

  function loadPosts() {
    var params = new URLSearchParams();
    params.set("page",     currentPage);
    params.set("per_page", "10");
    params.set("sort",     currentSort);
    if (currentSearch) params.set("search", currentSearch);
    if (currentAuthor) params.set("author", currentAuthor);
    if (pinnedOnly)    params.set("pinned", "true");

    BlogRenderer.showLoading();

    BlogAPI.getPosts(params)
      .then(function (data) {
        BlogRenderer.renderPosts(data.posts, currentUser);
        BlogRenderer.renderPagination(data.page, data.pages);
        collectAuthors(data.posts);
        if (currentUser) fetchFriendStatuses(data.posts);
      })
      .catch(function () {
        BlogRenderer.showError("Could not load posts. Is the backend running?");
      });
  }

  /* ── Friend status fetching ──────────────────────────────────────────── */

  function fetchFriendStatuses(posts) {
    if (typeof FriendsAPI === "undefined") return;
    var seen = {};
    posts.forEach(function (p) {
      if (p.author_id && p.author_id !== currentUser.id && !seen[p.author_id]) {
        seen[p.author_id] = true;
        (function (authorId) {
          FriendsAPI.getStatus(authorId)
            .then(function (data) {
              BlogRenderer.updateFriendButton(authorId, data.status);
            })
            .catch(function () {});
        })(p.author_id);
      }
    });
  }

  function collectAuthors(posts) {
    posts.forEach(function (p) {
      if (p.author && authors.indexOf(p.author) === -1) {
        authors.push(p.author);
      }
    });
    BlogRenderer.renderAuthorFilter(authors);
  }

  /* ── Single post ─────────────────────────────────────────────────────── */

  function openPost(id) {
    var overlay = document.getElementById("blog-detail-overlay");
    BlogRenderer.showDetailLoading();
    overlay.style.display       = "flex";
    document.body.style.overflow = "hidden";

    BlogAPI.getPost(id)
      .then(function (post) {
        BlogRenderer.renderPostDetail(post, currentUser);
        if (currentUser && post.author_id && post.author_id !== currentUser.id && typeof FriendsAPI !== "undefined") {
          FriendsAPI.getStatus(post.author_id)
            .then(function (data) { BlogRenderer.updateFriendButton(post.author_id, data.status); })
            .catch(function () {});
        }
      })
      .catch(function () { BlogRenderer.showDetailError(); });
  }

  function hideDetail() {
    document.getElementById("blog-detail-overlay").style.display = "none";
    document.body.style.overflow = "";
  }

  /* ── Compose / Edit ──────────────────────────────────────────────────── */

  function populateGroupSelect(selectedGroupId) {
    var sel = document.getElementById("blog-post-group");
    if (!sel) return;
    sel.innerHTML = '<option value="">Public (visible to all)</option>';
    myGroups.forEach(function (g) {
      var opt = document.createElement("option");
      opt.value = g.id;
      opt.textContent = g.name + " (group only)";
      if (selectedGroupId && String(g.id) === String(selectedGroupId)) opt.selected = true;
      sel.appendChild(opt);
    });
  }

  function showCompose() {
    document.getElementById("blog-compose-title").textContent = "New Post";
    document.getElementById("blog-edit-id").value             = "";
    document.getElementById("blog-post-title").value          = "";
    document.getElementById("blog-post-body").value           = "";
    document.getElementById("blog-submit-btn").textContent    = "Publish";
    populateGroupSelect(null);
    document.getElementById("blog-compose-overlay").style.display = "flex";
    document.body.style.overflow = "hidden";
    document.getElementById("blog-post-title").focus();
  }

  function showEdit(postId) {
    BlogAPI.getPost(postId).then(function (post) {
      document.getElementById("blog-compose-title").textContent = "Edit Post";
      document.getElementById("blog-edit-id").value             = post.id;
      document.getElementById("blog-post-title").value          = post.title;
      document.getElementById("blog-post-body").value           = post.body;
      document.getElementById("blog-submit-btn").textContent    = "Save Changes";
      populateGroupSelect(post.group_id);
      document.getElementById("blog-compose-overlay").style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  }

  function hideCompose() {
    document.getElementById("blog-compose-overlay").style.display = "none";
    document.body.style.overflow = "";
  }

  function submitPost(e) {
    e.preventDefault();
    var editId  = document.getElementById("blog-edit-id").value;
    var title   = document.getElementById("blog-post-title").value.trim();
    var body    = document.getElementById("blog-post-body").value.trim();
    var groupSel = document.getElementById("blog-post-group");
    var groupId  = groupSel ? groupSel.value || null : null;
    if (!title || !body) return;

    var btn = document.getElementById("blog-submit-btn");
    btn.disabled    = true;
    btn.textContent = "Saving...";

    var apiCall = editId
      ? BlogAPI.updatePost(editId, title, body, groupId)
      : BlogAPI.createPost(title, body, groupId);

    apiCall
      .then(function () { hideCompose(); loadPosts(); })
      .catch(function (err) { alert(err.message); })
      .finally(function () {
        btn.disabled    = false;
        btn.textContent = editId ? "Save Changes" : "Publish";
      });
  }

  /* ── Comments ────────────────────────────────────────────────────────── */

  function submitComment(e, postId) {
    e.preventDefault();
    var body = document.getElementById("blog-comment-body").value.trim();
    if (!body) return;

    BlogAPI.createComment(postId, body)
      .then(function ()    { openPost(postId); })
      .catch(function (err) { alert(err.message); });
  }

  function deleteComment(commentId, postId) {
    if (!confirm("Delete this comment?")) return;
    BlogAPI.deleteComment(commentId)
      .then(function ()    { openPost(postId); })
      .catch(function (err) { alert(err.message); });
  }

  /* ── Admin: Pin / Unpin / Delete ─────────────────────────────────────── */

  function showPinModal(postId) {
    document.getElementById("blog-pin-post-id").value          = postId;
    document.getElementById("blog-pin-overlay").style.display  = "flex";
  }

  function hidePinModal() {
    document.getElementById("blog-pin-overlay").style.display = "none";
  }

  function pinPost(days) {
    var postId = document.getElementById("blog-pin-post-id").value;
    BlogAPI.pinPost(postId, days)
      .then(function ()    { hidePinModal(); loadPosts(); })
      .catch(function (err) { alert(err.message); });
  }

  function unpinPost(postId) {
    BlogAPI.unpinPost(postId)
      .then(function ()    { loadPosts(); })
      .catch(function (err) { alert(err.message); });
  }

  function deletePost(postId) {
    if (!confirm("Delete this post and all its comments?")) return;
    BlogAPI.deletePost(postId)
      .then(function () {
        var detail = document.getElementById("blog-detail-overlay");
        if (detail.style.display !== "none") hideDetail();
        loadPosts();
      })
      .catch(function (err) { alert(err.message); });
  }

  /* ── Author profile modal ────────────────────────────────────────────── */

  function openAuthorProfile(authorId) {
    UserProfileModal.open(authorId);
  }

  function closeAuthorProfile(e) {
    UserProfileModal.close(e);
  }

  /* ── Friend actions ──────────────────────────────────────────────────── */

  function addFriend(authorId) {
    if (typeof FriendsAPI === "undefined") return;
    FriendsAPI.sendRequest(authorId)
      .then(function () {
        BlogRenderer.updateFriendButton(authorId, "pending_sent");
        UserProfileModal.updateFriendButton(authorId, "pending_sent");
      })
      .catch(function (err) { alert(err.message); });
  }

  function acceptFriend(authorId) {
    if (typeof FriendsAPI === "undefined") return;
    FriendsAPI.accept(authorId)
      .then(function () {
        BlogRenderer.updateFriendButton(authorId, "accepted");
        UserProfileModal.updateFriendButton(authorId, "accepted");
      })
      .catch(function (err) { alert(err.message); });
  }

  function declineFriend(authorId) {
    if (typeof FriendsAPI === "undefined") return;
    FriendsAPI.decline(authorId)
      .then(function () {
        BlogRenderer.updateFriendButton(authorId, "none");
        UserProfileModal.updateFriendButton(authorId, "none");
      })
      .catch(function (err) { alert(err.message); });
  }

  /* ── Pagination ──────────────────────────────────────────────────────── */

  function goPage(p) {
    currentPage = p;
    loadPosts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ── Boot ────────────────────────────────────────────────────────────── */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* Public API */
  return {
    openPost:      openPost,
    hideDetail:    hideDetail,
    showCompose:   showCompose,
    showEdit:      showEdit,
    hideCompose:   hideCompose,
    submitPost:    submitPost,
    submitComment: submitComment,
    deleteComment: deleteComment,
    showPinModal:  showPinModal,
    hidePinModal:  hidePinModal,
    pinPost:       pinPost,
    unpinPost:     unpinPost,
    deletePost:    deletePost,
    goPage:        goPage,
    addFriend:           addFriend,
    acceptFriend:        acceptFriend,
    declineFriend:       declineFriend,
    openAuthorProfile:   openAuthorProfile,
    closeAuthorProfile:  closeAuthorProfile,
  };

})();
