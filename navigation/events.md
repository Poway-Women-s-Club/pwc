---
# Use default layout (not `page`) so content is not trapped in `.post-content` (720px column).
layout: default
title: Events
permalink: /navigation/events/
show_reading_time: false
---
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.css">

<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js"></script>

<div class="events-full-width">
<div class="pwc-hero">
  <h1>Events</h1>
  <p>Regular meetings and community events. Click an event to RSVP.</p>
</div>

<div class="pwc-section">
  <h2>Upcoming Events</h2>
  <hr class="pwc-rule" />
  <p>Interactive calendar for Regular Meetings. Click an event to RSVP. Click a date to schedule a meeting.</p>

  <div id="pwc-events-group-filter" class="pwc-events-filter-bar" style="display:none;">
    <label for="pwc-events-group-select" style="font-weight:600; font-size:0.9rem; color:var(--pwc-muted);">Filter by group:</label>
    <select id="pwc-events-group-select" class="pwc-blog-select" style="max-width:220px;">
      <option value="">All Events</option>
    </select>
  </div>

  <div id="pwc-events-calendar" aria-label="Events calendar"></div>

<div id="pwc-rsvp-backdrop" class="pwc-modal-backdrop" hidden></div>
<div id="pwc-rsvp-modal" class="pwc-modal" role="dialog" aria-modal="true" aria-labelledby="pwc-rsvp-title" tabindex="-1" hidden>
  <button type="button" class="pwc-modal-close" aria-label="Close RSVP dialog" id="pwc-rsvp-close">×</button>
  <h3 id="pwc-rsvp-title">RSVP</h3>
  <p id="pwc-rsvp-meta"></p>
  <div id="pwc-admin-attendees" hidden>
    <p style="margin: 0.5rem 0 0; font-weight: 700;">Attendees (admin)</p>
    <div id="pwc-admin-attendees-count" style="margin-bottom: 0.5rem; color: rgba(255,255,255,0.85);"></div>
    <button id="pwc-admin-test-signup-btn" type="button" class="pwc-btn pwc-btn-border" style="margin-bottom:0.5rem;" hidden>Add Test Signup</button>
    <div id="pwc-admin-attendees-groups"></div>
  </div>

  <form id="pwc-rsvp-form" method="POST" action="#">
    <input type="hidden" name="event_id" id="pwc-rsvp-event-id" value="">
    <input type="hidden" name="event_title" id="pwc-rsvp-event-title" value="">
    <input type="hidden" name="event_datetime" id="pwc-rsvp-event-datetime" value="">

    <!-- Logged-in banner (hidden by default, shown via JS) -->
    <div id="pwc-rsvp-user-banner" class="pwc-rsvp-user-banner" hidden>
      RSVPing as <strong id="pwc-rsvp-user-display"></strong>
    </div>
    <div id="pwc-rsvp-session-mismatch" class="pwc-alert" style="margin-bottom:0.75rem;" hidden>
      <strong>Session not reaching the API.</strong>
      If this page is <code>http://localhost…</code> but <code>_config.yml</code> uses a <strong>different host</strong> (e.g. <code>https://…opencodingsociety.com</code>), the browser often <strong>will not send</strong> your login cookie on API calls — so you look logged in here but the server sees a guest.
      <br><br>
      <strong>Fix A (local dev):</strong> open this site as <code>http://localhost:…</code> (not GitHub Pages), run Flask on port <strong>8327</strong>, and <a href="{{ '/navigation/login' | relative_url }}">sign in again</a>. The Events page uses <code>events_api_local_url</code> from <code>_config.yml</code> when the hostname is localhost.
      <br>
      <strong>Fix B (remote API):</strong> on the server <code>.env</code> set <code>SESSION_COOKIE_CROSS_SITE=1</code> (and HTTPS only). Deploy team must allow your frontend origin in CORS.
      <br><br>
      <a href="{{ '/navigation/login' | relative_url }}">Open login</a> after changing API URL or server config.
    </div>

    <div class="pwc-form-grid">
      <!-- Name/email only shown for guests (hidden when logged in) -->
      <label id="pwc-rsvp-name-label">
        Your name
        <input type="text" name="name" autocomplete="name" required>
      </label>
      <label id="pwc-rsvp-email-label">
        Email
        <input type="email" name="email" autocomplete="email" required>
      </label>
      <label class="pwc-span-2">
        Are you attending?
        <select name="attendance" required>
          <option value="yes">Yes, I will attend</option>
          <option value="no">No, I can’t attend</option>
          <option value="maybe">Maybe / I’m not sure yet</option>
        </select>
      </label>
      <label class="pwc-span-2">
        Notes (optional)
        <textarea name="notes" rows="3"></textarea>
      </label>
      <label class="pwc-span-2" id="pwc-rsvp-reminder-wrap" hidden>
        <span style="display:flex; gap:0.55rem; align-items:flex-start;">
          <input type="checkbox" id="pwc-rsvp-wants-reminder" name="wants_reminders" style="width:auto; min-width:auto; margin-top:0.2rem; flex:0 0 auto;">
          <span>Email me a reminder about 30 minutes before this meeting (uses your member profile email after you link Google).</span>
        </span>
      </label>
      <p class="pwc-span-2" id="pwc-rsvp-reminder-hint" style="font-size:0.88rem; color: var(--pwc-muted); margin:0; line-height:1.45;" hidden></p>
    </div>

    <button type="submit" class="pwc-btn pwc-btn-fill" style="margin-top: 0.85rem;">Submit RSVP</button>
    <div id="pwc-rsvp-feedback" class="pwc-alert" hidden></div>
    <div id="pwc-rsvp-missing-config" class="pwc-alert" hidden>
      RSVP API is not configured yet. Set <code>events_api_base_url</code> in <code>_config.yml</code>.
    </div>
  </form>
</div>

