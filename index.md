---
layout: default
title: Poway Woman's Club
hide: true
show_reading_time: false
---

<!-- Daily rotating banner -->
<div class="pwc-banner">
  <span class="pwc-banner-label" id="bannerLabel"></span>
  <div class="pwc-banner-divider"></div>
  <span class="pwc-banner-text" id="bannerText"></span>
  <span class="pwc-banner-attr" id="bannerAttr"></span>
</div>

<div class="pwc-hero">
  <h1>Poway Woman's Club</h1>
  <p>A nonprofit service organization in Poway, California. Since 1960, our members have supported local scholarships, the arts, civic programs, and youth leadership.</p>
  <div class="pwc-hero-links">
    <a href="{{ site.baseurl }}/navigation/about" class="pwc-btn pwc-btn-fill">About Us</a>
    <a href="{{ site.baseurl }}/navigation/events" class="pwc-btn pwc-btn-border">Events</a>
    <a href="{{ site.baseurl }}/navigation/profile" class="pwc-btn pwc-btn-profile">My Profile</a>
  </div>
</div>

<div class="pwc-section">
  <h2>At a Glance</h2>
  <hr class="pwc-rule">
  <div class="pwc-facts">
    <div class="pwc-fact">
      <strong>1960</strong>
      <span>Founded</span>
    </div>
    <div class="pwc-fact">
      <strong>501(c)(3)</strong>
      <span>Nonprofit</span>
    </div>
    <div class="pwc-fact">
      <strong>GFWC</strong>
      <span>International Affiliate</span>
    </div>
    <div class="pwc-fact">
      <strong>2nd Tue</strong>
      <span>Monthly, Sept–June</span>
    </div>
  </div>
</div>

<div class="pwc-section">
  <h2>What We Do</h2>
  <hr class="pwc-rule">
  <p>We support local organizations, award scholarships to students at four Poway-area high schools, sponsor art exhibits, and encourage youth leadership through volunteer work and community partnerships.</p>
  <div class="pwc-cards">
    <div class="pwc-card">
      <h3>Scholarships</h3>
      <p>Hugh O'Brian Youth Leadership awards for Poway, Mt. Carmel, Rancho Bernardo, and Westview High School students. Continuing education scholarships through Abraxas.</p>
    </div>
    <div class="pwc-card">
      <h3>Arts and Culture</h3>
      <p>"Celebrate Women" Art Exhibit, Student Art Exhibit, and Theatre in the Park — community events we sponsor throughout the year.</p>
    </div>
    <div class="pwc-card">
      <h3>Library and Civic Support</h3>
      <p>We adopted the Poway Community Library and support its staff and programs. We're also active with the Friends of the Poway Library.</p>
    </div>
    <div class="pwc-card">
      <h3>Community Partners</h3>
      <p>Members of Old Poway Park Action Committee, PowPAC community theatre, Poway Historical Society, and the Weingart Senior Center.</p>
    </div>
  </div>
</div>

