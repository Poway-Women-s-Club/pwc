/* Home page: “What we do” and Announcements from live blog API */

(function () {
  "use strict";

  function siteBase() {
    var c = document.querySelector('link[rel="canonical"]');
    if (c) {
      try {
        var u = new URL(c.href);
        return u.pathname.replace(/\/$/, "") || "";
      } catch (e) {}
    }
    return "";
  }

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  }

  function fmtDate(iso) {
    try {
      var d = new Date(iso);
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    } catch (e) {
      return "";
    }
  }

  function resolveApi() {
    if (typeof window.API !== "undefined" && window.API) {
      return String(window.API).replace(/\/$/, "");
    }
    if (typeof window.PWC_API_BASE_URL !== "undefined" && window.PWC_API_BASE_URL) {
      return String(window.PWC_API_BASE_URL).replace(/\/$/, "");
    }
    return "";
  }

  function loadWhatWeDo() {
    var el = document.getElementById("pwc-home-whatwedo");
    if (!el) return;
    var base = resolveApi();
    if (!base) {
      el.innerHTML =
        "<p class=\"pwc-home-feed-msg\">Set the site API URL so featured posts can load.</p>";
      return;
    }
    var params = new URLSearchParams();
    params.set("page", "1");
    params.set("per_page", "40");
    params.set("sort", "newest");
    fetch(base + "/api/blog/posts?" + params.toString(), { credentials: "include" })
      .then(function (r) {
        return r.ok ? r.json() : Promise.reject();
      })
      .then(function (data) {
        var posts = (data && data.posts) || [];
        var ww = posts.filter(function (p) {
          return /^what we do\s*:/i.test((p.title || "").trim());
        });
        if (!ww.length) {
          el.innerHTML =
            "<p class=\"pwc-home-feed-msg\">No “What we do” posts yet. Officers and members add them from the <strong>Blog</strong> using titles that start with <strong>What we do:</strong> — then the community can open each post to read and comment.</p>";
          return;
        }
        var sb = siteBase();
        var viewer = null;
        try { viewer = JSON.parse(sessionStorage.getItem("pwc_user") || "null"); } catch (e) {}
        var html = '<div class="pwc-home-ww-grid">';
        ww.slice(0, 8).forEach(function (p) {
          var shortTitle = (p.title || "").replace(/^what we do\s*:\s*/i, "").trim() || p.title;
          var prev = (p.body || "").replace(/\s+/g, " ").trim();
          if (prev.length > 140) prev = prev.slice(0, 137) + "…";
          var canManage = !!(viewer && (viewer.role === "admin" || String(viewer.id) === String(p.author_id)));
          html +=
            '<article class="pwc-home-ww-card">' +
            '<a class="pwc-home-ww-link" href="' +
            esc(sb + "/navigation/blog?post=" + p.id) +
            '">' +
            esc(shortTitle) +
            "</a>" +
            '<span class="pwc-home-ww-meta">' +
            "By " +
            esc(p.author || "Member") +
            " · " +
            esc(fmtDate(p.created_at)) +
            " · " +
            (p.comment_count || 0) +
            " comment" +
            ((p.comment_count || 0) === 1 ? "" : "s") +
            "</span>" +
            '<p class="pwc-home-ww-preview">' +
            esc(prev) +
            "</p>" +
            '<div class="pwc-home-ww-actions">' +
            '<a class="pwc-btn pwc-btn-border pwc-btn-sm" href="' + esc(sb + "/navigation/blog?post=" + p.id) + '">Read & comment</a>' +
            (canManage ? ('<a class="pwc-btn pwc-btn-sage pwc-btn-sm" href="' + esc(sb + "/navigation/blog?post=" + p.id) + '">Manage post</a>') : "") +
            "</div>" +
            "</article>";
        });
        html += "</div>";
        el.innerHTML = html;
      })
      .catch(function () {
        el.innerHTML = "<p class=\"pwc-home-feed-msg\">Could not load posts. Try again later.</p>";
      });
  }

  function loadAnnouncements() {
    var el = document.getElementById("pwc-home-announcements-list");
    var wrap = document.getElementById("pwc-home-announcements");
    if (!el || !wrap) return;
    var base = resolveApi();
    if (!base) {
      wrap.hidden = true;
      return;
    }
    var params = new URLSearchParams();
    params.set("page", "1");
    params.set("per_page", "8");
    params.set("sort", "newest");
    params.set("pinned", "true");
    fetch(base + "/api/blog/posts?" + params.toString(), { credentials: "include" })
      .then(function (r) {
        return r.ok ? r.json() : Promise.reject();
      })
      .then(function (data) {
        var posts = (data && data.posts) || [];
        if (!posts.length) {
          wrap.hidden = true;
          return;
        }
        wrap.hidden = false;
        var sb = siteBase();
        var html = '<ul class="pwc-home-ann-list">';
        posts.slice(0, 5).forEach(function (p) {
          html +=
            '<li><a href="' +
            esc(sb + "/navigation/blog?post=" + p.id) +
            '">' +
            esc(p.title) +
            "</a></li>";
        });
        html += "</ul>";
        el.innerHTML = html;
      })
      .catch(function () {
        wrap.hidden = true;
      });
  }

  function showLoggedInHints() {
    try {
      var u = JSON.parse(sessionStorage.getItem("pwc_user") || "null");
      var nodes = document.querySelectorAll(".pwc-home-logged-in-only");
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].style.display = u ? "block" : "none";
      }
    } catch (e) {}
  }

  function init() {
    loadWhatWeDo();
    loadAnnouncements();
    showLoggedInHints();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