<div id="pwc-meeting-modal-backdrop" class="pwc-modal-backdrop" hidden></div>
<div id="pwc-meeting-modal" class="pwc-modal" role="dialog" aria-modal="true" aria-labelledby="pwc-meeting-modal-title" tabindex="-1" hidden>
  <button type="button" class="pwc-modal-close" aria-label="Close meeting scheduling dialog" id="pwc-meeting-modal-close">×</button>
  <h3 id="pwc-meeting-modal-title">Schedule a Meeting</h3>
  <p id="pwc-meeting-modal-meta"></p>

  <form id="pwc-meeting-modal-form" method="POST" action="#">
    <div class="pwc-form-grid">
      <label>
        Your name
        <input type="text" name="name" autocomplete="name" required>
      </label>
      <label>
        Email
        <input type="email" name="email" autocomplete="email" required>
      </label>
      <label>
        Start (date/time)
        <input type="datetime-local" name="preferred_datetime" required>
      </label>
      <label>
        End (date/time)
        <input type="datetime-local" name="preferred_end_datetime" required>
      </label>
      <label>
        Max attendees
        <input type="number" name="max_attendees" min="1" step="1" placeholder="e.g. 25">
      </label>
      <label id="pwc-meeting-visibility-scope-label">
        Who can see/join this event?
        <select name="visibility_scope">
          <option value="club">Entire club</option>
          <option value="groups">Selected groups only</option>
        </select>
      </label>
      <label class="pwc-span-2" id="pwc-meeting-visible-groups-label" hidden>
        Allowed groups
        <div id="pwc-meeting-visible-groups-list" style="max-height:140px; overflow:auto; border:1px solid rgba(232,223,226,0.95); border-radius:8px; padding:0.5rem;"></div>
      </label>
      <label class="pwc-span-2">
        Topic / meeting type
        <input type="text" name="topic" required>
      </label>
      <label class="pwc-span-2">
        Description
        <textarea name="description" rows="4" required></textarea>
      </label>
    </div>

    <button type="submit" class="pwc-btn pwc-btn-fill" style="margin-top: 0.85rem;">Submit Meeting Request</button>
    <div id="pwc-meeting-modal-feedback" class="pwc-alert" hidden></div>
    <div id="pwc-meeting-modal-missing-config" class="pwc-alert" hidden>
      Meeting scheduling API is not configured yet. Set <code>events_api_base_url</code> in <code>_config.yml</code>.
    </div>
  </form>
</div>

<hr class="pwc-rule" />





<hr class="pwc-rule" />


 </div>