<div id="garden-app">

  <div class="garden-header">
    <h2>Community Garden</h2>
    <p class="garden-subtitle">Grow flowers, discover club history</p>
  </div>

  <div class="garden-layout">

    <!-- Left: clicker + actions -->
    <div class="garden-sidebar">
      <div class="garden-stats">
        <div class="garden-stat">
          <span class="garden-stat-val" id="seedCount">0</span>
          <span class="garden-stat-lbl">Seeds</span>
        </div>
        <div class="garden-stat">
          <span class="garden-stat-val" id="flowerCount">0</span>
          <span class="garden-stat-lbl">Blooms</span>
        </div>
        <div class="garden-stat">
          <span class="garden-stat-val"><span id="factCount">0</span>/<span id="factTotal">0</span></span>
          <span class="garden-stat-lbl">Facts</span>
        </div>
      </div>

      <div class="garden-clicker-area">
        <button class="garden-clicker" id="clickerBtn" aria-label="Gather seeds">
          <svg class="garden-clicker-flower" viewBox="0 0 80 80" width="64" height="64">
            <g transform="translate(40,36)">
              <ellipse cx="0" cy="-18" rx="9" ry="14" fill="var(--pwc-warm)" opacity="0.85" transform="rotate(0)"/>
              <ellipse cx="0" cy="-18" rx="9" ry="14" fill="var(--pwc-warm)" opacity="0.75" transform="rotate(60)"/>
              <ellipse cx="0" cy="-18" rx="9" ry="14" fill="var(--pwc-warm)" opacity="0.85" transform="rotate(120)"/>
              <ellipse cx="0" cy="-18" rx="9" ry="14" fill="var(--pwc-warm)" opacity="0.75" transform="rotate(180)"/>
              <ellipse cx="0" cy="-18" rx="9" ry="14" fill="var(--pwc-warm)" opacity="0.85" transform="rotate(240)"/>
              <ellipse cx="0" cy="-18" rx="9" ry="14" fill="var(--pwc-warm)" opacity="0.75" transform="rotate(300)"/>
              <circle cx="0" cy="0" r="10" fill="var(--pwc-sage)"/>
            </g>
            <rect x="38" y="52" width="4" height="18" rx="2" fill="var(--pwc-sage-dark)"/>
          </svg>
        </button>
        <span class="garden-clicker-hint">Click to gather seeds</span>
        <div class="garden-ripples" id="rippleContainer"></div>
      </div>

      <div class="garden-controls">
        <button class="garden-ctrl" id="plantBtn" disabled>Plant<span class="garden-ctrl-cost">5 seeds</span></button>
        <button class="garden-ctrl" id="waterBtn" disabled>Water all</button>
        <button class="garden-ctrl" id="harvestBtn" disabled>Harvest</button>
      </div>
    </div>

    <!-- Right: garden grid -->
    <div class="garden-main">
      <div class="garden-plot" id="gardenPlot">
        <div class="garden-empty-msg" id="gardenEmpty">Plant your first seed to get started.</div>
      </div>
    </div>

  </div>

  <!-- Fact toast -->
  <div id="factToast" class="garden-toast" hidden>
    <span id="factToastText"></span>
  </div>

  <!-- Facts grid -->
  <div class="garden-facts">
    <h2>Club History</h2>
    <div class="garden-facts-grid" id="factsGrid"></div>
  </div>

</div>

<div class="pwc-cta">
  <h2>Interested in Joining?</h2>
  <p>Come to a meeting — visitors are always welcome. No RSVP needed.</p>
  <a href="{{ site.baseurl }}/navigation/contact" class="pwc-btn pwc-btn-white">Contact Us</a>
</div>

<style>
#garden-app {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
  font-family: 'Nunito Sans', sans-serif;
  color: var(--pwc-text);
}

.garden-header {
  text-align: center;
  margin-bottom: 2rem;
}
.garden-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--pwc-charcoal);
  margin: 0 0 0.25rem;
}
.garden-subtitle {
  color: var(--pwc-muted);
  font-size: 0.95rem;
  margin: 0;
}

.garden-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 2rem;
  align-items: start;
  margin-bottom: 2.5rem;
}
@media (max-width: 680px) {
  .garden-layout { grid-template-columns: 1fr; }
}

.garden-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.garden-stats {
  display: flex;
  justify-content: space-between;
  background: var(--pwc-white);
  border: 1px solid var(--pwc-border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
}
.garden-stat { text-align: center; }
.garden-stat-val {
  display: block;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--pwc-charcoal);
  line-height: 1.2;
}
.garden-stat-lbl {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--pwc-muted);
}

.garden-clicker-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.garden-clicker {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 3px solid var(--pwc-border);
  background: var(--pwc-white);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s, border-color 0.2s;
  box-shadow: var(--pwc-shadow-md);
}
.garden-clicker:hover { border-color: var(--pwc-sage); }
.garden-clicker:active { transform: scale(0.93); }
.garden-clicker:active .garden-clicker-flower { transform: rotate(-8deg); }
.garden-clicker-flower { transition: transform 0.12s; }
.garden-clicker-hint {
  margin-top: 0.4rem;
  font-size: 0.78rem;
  color: var(--pwc-muted);
}
.garden-ripples {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.garden-seed-pop {
  position: absolute;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--pwc-sage-dark);
  pointer-events: none;
  animation: seed-pop 0.7s ease-out forwards;
}
@keyframes seed-pop {
  0%   { opacity: 1; transform: translate(0,0); }
  100% { opacity: 0; transform: translate(var(--dx), var(--dy)); }
}