<script>
  (function () {
    var API_BASE_URL = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
      ? "{{ site.events_api_local_url | default: 'http://localhost:8327' | escape }}"
      : "{{ site.events_api_base_url | default: '' | escape }}";
    var calendarInstance = null;

    function $(id) { return document.getElementById(id); }

    function formatLocalDateTime(d) {
      try {
        return d.toLocaleString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit"
        });
      } catch (e) {
        return d.toString();
      }
    }

    function formatLocalDate(d) {
      try {
        return d.toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric"
        });
      } catch (e) {
        return d.toString();
      }
    }

    function pad2(n) {
      return String(n).padStart(2, "0");
    }

    function toDatetimeLocalValue(d) {
      // datetime-local expects: YYYY-MM-DDTHH:MM (local time, no timezone suffix)
      return (
        d.getFullYear() +
        "-" + pad2(d.getMonth() + 1) +
        "-" + pad2(d.getDate()) +
        "T" + pad2(d.getHours()) +
        ":" + pad2(d.getMinutes())
      );
    }

    function secondTuesday(year, monthIndex) {
      // monthIndex: 0=Jan ... 11=Dec
      // second Tuesday = first Tuesday + 7 days
      var first = new Date(year, monthIndex, 1);
      var firstDay = first.getDay(); // 0=Sun ... 2=Tue
      var offsetToTuesday = (2 - firstDay + 7) % 7;
      var firstTuesdayDate = 1 + offsetToTuesday;
      return new Date(year, monthIndex, firstTuesdayDate + 7);
    }

    function buildRegularMeetings() {
      var now = new Date();
      var startYear = now.getFullYear();
      var endYear = startYear + 1; // covers current season through next June

      var meetings = [];

      for (var y = startYear; y <= endYear; y++) {
        for (var m = 0; m < 12; m++) {
          // Meetings happen September through June (skip July/Aug)
          if (!(m >= 8 || m <= 5)) continue;

          var dt = secondTuesday(y, m);
          dt.setHours(10, 0, 0, 0); // 10:00 AM

          if (dt < now) continue;

          var end = new Date(dt.getTime() + 2 * 60 * 60 * 1000); // 2-hour window

          var monthName = dt.toLocaleString(undefined, { month: "long" });
          var title = "General Meeting — " + monthName;

          meetings.push({
            title: title,
            start: dt,
            end: end,
            allDay: false,
            backgroundColor: "rgba(196, 120, 138, 0.30)",
            borderColor: "rgba(196, 120, 138, 0.90)",
            textColor: "#141414",
            extendedProps: {
              // No backend Event row for recurring meetings (we still allow public RSVP).
              backendEventId: "",
              location: "Templars Hall, Old Poway Park"
            }
          });
        }
      }

      return meetings;
    }

    function apiUrl(path) {
      if (!API_BASE_URL) return "";
      return API_BASE_URL.replace(/\/$/, "") + path;
    }

    var myGroupIds = [];
    var selectedGroupFilter = "";
    var allGroupsCache = [];

    var authCache = { status: "unknown", user: null };

    async function getCurrentUser() {
      if (!API_BASE_URL) return null;
      if (authCache.status === "done") return authCache.user;

      try {
        var resp = await fetch(apiUrl("/api/auth/me"), { credentials: "include" });
        if (!resp.ok) {
          authCache.user = null;
          authCache.status = "done";
          return null;
        }
        var data = await resp.json();
        // Backend returns the user object directly (or {user:null}) on failure.
        if (data && (data.username || data.email || data.role)) {
          if (typeof data.hasGoogleLinked === "undefined") data.hasGoogleLinked = false;
          authCache.user = data;
        } else {
          authCache.user = null;
        }
        authCache.status = "done";
        return authCache.user;
      } catch (e) {
        // Do not cache failures — e.g. API was down on first load; retry later on same page.
        authCache.user = null;
        authCache.status = "unknown";
        return null;
      }
    }

    function invalidateAuthCache() {
      authCache.status = "unknown";
      authCache.user = null;
    }

    function isAdminUser(u) {
      return !!(u && u.role && String(u.role).toLowerCase() === "admin");
    }

    function displayNameFromUser(u) {
      if (!u) return "";
      var first = u.firstName || u.first_name || "";
      var last = u.lastName || u.last_name || "";
      var full = (String(first || "").trim() + " " + String(last || "").trim()).trim();
      if (full) return full;
      return u.username || u.email || "";
    }

    function capacityColor(fillRatio) {
      var r = Number(fillRatio || 0);
      if (!isFinite(r)) r = 0;
      if (r >= 1) return { bg: "rgba(168, 69, 86, 0.55)", border: "rgba(168, 69, 86, 0.95)" };
      if (r >= 0.8) return { bg: "rgba(182, 84, 96, 0.50)", border: "rgba(182, 84, 96, 0.92)" };
      if (r >= 0.6) return { bg: "rgba(196, 120, 138, 0.45)", border: "rgba(196, 120, 138, 0.88)" };
      if (r >= 0.4) return { bg: "rgba(186, 148, 112, 0.40)", border: "rgba(186, 148, 112, 0.85)" };
      if (r >= 0.2) return { bg: "rgba(158, 156, 112, 0.35)", border: "rgba(158, 156, 112, 0.85)" };
      return { bg: "rgba(122, 142, 107, 0.28)", border: "rgba(122, 142, 107, 0.85)" };
    }

    function getCheckedGroupIds() {
      var list = $("pwc-meeting-visible-groups-list");
      if (!list) return [];
      var checked = list.querySelectorAll("input[type='checkbox'][data-group-id]:checked");
      var ids = [];
      checked.forEach(function (el) {
        var n = parseInt(el.getAttribute("data-group-id"), 10);
        if (isFinite(n) && n > 0) ids.push(n);
      });
      return ids;
    }

    function renderVisibilityGroupOptions(groups, preselectedIds) {
      var list = $("pwc-meeting-visible-groups-list");
      if (!list) return;
      list.innerHTML = "";
      var selectedSet = {};
      (preselectedIds || []).forEach(function (id) { selectedSet[String(id)] = true; });
      (groups || []).forEach(function (g) {
        var row = document.createElement("label");
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.gap = "0.45rem";
        row.style.margin = "0.2rem 0";
        row.style.fontSize = "0.9rem";
        row.style.cursor = "pointer";

        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.setAttribute("data-group-id", String(g.id));
        cb.style.width = "auto";
        cb.style.minWidth = "auto";
        cb.style.flex = "0 0 auto";
        cb.style.margin = "0";
        if (selectedSet[String(g.id)]) cb.checked = true;

        row.appendChild(cb);
        row.appendChild(document.createTextNode(g.name));
        list.appendChild(row);
      });
    }

    async function loadAllGroups() {
      if (!API_BASE_URL) return [];
      if (allGroupsCache.length) return allGroupsCache;
      try {
        var resp = await fetch(apiUrl("/api/groups/"), { credentials: "include" });
        if (!resp.ok) return [];
        var data = await resp.json();
        allGroupsCache = Array.isArray(data) ? data : [];
        return allGroupsCache;
      } catch (_) {
        return [];
      }
    }

    /** Admins: all groups. Members: groups they belong to. */
    function loadGroupsForMeetingModal(me) {
      if (!API_BASE_URL) return Promise.resolve([]);
      if (me && isAdminUser(me)) return loadAllGroups();
      return fetch(apiUrl("/api/groups/my"), { credentials: "include" })
        .then(function (r) { return r.ok ? r.json() : []; })
        .then(function (data) { return Array.isArray(data) ? data : []; });
    }

    async function loadEventAttendingCount(eventId) {
      if (!API_BASE_URL) return null;
      if (!eventId) return null;
      try {
        var resp = await fetch(apiUrl("/api/events/" + eventId + "/attending-count"), { credentials: "omit" });
        if (!resp.ok) return null;
        var data = await resp.json();
        if (data && typeof data.attending === "number") return data.attending;
        return null;
      } catch (e) {
        return null;
      }
    }

    async function loadEventAttendeesAdmin(eventId) {
      if (!API_BASE_URL) return null;
      if (!eventId) return null;

      // Only admins can view the list (backend enforces this).
      var me = await getCurrentUser();
      if (!isAdminUser(me)) return null;

      try {
        var resp = await fetch(apiUrl("/api/events/" + eventId + "/attendees"), { credentials: "include" });
        if (!resp.ok) return null;
        return await resp.json();
      } catch (e) {
        return null;
      }
    }

    async function loadPublicAttendeesAdmin(eventTitle, eventDatetimeIso) {
      if (!API_BASE_URL) return null;
      if (!eventTitle || !eventDatetimeIso) return null;

      var me = await getCurrentUser();
      if (!isAdminUser(me)) return null;

      try {
        var qs = "?event_title=" + encodeURIComponent(eventTitle) + "&event_datetime=" + encodeURIComponent(eventDatetimeIso);
        var resp = await fetch(apiUrl("/api/events/public-rsvp-attendees" + qs), { credentials: "include" });
        if (!resp.ok) return null;
        return await resp.json();
      } catch (e) {
        return null;
      }
    }

    async function removeLoggedInRsvpAdmin(eventId, userId) {
      if (!API_BASE_URL || !eventId || !userId) return false;
      var resp = await fetch(apiUrl("/api/events/" + eventId + "/admin-remove-user-rsvp/" + userId), {
        method: "DELETE",
        credentials: "include"
      });
      return resp.ok;
    }

    async function removePublicRsvpAdmin(publicRsvpId) {
      if (!API_BASE_URL || !publicRsvpId) return false;
      var resp = await fetch(apiUrl("/api/events/public-rsvp/" + publicRsvpId), {
        method: "DELETE",
        credentials: "include"
      });
      return resp.ok;
    }

    async function loadBackendEvents() {
      if (!API_BASE_URL) return [];

      try {
        // Show both past + future so users see scheduled meetings on the calendar
        var resp = await fetch(apiUrl("/api/events/?upcoming=false"), { credentials: "include" });
        if (!resp.ok) return [];
        var list = await resp.json();
        if (!Array.isArray(list)) return [];

        return list.map(function (e) {
          var isGroupEvent = !!(e.group_id);
          var isMemberGroup = isGroupEvent && myGroupIds.indexOf(e.group_id) !== -1;

          // Gold highlight for group events the user belongs to
          var cap = capacityColor(e.fill_ratio);
          var bgColor    = cap.bg;
          var bdrColor   = cap.border;
          if (isGroupEvent && isMemberGroup) {
            bgColor  = "rgba(201, 160, 112, 0.45)";
            bdrColor = "rgba(201, 160, 112, 0.92)";
          } else if (isGroupEvent) {
            bgColor  = "rgba(196, 120, 138, 0.22)";
            bdrColor = "rgba(196, 120, 138, 0.70)";
          }

          return {
            id: e.id,
            title: e.group_name ? e.title + " [" + e.group_name + "]" : e.title,
            start: e.start_time,
            end: e.end_time,
            allDay: false,
            backgroundColor: bgColor,
            borderColor: bdrColor,
            textColor: "#141414",
            extendedProps: {
              backendEventId: e.id,
              location: e.location || "",
              groupId: e.group_id || null,
              groupName: e.group_name || "",
              visibilityScope: e.visibility_scope || "club",
              visibleGroupIds: Array.isArray(e.visible_group_ids) ? e.visible_group_ids : [],
              maxAttendees: e.max_attendees || null,
              seatsUsed: e.seats_used || 0,
              fillRatio: e.fill_ratio || 0,
              isFull: !!e.is_full
            }
          };
        });
      } catch (err) {
        return [];
      }
    }

    function setHiddenValue(id, value) {
      var el = $(id);
      if (el) el.value = value;
    }

    async function openRsvpModal(fcEvent) {
      var backdrop = $("pwc-rsvp-backdrop");
      var modal = $("pwc-rsvp-modal");
      if (!backdrop || !modal || !fcEvent) return;

      var start = fcEvent.start;
      var meta = "";
      if (start) meta = formatLocalDateTime(start);

      var loc = (fcEvent.extendedProps && fcEvent.extendedProps.location) ? fcEvent.extendedProps.location : "";
      if (loc) meta = meta + " — " + loc;
      var maxAttendees = fcEvent.extendedProps ? fcEvent.extendedProps.maxAttendees : null;
      var seatsUsed = fcEvent.extendedProps ? fcEvent.extendedProps.seatsUsed : null;
      if (maxAttendees) {
        var seatsText = (typeof seatsUsed === "number" ? seatsUsed : "0") + "/" + maxAttendees + " seats";
        meta = meta ? (meta + " — " + seatsText) : seatsText;
      }

      $("pwc-rsvp-title").textContent = "RSVP: " + (fcEvent.title || "Meeting");
      var baseMeta = meta;
      $("pwc-rsvp-meta").textContent = baseMeta;
      var metaEl = $("pwc-rsvp-meta");
      if (metaEl) metaEl.dataset.baseMeta = baseMeta;

      var backendEventId = (fcEvent.extendedProps && fcEvent.extendedProps.backendEventId) ? fcEvent.extendedProps.backendEventId : "";
      setHiddenValue("pwc-rsvp-event-id", backendEventId);
      setHiddenValue("pwc-rsvp-event-title", fcEvent.title || "");
      setHiddenValue("pwc-rsvp-event-datetime", start ? start.toISOString() : "");

      var rsvpForm = $("pwc-rsvp-form");
      if (rsvpForm) rsvpForm.dataset.location = loc;

      /* Fresh session check: nav can show sessionStorage while /api/auth/me is stale or failed earlier */
      invalidateAuthCache();
      /* Hide name/email fields when logged in */
      var me = await getCurrentUser();
      var nameLabel = $("pwc-rsvp-name-label");
      var emailLabel = $("pwc-rsvp-email-label");
      var userBanner = $("pwc-rsvp-user-banner");
      var userDisplay = $("pwc-rsvp-user-display");

      if (me) {
        if (nameLabel) {
          nameLabel.hidden = true;
          if (nameLabel.querySelector("input")) nameLabel.querySelector("input").removeAttribute("required");
        }
        if (emailLabel) {
          emailLabel.hidden = true;
          if (emailLabel.querySelector("input")) emailLabel.querySelector("input").removeAttribute("required");
        }
        if (userBanner) userBanner.hidden = false;
        if (userDisplay) {
          var displayName = displayNameFromUser(me) || "you";
          userDisplay.textContent = displayName;
        }
      } else {
        if (nameLabel) {
          nameLabel.hidden = false;
          if (nameLabel.querySelector("input")) nameLabel.querySelector("input").setAttribute("required", "");
        }
        if (emailLabel) {
          emailLabel.hidden = false;
          if (emailLabel.querySelector("input")) emailLabel.querySelector("input").setAttribute("required", "");
        }
        if (userBanner) userBanner.hidden = true;
      }

      var sessionMismatchEl = $("pwc-rsvp-session-mismatch");
      if (sessionMismatchEl) {
        var cachedUser = null;
        try { cachedUser = JSON.parse(sessionStorage.getItem("pwc_user")); } catch (e2) { cachedUser = null; }
        sessionMismatchEl.hidden = !(cachedUser && !me);
      }

      var reminderWrap = $("pwc-rsvp-reminder-wrap");
      var reminderHint = $("pwc-rsvp-reminder-hint");
      var reminderCb = $("pwc-rsvp-wants-reminder");
      if (reminderWrap) reminderWrap.hidden = true;
      if (reminderHint) reminderHint.hidden = true;
      if (reminderCb) reminderCb.checked = false;

      if (me && backendEventId) {
        if (reminderWrap) reminderWrap.hidden = false;
        if (reminderHint) {
          if (!me.hasGoogleLinked) {
            reminderHint.hidden = false;
            reminderHint.textContent =
              "To receive reminders, link your Google account under Profile → Security (use the same email as your member profile).";
          } else {
            reminderHint.hidden = true;
            reminderHint.textContent = "";
          }
        }
        fetch(apiUrl("/api/events/" + backendEventId), { credentials: "include" })
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (ev) {
            if (reminderCb && ev && ev.user_wants_email_reminder) reminderCb.checked = true;
          });
      }

      backdrop.hidden = false;
      modal.hidden = false;
      modal.focus();

      // Attendance count + (if admin) attendee list.
      var adminPanel = $("pwc-admin-attendees");
      var adminGroups = $("pwc-admin-attendees-groups");
      var adminCountEl = $("pwc-admin-attendees-count");
      var adminTestBtn = $("pwc-admin-test-signup-btn");
      if (adminPanel) adminPanel.hidden = true;
      if (adminTestBtn) adminTestBtn.hidden = true;

      var backendId = backendEventId || "";
      if (backendId && start) {
        if (adminTestBtn && me && me.role === "admin") {
          adminTestBtn.hidden = false;
          adminTestBtn.textContent = "Add Test Signups";
          adminTestBtn.onclick = async function () {
            try {
              var raw = window.prompt("How many test users to add?", "1");
              if (raw === null) return;
              var count = parseInt(raw, 10);
              if (!isFinite(count) || count < 1) {
                showRsvpFeedback("Please enter a valid positive number.", true);
                return;
              }
              var resp = await fetch(apiUrl("/api/events/" + backendId + "/admin-test-signup"), {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ count: count })
              });
              var data = {};
              try { data = await resp.json(); } catch (_) {}
              if (!resp.ok) {
                showRsvpFeedback((data && data.error) ? data.error : "Failed to add test signup.", true);
                return;
              }
              var added = (data && typeof data.added === "number") ? data.added : count;
              var req = (data && typeof data.requested === "number") ? data.requested : count;
              var msg = (added === req)
                ? ("Added " + added + " test signup" + (added === 1 ? "" : "s") + ".")
                : ("Added " + added + " of " + req + " test signups (event reached capacity).");
              showRsvpFeedback(msg, false);
              if (calendarInstance && calendarInstance.refetchEvents) calendarInstance.refetchEvents();
              openRsvpModal(fcEvent);
            } catch (err) {
              showRsvpFeedback((err && err.message) ? err.message : "Failed to add test signup.", true);
            }
          };
        }
        loadEventAttendingCount(backendId).then(function (count) {
          if (typeof count === "number") {
            $("pwc-rsvp-meta").textContent = baseMeta + " — " + count + " attending";
          }
        });

        loadEventAttendeesAdmin(backendId).then(function (payload) {
          if (!payload) return;
          if (!adminPanel || !adminGroups || !adminCountEl) return;

          adminPanel.hidden = false;
          adminCountEl.textContent = (payload.counts && payload.counts.attending_total !== undefined)
            ? ("Total attending: " + payload.counts.attending_total)
            : "Total attending: —";

          var groupsHtml = "";
          if (payload.attendees) {
            var loggedIn = payload.attendees.logged_in || [];
            var pub = payload.attendees.public || [];

            groupsHtml += "<div style='margin-top:0.75rem;'><strong>Logged-in RSVPs</strong></div>";
            if (!loggedIn.length) groupsHtml += "<div style='color:rgba(255,255,255,0.7); font-size:0.9rem;'>None</div>";
            loggedIn.forEach(function (u) {
              groupsHtml += "<div style='font-size:0.92rem; margin:0.25rem 0;'>"
                + (u.username || "—") + " — " + (u.email || "—")
                + (u.user_id ? " <button type='button' class='pwc-btn pwc-btn-border pwc-remove-loggedin' data-user-id='" + u.user_id + "' style='margin-left:0.5rem;padding:0.15rem 0.45rem;font-size:0.75rem;'>Remove</button>" : "")
                + "</div>";
            });

            groupsHtml += "<div style='margin-top:0.75rem;'><strong>Public RSVPs</strong></div>";
            if (!pub.length) groupsHtml += "<div style='color:rgba(255,255,255,0.7); font-size:0.9rem;'>None</div>";
            pub.forEach(function (r) {
              groupsHtml += "<div style='font-size:0.92rem; margin:0.25rem 0;'>"
                + (r.name || "—") + " (" + (r.attendance || "—") + ") — " + (r.email || "—")
                + (r.public_rsvp_id ? " <button type='button' class='pwc-btn pwc-btn-border pwc-remove-public' data-public-rsvp-id='" + r.public_rsvp_id + "' style='margin-left:0.5rem;padding:0.15rem 0.45rem;font-size:0.75rem;'>Remove</button>" : "")
                + "</div>";
            });
          }

          adminGroups.innerHTML = groupsHtml;
          var rmLogged = adminGroups.querySelectorAll(".pwc-remove-loggedin");
          rmLogged.forEach(function (btn) {
            btn.addEventListener("click", async function () {
              var uid = btn.getAttribute("data-user-id");
              if (!uid) return;
              var ok = await removeLoggedInRsvpAdmin(backendId, uid);
              if (!ok) { showRsvpFeedback("Failed to remove logged-in RSVP.", true); return; }
              showRsvpFeedback("Removed logged-in RSVP.", false);
              if (calendarInstance && calendarInstance.refetchEvents) calendarInstance.refetchEvents();
              openRsvpModal(fcEvent);
            });
          });
          var rmPublic = adminGroups.querySelectorAll(".pwc-remove-public");
          rmPublic.forEach(function (btn) {
            btn.addEventListener("click", async function () {
              var rid = btn.getAttribute("data-public-rsvp-id");
              if (!rid) return;
              var ok = await removePublicRsvpAdmin(rid);
              if (!ok) { showRsvpFeedback("Failed to remove public RSVP.", true); return; }
              showRsvpFeedback("Removed public RSVP.", false);
              if (calendarInstance && calendarInstance.refetchEvents) calendarInstance.refetchEvents();
              openRsvpModal(fcEvent);
            });
          });
        });
      } else if (start && fcEvent.title) {
        loadAttendingCount(fcEvent.title, start.toISOString()).then(function (count) {
          if (typeof count === "number") {
            $("pwc-rsvp-meta").textContent = baseMeta + " — " + count + " attending";
          }
        });

        loadPublicAttendeesAdmin(fcEvent.title, start.toISOString()).then(function (payload) {
          if (!payload) return;
          if (!adminPanel || !adminGroups || !adminCountEl) return;

          adminPanel.hidden = false;
          adminCountEl.textContent = "Total attending: " + (payload.attending !== undefined ? payload.attending : "—");

          var groupsHtml2 = "";
          groupsHtml2 += "<div style='margin-top:0.75rem;'><strong>Public RSVPs</strong></div>";
          var list = payload.attendees || [];
          if (!list.length) {
            groupsHtml2 += "<div style='color:rgba(255,255,255,0.7); font-size:0.9rem;'>None</div>";
          } else {
            list.forEach(function (r) {
              groupsHtml2 += "<div style='font-size:0.92rem; margin:0.25rem 0;'>"
                + (r.name || "—") + " (" + (r.attendance || "—") + ") — " + (r.email || "—")
                + (r.public_rsvp_id ? " <button type='button' class='pwc-btn pwc-btn-border pwc-remove-public' data-public-rsvp-id='" + r.public_rsvp_id + "' style='margin-left:0.5rem;padding:0.15rem 0.45rem;font-size:0.75rem;'>Remove</button>" : "")
                + "</div>";
            });
          }
          adminGroups.innerHTML = groupsHtml2;
          var rmPublic2 = adminGroups.querySelectorAll(".pwc-remove-public");
          rmPublic2.forEach(function (btn) {
            btn.addEventListener("click", async function () {
              var rid = btn.getAttribute("data-public-rsvp-id");
              if (!rid) return;
              var ok = await removePublicRsvpAdmin(rid);
              if (!ok) { showRsvpFeedback("Failed to remove public RSVP.", true); return; }
              showRsvpFeedback("Removed public RSVP.", false);
              if (calendarInstance && calendarInstance.refetchEvents) calendarInstance.refetchEvents();
              openRsvpModal(fcEvent);
            });
          });
        });
      }
    }

    function closeRsvpModal() {
      var backdrop = $("pwc-rsvp-backdrop");
      var modal = $("pwc-rsvp-modal");
      if (!backdrop || !modal) return;
      backdrop.hidden = true;
      modal.hidden = true;
    }

    function openMeetingModal(selectedDate) {
      var backdrop = $("pwc-meeting-modal-backdrop");
      var modal = $("pwc-meeting-modal");
      if (!backdrop || !modal) return;

      var meta = selectedDate ? formatLocalDate(selectedDate) : "";
      $("pwc-meeting-modal-meta").textContent = meta ? ("Selected: " + meta) : "";

      // Prefill time to 10:00 AM (user can change it).
      var dt = selectedDate ? new Date(selectedDate) : new Date();
      dt.setHours(10, 0, 0, 0);
      var dtEnd = new Date(dt.getTime() + 2 * 60 * 60 * 1000); // default: 2-hour window

      var form = $("pwc-meeting-modal-form");
      if (form && form.elements["preferred_datetime"] && form.elements["preferred_end_datetime"]) {
        form.elements["preferred_datetime"].value = toDatetimeLocalValue(dt);
        form.elements["preferred_end_datetime"].value = toDatetimeLocalValue(dtEnd);
      }

      // Logged-in users should not re-enter name/email.
      getCurrentUser().then(function (me) {
        if (!form) return;
        var nameInput = form.elements["name"];
        var emailInput = form.elements["email"];
        var scopeLabel = $("pwc-meeting-visibility-scope-label");
        var groupsLabel = $("pwc-meeting-visible-groups-label");
        var scopeSelect = form.elements["visibility_scope"];
        var groupsList = $("pwc-meeting-visible-groups-list");

        function syncVisibilityUi() {
          if (!scopeSelect || !groupsLabel || !groupsList) return;
          var isGroups = scopeSelect.value === "groups";
          groupsLabel.hidden = !isGroups;
          if (groupsList) groupsList.setAttribute("data-required", isGroups ? "1" : "0");
        }

        if (me) {
          var autoName = displayNameFromUser(me) || "Member";
          var autoEmail = me.email || "";
          if (nameInput) {
            nameInput.value = autoName;
            nameInput.required = false;
            if (nameInput.parentElement) nameInput.parentElement.hidden = true;
          }
          if (emailInput) {
            emailInput.value = autoEmail;
            emailInput.required = false;
            if (emailInput.parentElement) emailInput.parentElement.hidden = true;
          }
          if (scopeLabel) scopeLabel.hidden = false;
          if (scopeSelect) scopeSelect.value = "club";
          loadGroupsForMeetingModal(me).then(function (groups) {
            renderVisibilityGroupOptions(groups, myGroupIds || []);
            syncVisibilityUi();
          });
          if (scopeSelect) scopeSelect.onchange = syncVisibilityUi;
        } else {
          if (nameInput) {
            nameInput.required = true;
            if (nameInput.parentElement) nameInput.parentElement.hidden = false;
          }
          if (emailInput) {
            emailInput.required = true;
            if (emailInput.parentElement) emailInput.parentElement.hidden = false;
          }
          if (scopeLabel) scopeLabel.hidden = true;
          if (groupsLabel) groupsLabel.hidden = true;
          if (scopeSelect) scopeSelect.value = "club";
          if (groupsList) {
            groupsList.setAttribute("data-required", "0");
            groupsList.innerHTML = "";
          }
        }
      });

      var missing = $("pwc-meeting-modal-missing-config");
      var feedback = $("pwc-meeting-modal-feedback");
      if (missing) missing.hidden = true;
      if (feedback) { feedback.hidden = true; feedback.textContent = ""; }

      backdrop.hidden = false;
      modal.hidden = false;
      modal.focus();
    }

    function closeMeetingModal() {
      var backdrop = $("pwc-meeting-modal-backdrop");
      var modal = $("pwc-meeting-modal");
      if (!backdrop || !modal) return;
      backdrop.hidden = true;
      modal.hidden = true;
    }

    function clearRsvpFeedback() {
      var el = $("pwc-rsvp-feedback");
      if (el) {
        el.textContent = "";
        el.hidden = true;
      }
    }

    function showRsvpFeedback(msg, isError) {
      var el = $("pwc-rsvp-feedback");
      if (!el) return;
      el.hidden = false;
      el.textContent = msg;
      if (isError) {
        el.style.background = "rgba(196,120,138,0.25)";
        el.style.borderColor = "rgba(196,120,138,0.55)";
      }
    }

    async function submitRsvp(payload) {
      if (!API_BASE_URL) {
        showRsvpFeedback("RSVP API is not configured yet. Set events_api_base_url in _config.yml.", true);
        return;
      }

      var resp = await fetch(apiUrl("/api/events/public-rsvp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      var data = {};
      try { data = await resp.json(); } catch (e) { data = {}; }

      if (!resp.ok) {
        showRsvpFeedback((data && data.error) ? data.error : "Failed to submit RSVP.", true);
        return;
      }

      showRsvpFeedback("Thanks! Your RSVP was submitted.", false);
    }

    async function loadAttendingCount(eventTitle, eventDatetimeIso) {
      if (!API_BASE_URL) return null;
      if (!eventTitle || !eventDatetimeIso) return null;

      try {
        var qs = "?event_title=" + encodeURIComponent(eventTitle) + "&event_datetime=" + encodeURIComponent(eventDatetimeIso);
        var resp = await fetch(apiUrl("/api/events/public-rsvp-count" + qs), { credentials: "omit" });
        if (!resp.ok) return null;
        var data = await resp.json();
        if (data && typeof data.attending === "number") return data.attending;
        return null;
      } catch (e) {
        return null;
      }
    }

    function initForms() {
      var rsvpForm = $("pwc-rsvp-form");
      var rsvpMissing = $("pwc-rsvp-missing-config");

      var meetingForm = $("pwc-meeting-request-form");
      var meetingMissing = $("pwc-meeting-request-missing-config");
      var meetingFeedback = $("pwc-meeting-feedback");

      if (rsvpForm) {
        var attSel = rsvpForm.elements["attendance"];
        if (attSel) {
          attSel.addEventListener("change", function () {
            var cb = $("pwc-rsvp-wants-reminder");
            if (cb && attSel.value !== "yes") cb.checked = false;
          });
        }
        rsvpForm.addEventListener("submit", async function (e) {
          e.preventDefault();
          clearRsvpFeedback();
          if (rsvpMissing) rsvpMissing.hidden = true;

          if (!API_BASE_URL) {
            if (rsvpMissing) rsvpMissing.hidden = false;
            showRsvpFeedback("RSVP API is not configured yet.", true);
            return;
          }

          var backendIdVal = $("pwc-rsvp-event-id").value || "";
          var attendance = rsvpForm.elements["attendance"].value;

          // Prefer logged-in RSVP for backend events with a real event id.
          if (backendIdVal) {
            var me = await getCurrentUser();
            if (me) {
              try {
                var endpointBase = apiUrl("/api/events/" + backendIdVal + "/rsvp");
                var resp = null;
                if (attendance === "yes") {
                  var wantRm = false;
                  var cbRm = $("pwc-rsvp-wants-reminder");
                  if (cbRm) wantRm = !!cbRm.checked;
                  resp = await fetch(endpointBase, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ wants_email_reminder: wantRm })
                  });
                } else {
                  resp = await fetch(endpointBase, { method: "DELETE", credentials: "include" });
                }

                var data = {};
                try { data = await resp.json(); } catch (_) {}

                if (!resp.ok) {
                  showRsvpFeedback((data && data.error) ? data.error : "Failed to submit RSVP.", true);
                  return;
                }

                // Update feedback + counts.
                var thanks = "Thanks! Your RSVP was submitted.";
                showRsvpFeedback(thanks, false);
                if (backendIdVal) {
                  var count = await loadEventAttendingCount(backendIdVal);
                  var metaEl2 = $("pwc-rsvp-meta");
                  if (metaEl2 && metaEl2.dataset && metaEl2.dataset.baseMeta && typeof count === "number") {
                    metaEl2.textContent = metaEl2.dataset.baseMeta + " — " + count + " attending";
                  }
                }
                // Refresh admin panel if open.
                if (me && me.role === "admin") {
                  var adminPayload = await loadEventAttendeesAdmin(backendIdVal);
                  // openRsvpModal already renders; we only update the count+list if needed.
                  if (adminPayload && $("pwc-admin-attendees")) {
                    $("pwc-admin-attendees").hidden = false;
                    $("pwc-admin-attendees-count").textContent =
                      (adminPayload.counts && adminPayload.counts.attending_total !== undefined)
                        ? ("Total attending: " + adminPayload.counts.attending_total)
                        : "Total attending: —";
                  }
                }

                return;
              } catch (err) {
                showRsvpFeedback((err && err.message) ? err.message : "Failed to submit RSVP.", true);
                return;
              }
            }
          }

          // Public fallback for recurring/client-generated events or anonymous users.
          var me2 = await getCurrentUser();
          var autoName = me2 ? (displayNameFromUser(me2) || "Member") : "";
          var autoEmail = me2 ? (me2.email || "") : "";
          var payload = {
            event_id: $("pwc-rsvp-event-id").value || null,
            event_title: $("pwc-rsvp-event-title").value || "",
            event_datetime: $("pwc-rsvp-event-datetime").value || "",
            name: me2 ? autoName : rsvpForm.elements["name"].value,
            email: me2 ? autoEmail : rsvpForm.elements["email"].value,
            attendance: rsvpForm.elements["attendance"].value,
            notes: rsvpForm.elements["notes"].value || null,
            event_location: rsvpForm.dataset.location || null
          };

          await submitRsvp(payload);
        });
      }

      if (meetingForm) {
        meetingForm.addEventListener("submit", async function (e) {
          e.preventDefault();
          if (meetingMissing) meetingMissing.hidden = true;
          if (meetingFeedback) {
            meetingFeedback.textContent = "";
            meetingFeedback.hidden = true;
          }

          if (!API_BASE_URL) {
            if (meetingMissing) meetingMissing.hidden = false;
            if (meetingFeedback) {
              meetingFeedback.hidden = false;
              meetingFeedback.textContent = "Meeting request API is not configured yet.";
            }
            return;
          }

          var payload = {
            name: meetingForm.elements["name"].value,
            email: meetingForm.elements["email"].value,
            preferred_datetime: meetingForm.elements["preferred_datetime"].value || null,
            max_attendees: meetingForm.elements["max_attendees"] ? (meetingForm.elements["max_attendees"].value || null) : null,
            topic: meetingForm.elements["topic"].value,
            description: meetingForm.elements["description"].value
          };

          try {
            var resp = await fetch(apiUrl("/api/events/meeting-request"), {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });

            var data = {};
            try { data = await resp.json(); } catch (err) { data = {}; }

            if (!resp.ok) {
              var msg = (data && data.error) ? data.error : "Failed to submit meeting request.";
              if (meetingFeedback) {
                meetingFeedback.hidden = false;
                meetingFeedback.textContent = msg;
              }
              return;
            }

            if (meetingFeedback) {
              meetingFeedback.hidden = false;
              meetingFeedback.textContent = "Thanks! Your meeting request was submitted.";
            }
            meetingForm.reset();
          } catch (err) {
            if (meetingFeedback) {
              meetingFeedback.hidden = false;
              var msg = (err && err.message) ? err.message : String(err);
              var endpoint2 = "";
              try { endpoint2 = apiUrl("/api/events/meeting-request"); } catch (e3) { endpoint2 = ""; }
              meetingFeedback.textContent = "Network error submitting meeting request: " + msg + (endpoint2 ? (" (" + endpoint2 + ")") : "");
              try { console.error("Meeting request submit failed:", err); } catch (e) { /* no-op */ }
            }
          }
        });
      }

      var meetingModalForm = $("pwc-meeting-modal-form");
      var meetingModalMissing = $("pwc-meeting-modal-missing-config");
      var meetingModalFeedback = $("pwc-meeting-modal-feedback");
      if (meetingModalForm) {
        meetingModalForm.addEventListener("submit", async function (e) {
          e.preventDefault();

          if (meetingModalMissing) meetingModalMissing.hidden = true;
          if (meetingModalFeedback) {
            meetingModalFeedback.textContent = "";
            meetingModalFeedback.hidden = true;
          }

          if (!API_BASE_URL) {
            if (meetingModalMissing) meetingModalMissing.hidden = false;
            if (meetingModalFeedback) {
              meetingModalFeedback.hidden = false;
              meetingModalFeedback.textContent = "Meeting scheduling API is not configured yet.";
            }
            return;
          }

          var meSched = await getCurrentUser();
          var scopeVal = "club";
          var visibleGroupIds = [];
          if (meSched) {
            scopeVal = meetingModalForm.elements["visibility_scope"]
              ? (meetingModalForm.elements["visibility_scope"].value || "club")
              : "club";
            visibleGroupIds = getCheckedGroupIds();
            if (scopeVal === "groups" && !visibleGroupIds.length) {
              if (meetingModalFeedback) {
                meetingModalFeedback.hidden = false;
                meetingModalFeedback.textContent = "Select at least one group for group-only visibility.";
              }
              return;
            }
          }
          var payload = {
            name: meSched ? (displayNameFromUser(meSched) || "Member") : meetingModalForm.elements["name"].value,
            email: meSched ? (meSched.email || "") : meetingModalForm.elements["email"].value,
            preferred_datetime: meetingModalForm.elements["preferred_datetime"].value || null,
            preferred_end_datetime: meetingModalForm.elements["preferred_end_datetime"].value || null,
            max_attendees: meetingModalForm.elements["max_attendees"] ? (meetingModalForm.elements["max_attendees"].value || null) : null,
            visibility_scope: scopeVal,
            visible_group_ids: visibleGroupIds,
            topic: meetingModalForm.elements["topic"].value,
            description: meetingModalForm.elements["description"].value
          };

          try {
            var resp = await fetch(apiUrl("/api/events/meeting-request"), {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });

            var data = {};
            try { data = await resp.json(); } catch (err) { data = {}; }

            if (!resp.ok) {
              var msg = (data && data.error) ? data.error : "Failed to submit meeting request.";
              if (meetingModalFeedback) {
                meetingModalFeedback.hidden = false;
                meetingModalFeedback.textContent = msg;
              }
              return;
            }

            if (meetingModalFeedback) {
              meetingModalFeedback.hidden = false;
              meetingModalFeedback.textContent = "Thanks! Your meeting request was submitted.";
            }
            meetingModalForm.reset();
            closeMeetingModal();

            // Make the newly created event visible immediately.
            if (calendarInstance && calendarInstance.refetchEvents) {
              calendarInstance.refetchEvents();
            }
          } catch (err) {
            if (meetingModalFeedback) {
              meetingModalFeedback.hidden = false;
              var msg = (err && err.message) ? err.message : String(err);
              var endpoint = "";
              try { endpoint = apiUrl("/api/events/meeting-request"); } catch (e2) { endpoint = ""; }
              meetingModalFeedback.textContent = "Network error submitting meeting request: " + msg + (endpoint ? (" (" + endpoint + ")") : "");
              try { console.error("Meeting request submit failed:", err); } catch (e) { /* no-op */ }
            }
          }
        });
      }
    }

    function initModal() {
      var closeBtn = $("pwc-rsvp-close");
      var backdrop = $("pwc-rsvp-backdrop");
      if (closeBtn) closeBtn.addEventListener("click", closeRsvpModal);
      if (backdrop) backdrop.addEventListener("click", closeRsvpModal);

      var meetingCloseBtn = $("pwc-meeting-modal-close");
      var meetingBackdrop = $("pwc-meeting-modal-backdrop");
      if (meetingCloseBtn) meetingCloseBtn.addEventListener("click", closeMeetingModal);
      if (meetingBackdrop) meetingBackdrop.addEventListener("click", closeMeetingModal);

      document.addEventListener("keydown", function (e) {
        if (e.key !== "Escape") return;
        // Close the top-most modal first (meeting modal).
        var meetingModal = $("pwc-meeting-modal");
        if (meetingModal && !meetingModal.hidden) {
          closeMeetingModal();
          return;
        }
        closeRsvpModal();
      });
    }

    function initCalendar() {
      var el = $("pwc-events-calendar");
      if (!el || !window.FullCalendar) return;

      var calendar = new FullCalendar.Calendar(el, {
        initialView: "dayGridMonth",
        height: "auto",
        contentHeight: "auto",
        expandRows: true,
        fixedWeekCount: false,
        /* Allow more rows + wrapped titles (see pwc.css); avoids single-line truncation */
        dayMaxEventRows: 5,
        eventDisplay: "block",
        headerToolbar: { left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek" },
        selectable: false,
        editable: false,
        eventTimeFormat: { hour: "numeric", minute: "2-digit" },
        dateClick: function (info) {
          openMeetingModal(info.date);
        },
        eventClick: function (info) {
          info.jsEvent.preventDefault();
          openRsvpModal(info.event);
        },
        events: function (info, successCallback, failureCallback) {
          var base = buildRegularMeetings();
          loadBackendEvents()
            .then(function (apiEvents) {
              var filtered = apiEvents;
              if (selectedGroupFilter) {
                filtered = apiEvents.filter(function (ev) {
                  if (!ev.extendedProps) return false;
                  var scope = ev.extendedProps.visibilityScope || "club";
                  // Group filter view should show group-scoped events for that group only.
                  if (scope !== "groups") return false;
                  if (String(ev.extendedProps.groupId || "") === selectedGroupFilter) return true;
                  var visible = ev.extendedProps.visibleGroupIds || [];
                  return visible.map(function (x) { return String(x); }).indexOf(String(selectedGroupFilter)) !== -1;
                });
              } else {
                // "All Events" should only show events visible to the entire club.
                filtered = apiEvents.filter(function (ev) {
                  if (!ev.extendedProps) return true;
                  return (ev.extendedProps.visibilityScope || "club") !== "groups";
                });
              }
              successCallback(base.concat(filtered));
            })
            .catch(function () {
              successCallback(base);
            });
        }
      });

      calendar.render();
      calendarInstance = calendar;
    }

    function initGroupFilter() {
      getCurrentUser().then(function (me) {
        if (!me || !API_BASE_URL) return;

        // Load user's groups to populate the filter dropdown
        fetch(apiUrl("/api/groups/my"), { credentials: "include" })
          .then(function (r) { return r.ok ? r.json() : []; })
          .then(function (groups) {
            myGroupIds = groups.map(function (g) { return g.id; });

            if (groups.length === 0) return;

            var filterBar = $("pwc-events-group-filter");
            var sel = $("pwc-events-group-select");
            if (!filterBar || !sel) return;

            filterBar.style.display = "flex";
            groups.forEach(function (g) {
              var opt = document.createElement("option");
              opt.value = String(g.id);
              opt.textContent = g.name;
              sel.appendChild(opt);
            });

            sel.addEventListener("change", function () {
              selectedGroupFilter = sel.value;
              if (calendarInstance && calendarInstance.refetchEvents) {
                calendarInstance.refetchEvents();
              }
            });
          })
          .catch(function () {});
      });
    }

    function init() {
      initForms();
      initModal();
      initGroupFilter();
      initCalendar();
    }

    window.addEventListener("load", init);
  })();
</script>
</div>