.garden-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.garden-ctrl {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 0.9rem;
  border: 1px solid var(--pwc-border);
  border-radius: 6px;
  background: var(--pwc-white);
  font-size: 0.88rem;
  font-weight: 600;
  font-family: inherit;
  color: var(--pwc-text);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.garden-ctrl:hover:not(:disabled) {
  background: var(--pwc-sage-light);
  border-color: var(--pwc-sage);
}
.garden-ctrl:active:not(:disabled) { transform: scale(0.98); }
.garden-ctrl:disabled { opacity: 0.4; cursor: default; }
.garden-ctrl-cost {
  font-weight: 400;
  font-size: 0.78rem;
  color: var(--pwc-muted);
}

.garden-main {
  min-height: 200px;
}
.garden-plot {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
  gap: 8px;
}
.garden-empty-msg {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem 1rem;
  color: var(--pwc-muted);
  font-size: 0.9rem;
}
.garden-cell {
  aspect-ratio: 1;
  background: var(--pwc-white);
  border: 1px solid var(--pwc-border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s, background 0.2s;
  position: relative;
}
.garden-cell:hover {
  transform: scale(1.06);
  border-color: var(--pwc-sage);
}
.garden-cell.bloomed {
  background: var(--pwc-rose-light);
  border-color: var(--pwc-rose);
}
.garden-cell svg { width: 44px; height: 44px; }
.garden-stage-up {
  position: absolute;
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--pwc-sage-dark);
  top: 2px; right: 5px;
  animation: float-up 0.6s ease-out forwards;
  pointer-events: none;
}
@keyframes float-up {
  0%   { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-14px); }
}

.garden-toast {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%) translateY(-16px);
  background: var(--pwc-sage-dark);
  color: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 0.88rem;
  font-weight: 600;
  box-shadow: var(--pwc-shadow-lg);
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.25s, transform 0.25s;
  max-width: 600px;
  text-align: center;
}
.garden-toast.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.garden-facts h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--pwc-charcoal);
  margin: 0 0 1rem;
}
.garden-facts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 0.75rem;
}
.garden-fact-card {
  background: var(--pwc-white);
  border: 1px solid var(--pwc-border);
  border-left: 3px solid var(--pwc-sage);
  border-radius: 6px;
  padding: 0.7rem 0.85rem;
  font-size: 0.84rem;
  color: var(--pwc-text);
  line-height: 1.5;
}
.garden-fact-card.locked {
  opacity: 0.35;
  border-left-color: var(--pwc-border);
}
.garden-fact-card.locked .fact-text {
  filter: blur(3px);
}
.fact-milestone {
  display: block;
  font-size: 0.72rem;
  color: var(--pwc-muted);
  margin-top: 0.25rem;
}
</style>

<script>
(function () {
  "use strict";

  var FACTS = [
    "The Poway Woman's Club was founded in 1960 by a group of community-minded women.",
    "Each year the club awards HOBY Youth Leadership scholarships to local students.",
    "The annual Celebrate Women art exhibit showcases women artists from the Poway area.",
    "The Old-Fashioned Friendship Tea is one of the club's most beloved annual traditions.",
    "Theatre in the Park brings free community performances to Old Poway Park.",
    "Meetings are held at the historic Templars Hall in Old Poway Park.",
    "The club is part of the General Federation of Women's Clubs, the largest women's volunteer organization in the world.",
    "Club committees include Arts, Education, Civic Engagement, and Social Events.",
    "Members volunteer for Poway beautification, park cleanups, and community gardens.",
    "The club's colors are sage green and dusty rose.",
    "Civic engagement is a core pillar. The club hosts voter registration drives and candidate forums.",
    "The club sponsors student musicians for community concerts and recitals.",
    "Craft circles meet monthly to create handmade items for local charities.",
    "The Student Art Exhibit features work from all Poway-area high schools.",
    "You grew a full garden. The Poway Woman's Club: serving the community since 1960.",
  ];

  var MILESTONES = [1, 3, 5, 8, 12, 16, 20, 25, 30, 36, 42, 50, 60, 72, 85];

  function plantSVG(stage, bloomed) {
    if (bloomed) {
      return '<svg viewBox="0 0 44 44"><rect x="20.5" y="24" width="3" height="16" rx="1.5" fill="var(--pwc-sage-dark)"/>'
        + '<g transform="translate(22,18)">'
        + '<ellipse cx="0" cy="-8" rx="4.5" ry="7" fill="var(--pwc-rose)" transform="rotate(0)"/>'
        + '<ellipse cx="0" cy="-8" rx="4.5" ry="7" fill="var(--pwc-rose)" opacity="0.8" transform="rotate(72)"/>'
        + '<ellipse cx="0" cy="-8" rx="4.5" ry="7" fill="var(--pwc-rose)" transform="rotate(144)"/>'
        + '<ellipse cx="0" cy="-8" rx="4.5" ry="7" fill="var(--pwc-rose)" opacity="0.8" transform="rotate(216)"/>'
        + '<ellipse cx="0" cy="-8" rx="4.5" ry="7" fill="var(--pwc-rose)" transform="rotate(288)"/>'
        + '<circle cx="0" cy="0" r="5" fill="var(--pwc-warm)"/>'
        + '</g></svg>';
    }
    if (stage === 1) {
      return '<svg viewBox="0 0 44 44"><circle cx="22" cy="30" r="4" fill="var(--pwc-sage)"/></svg>';
    }
    if (stage === 2) {
      return '<svg viewBox="0 0 44 44"><rect x="20.5" y="26" width="3" height="12" rx="1.5" fill="var(--pwc-sage)"/>'
        + '<ellipse cx="22" cy="24" rx="5" ry="3.5" fill="var(--pwc-sage-light)" stroke="var(--pwc-sage)" stroke-width="0.8"/></svg>';
    }
    if (stage === 3) {
      return '<svg viewBox="0 0 44 44"><rect x="20.5" y="22" width="3" height="16" rx="1.5" fill="var(--pwc-sage-dark)"/>'
        + '<ellipse cx="16" cy="28" rx="5" ry="3" fill="var(--pwc-sage)" transform="rotate(-20 16 28)"/>'
        + '<ellipse cx="28" cy="26" rx="5" ry="3" fill="var(--pwc-sage)" transform="rotate(20 28 26)"/>'
        + '<ellipse cx="22" cy="20" rx="4" ry="3" fill="var(--pwc-sage-light)" stroke="var(--pwc-sage)" stroke-width="0.8"/></svg>';
    }
    if (stage === 4) {
      return '<svg viewBox="0 0 44 44"><rect x="20.5" y="24" width="3" height="16" rx="1.5" fill="var(--pwc-sage-dark)"/>'
        + '<ellipse cx="16" cy="30" rx="5" ry="3" fill="var(--pwc-sage)" transform="rotate(-20 16 30)"/>'
        + '<ellipse cx="28" cy="28" rx="5" ry="3" fill="var(--pwc-sage)" transform="rotate(20 28 28)"/>'
        + '<ellipse cx="22" cy="20" rx="6" ry="8" fill="var(--pwc-rose-light)" stroke="var(--pwc-rose)" stroke-width="0.8"/></svg>';
    }
    return '';
  }

  var MAX_STAGE = 5;
  var seeds = 0, totalBlooms = 0, unlockedFacts = [], plots = [], maxPlots = 30;

  var seedEl = document.getElementById("seedCount");
  var flowerEl = document.getElementById("flowerCount");
  var factCountEl = document.getElementById("factCount");
  var factTotalEl = document.getElementById("factTotal");
  var plotEl = document.getElementById("gardenPlot");
  var emptyMsg = document.getElementById("gardenEmpty");
  var factsGrid = document.getElementById("factsGrid");
  var toast = document.getElementById("factToast");
  var toastText = document.getElementById("factToastText");
  var clickerBtn = document.getElementById("clickerBtn");
  var plantBtn = document.getElementById("plantBtn");
  var waterBtn = document.getElementById("waterBtn");
  var harvestBtn = document.getElementById("harvestBtn");
  var rippleCont = document.getElementById("rippleContainer");

  factTotalEl.textContent = FACTS.length;

  var SAVE_KEY = "pwc_garden";
  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ s: seeds, b: totalBlooms, f: unlockedFacts, p: plots })); } catch (_) {}
  }
  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (!d) return;
      seeds = d.s || 0; totalBlooms = d.b || 0; unlockedFacts = d.f || []; plots = d.p || [];
    } catch (_) {}
  }

  function updateHUD() {
    seedEl.textContent = seeds;
    flowerEl.textContent = totalBlooms;
    factCountEl.textContent = unlockedFacts.length;
    plantBtn.disabled = seeds < 5 || plots.length >= maxPlots;
    waterBtn.disabled = plots.length === 0;
    harvestBtn.disabled = !plots.some(function (p) { return p.stage >= MAX_STAGE; });
  }

  function renderPlots() {
    var cells = plotEl.querySelectorAll(".garden-cell");
    for (var c = 0; c < cells.length; c++) cells[c].remove();
    emptyMsg.style.display = plots.length ? "none" : "";

    plots.forEach(function (p, i) {
      var cell = document.createElement("div");
      var bloomed = p.stage >= MAX_STAGE;
      cell.className = "garden-cell" + (bloomed ? " bloomed" : "");
      cell.innerHTML = plantSVG(p.stage, bloomed);
      cell.addEventListener("click", function () { waterOne(i); });
      plotEl.appendChild(cell);
    });
  }

  function renderFacts() {
    factsGrid.innerHTML = "";
    FACTS.forEach(function (text, i) {
      var card = document.createElement("div");
      var unlocked = unlockedFacts.indexOf(i) !== -1;
      card.className = "garden-fact-card" + (unlocked ? "" : " locked");
      var inner = '<span class="fact-text">' + (unlocked ? text : text) + '</span>';
      if (!unlocked) inner += '<span class="fact-milestone">Bloom ' + MILESTONES[i] + ' flowers to unlock</span>';
      card.innerHTML = inner;
      factsGrid.appendChild(card);
    });
  }

  function showToast(text) {
    toastText.textContent = text;
    toast.hidden = false;
    toast.offsetWidth;
    toast.classList.add("visible");
    setTimeout(function () {
      toast.classList.remove("visible");
      setTimeout(function () { toast.hidden = true; }, 300);
    }, 3000);
  }

  function checkMilestones() {
    for (var i = 0; i < MILESTONES.length && i < FACTS.length; i++) {
      if (totalBlooms >= MILESTONES[i] && unlockedFacts.indexOf(i) === -1) {
        unlockedFacts.push(i);
        showToast("New fact unlocked: " + FACTS[i]);
        renderFacts();
      }
    }
  }

  clickerBtn.addEventListener("click", function () {
    var gain = 1 + Math.floor(totalBlooms / 10);
    seeds += gain;

    var pop = document.createElement("span");
    pop.className = "garden-seed-pop";
    pop.textContent = "+" + gain;
    var angle = Math.random() * Math.PI * 2;
    var dist = 25 + Math.random() * 25;
    pop.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    pop.style.setProperty("--dy", Math.sin(angle) * dist - 15 + "px");
    pop.style.left = "50%";
    pop.style.top = "40%";
    rippleCont.appendChild(pop);
    setTimeout(function () { pop.remove(); }, 750);

    updateHUD();
    save();
  });

  plantBtn.addEventListener("click", function () {
    if (seeds < 5 || plots.length >= maxPlots) return;
    seeds -= 5;
    plots.push({ stage: 1 });
    renderPlots();
    updateHUD();
    save();
  });

  waterBtn.addEventListener("click", function () {
    var grew = false;
    plots.forEach(function (p) {
      if (p.stage > 0 && p.stage < MAX_STAGE) {
        p.stage++;
        grew = true;
        if (p.stage >= MAX_STAGE) { totalBlooms++; checkMilestones(); }
      }
    });
    if (grew) { renderPlots(); updateHUD(); save(); }
  });

  function waterOne(idx) {
    var p = plots[idx];
    if (!p || p.stage <= 0 || p.stage >= MAX_STAGE) return;
    p.stage++;
    if (p.stage >= MAX_STAGE) { totalBlooms++; checkMilestones(); }
    renderPlots();
    updateHUD();
    save();
  }

  harvestBtn.addEventListener("click", function () {
    var n = 0;
    plots = plots.filter(function (p) { if (p.stage >= MAX_STAGE) { n++; return false; } return true; });
    seeds += n * 3;
    renderPlots();
    updateHUD();
    save();
  });

  load();
  renderPlots();
  renderFacts();
  updateHUD();
})();
</script>

<script>
(function () {
  var ITEMS = [
    { type: 'quote', text: 'Well-behaved women seldom make history.', attr: 'Laurel Thatcher Ulrich' },
    { type: 'quote', text: 'I am no longer accepting the things I cannot change. I am changing the things I cannot accept.', attr: 'Angela Davis' },
    { type: 'quote', text: 'The most courageous act is still to think for yourself. Aloud.', attr: 'Coco Chanel' },
    { type: 'quote', text: 'You may encounter many defeats, but you must not be defeated.', attr: 'Maya Angelou' },
    { type: 'quote', text: 'There is no limit to what we, as women, can accomplish.', attr: 'Michelle Obama' },
    { type: 'quote', text: 'Alone we can do so little; together we can do so much.', attr: 'Helen Keller' },
    { type: 'quote', text: 'No one can make you feel inferior without your consent.', attr: 'Eleanor Roosevelt' },
    { type: 'quote', text: 'I raise up my voice — not so that I can shout, but so that those without a voice can be heard.', attr: 'Malala Yousafzai' },
    { type: 'quote', text: 'Think like a queen. A queen is not afraid to fail.', attr: 'Oprah Winfrey' },
    { type: 'quote', text: 'I never dreamed about success. I worked for it.', attr: 'Estée Lauder' },
    { type: 'fact', text: 'The General Federation of Women\'s Clubs, founded in 1890, is one of the oldest nonpartisan women\'s service organizations in the world.', attr: null },
    { type: 'fact', text: 'Women\'s clubs in the early 1900s helped establish public libraries, parks, and schools across the United States.', attr: null },
    { type: 'fact', text: 'Poway\'s name is believed to derive from a Native American word meaning "meeting of the valleys."', attr: null },
    { type: 'fact', text: 'The GFWC has more than 100,000 members in clubs across the United States and worldwide.', attr: null },
    { type: 'fact', text: 'The Hugh O\'Brian Youth Leadership program has inspired young leaders in over 100 countries since 1958.', attr: null },
    { type: 'tip',  text: 'The Poway Community Library offers free museum passes for cardholders — explore San Diego County culture at no cost.', attr: null },
    { type: 'tip',  text: 'Old Poway Park hosts a Farmers Market every Saturday morning with fresh local produce and crafts.', attr: null },
    { type: 'tip',  text: 'The Poway Center for the Performing Arts hosts free community events throughout the year.', attr: null },
  ];

  var LABELS = { quote: 'Quote of the Day', fact: 'Fun Fact', tip: 'Community Tip' };

  var day  = Math.floor(Date.now() / 86400000);
  var item = ITEMS[day % ITEMS.length];

  document.getElementById('bannerLabel').textContent = LABELS[item.type];
  document.getElementById('bannerText').textContent  = item.text;
  document.getElementById('bannerAttr').textContent  = item.attr ? '\u2014 ' + item.attr : '';
})();
</script>