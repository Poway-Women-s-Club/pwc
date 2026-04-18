---
layout: default
title: About
permalink: /navigation/about/
---

<div class="pwc-section" style="max-width:820px; margin:0 auto; padding:2rem 1.5rem 1rem;">

<h2>About the Poway Woman's Club</h2>

The Poway Woman's Club is a 501(c)(3) nonprofit, nondenominational service organization founded in February 1960. We are affiliated with the California Federation of Women's Clubs and the General Federation of Women's Clubs International — the oldest women's service organization in the world, established in 1890.

<h3>Our Mission</h3>

We are women looking for friendship, fellowship, an outlet for creative talents, and a chance to make a difference in our community. Through volunteer work, fundraising, and partnerships with local organizations, we support causes in arts and culture, civic engagement, the environment, libraries, and youth advocacy.

<h3>What We Support</h3>

<ul>
  <li><strong>Poway Community Library</strong> — adopted library with ongoing staff and program support</li>
  <li><strong>Hugh O'Brian Youth Leadership</strong> — scholarships for sophomores at Poway HS, Mt. Carmel HS, Rancho Bernardo HS, and Westview HS</li>
  <li><strong>Continuing Education Scholarships</strong> — awards for Abraxas graduates</li>
  <li><strong>"Celebrate Women" Art Exhibit</strong> — annual showcase of women artists</li>
  <li><strong>Student Art Exhibit</strong> — highlighting young local talent</li>
  <li><strong>Theatre in the Park</strong> — community performances at Old Poway Park</li>
</ul>

<h3>Community Partnerships</h3>

We are proud members of the Friends of the Poway Library, Poway Historical and Memorial Society, Old Poway Park Action Committee (OPPAC), PowPAC Community Theatre, Poway Center for the Performing Arts Foundation, and the Weingart Senior Center.

<h3>Meeting Info</h3>

<strong>General Meetings:</strong> 2nd Tuesday of every month, September through June<br>
<strong>Time:</strong> 10:00 AM<br>
<strong>Location:</strong> Templars Hall, Old Poway Park<br>
<strong>Mail:</strong> P.O. Box 1356, Poway, CA 92074-1356

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

<style>
#garden-app {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
  font-family: 'Nunito Sans', sans-serif;
  color: var(--pwc-text);
}
.garden-header { text-align: center; margin-bottom: 2rem; }
.garden-header h2 { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 700; color: var(--pwc-charcoal); margin: 0 0 0.25rem; }
.garden-subtitle { color: var(--pwc-muted); font-size: 0.95rem; margin: 0; }
.garden-layout { display: grid; grid-template-columns: 240px 1fr; gap: 2rem; align-items: start; margin-bottom: 2.5rem; }
@media (max-width: 680px) { .garden-layout { grid-template-columns: 1fr; } }
.garden-sidebar { display: flex; flex-direction: column; gap: 1.25rem; }
.garden-stats { display: flex; justify-content: space-between; background: var(--pwc-white); border: 1px solid var(--pwc-border); border-radius: 8px; padding: 0.75rem 1rem; }
.garden-stat { text-align: center; }
.garden-stat-val { display: block; font-size: 1.3rem; font-weight: 700; color: var(--pwc-charcoal); line-height: 1.2; }
.garden-stat-lbl { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--pwc-muted); }
.garden-clicker-area { display: flex; flex-direction: column; align-items: center; position: relative; }
.garden-clicker { width: 110px; height: 110px; border-radius: 50%; border: 3px solid var(--pwc-border); background: var(--pwc-white); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.1s, border-color 0.2s; box-shadow: var(--pwc-shadow-md); }
.garden-clicker:hover { border-color: var(--pwc-sage); }
.garden-clicker:active { transform: scale(0.93); }
.garden-clicker:active .garden-clicker-flower { transform: rotate(-8deg); }
.garden-clicker-flower { transition: transform 0.12s; }
.garden-clicker-hint { margin-top: 0.4rem; font-size: 0.78rem; color: var(--pwc-muted); }
.garden-ripples { position: absolute; inset: 0; pointer-events: none; }
.garden-seed-pop { position: absolute; font-size: 0.9rem; font-weight: 700; color: var(--pwc-sage-dark); pointer-events: none; animation: seed-pop 0.7s ease-out forwards; }
@keyframes seed-pop { 0% { opacity: 1; transform: translate(0,0); } 100% { opacity: 0; transform: translate(var(--dx), var(--dy)); } }
.garden-controls { display: flex; flex-direction: column; gap: 0.5rem; }
.garden-ctrl { display: flex; align-items: center; justify-content: space-between; padding: 0.55rem 0.9rem; border: 1px solid var(--pwc-border); border-radius: 6px; background: var(--pwc-white); font-size: 0.88rem; font-weight: 600; font-family: inherit; color: var(--pwc-text); cursor: pointer; transition: background 0.15s, border-color 0.15s; }
.garden-ctrl:hover:not(:disabled) { background: var(--pwc-sage-light); border-color: var(--pwc-sage); }
.garden-ctrl:active:not(:disabled) { transform: scale(0.98); }
.garden-ctrl:disabled { opacity: 0.4; cursor: default; }
.garden-ctrl-cost { font-weight: 400; font-size: 0.78rem; color: var(--pwc-muted); }
.garden-main { min-height: 200px; }
.garden-plot { display: grid; grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); gap: 8px; }
.garden-empty-msg { grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--pwc-muted); font-size: 0.9rem; }
.garden-cell { aspect-ratio: 1; background: var(--pwc-white); border: 1px solid var(--pwc-border); border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.15s, border-color 0.15s, background 0.2s; position: relative; }
.garden-cell:hover { transform: scale(1.06); border-color: var(--pwc-sage); }
.garden-cell.bloomed { background: var(--pwc-rose-light); border-color: var(--pwc-rose); }
.garden-cell svg { width: 44px; height: 44px; }
.garden-stage-up { position: absolute; font-size: 0.65rem; font-weight: 700; color: var(--pwc-sage-dark); top: 2px; right: 5px; animation: float-up 0.6s ease-out forwards; pointer-events: none; }
@keyframes float-up { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-14px); } }
.garden-toast { position: fixed; top: 1rem; left: 50%; transform: translateX(-50%) translateY(-16px); background: var(--pwc-sage-dark); color: #fff; padding: 0.6rem 1.2rem; border-radius: 6px; font-size: 0.88rem; font-weight: 600; box-shadow: var(--pwc-shadow-lg); z-index: 9999; opacity: 0; transition: opacity 0.25s, transform 0.25s; max-width: 600px; text-align: center; }
.garden-toast.visible { opacity: 1; transform: translateX(-50%) translateY(0); }
.garden-facts h2 { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; color: var(--pwc-charcoal); margin: 0 0 1rem; }
.garden-facts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 0.75rem; }
.garden-fact-card { background: var(--pwc-white); border: 1px solid var(--pwc-border); border-left: 3px solid var(--pwc-sage); border-radius: 6px; padding: 0.7rem 0.85rem; font-size: 0.84rem; color: var(--pwc-text); line-height: 1.5; }
.garden-fact-card.locked { opacity: 0.35; border-left-color: var(--pwc-border); }
.garden-fact-card.locked .fact-text { filter: blur(3px); }
.fact-milestone { display: block; font-size: 0.72rem; color: var(--pwc-muted); margin-top: 0.25rem; }
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
    if (bloomed) return '<svg viewBox="0 0 44 44"><rect x="20.5" y="24" width="3" height="16" rx="1.5" fill="var(--pwc-sage-dark)"/><g transform="translate(22,18)"><ellipse cx="0" cy="-8" rx="4.5" ry="7" fill="var(--pwc-rose)" transform="rotate(0)"/><ellipse cx="0" cy="-8" rx="4.5" ry="7" fill="var(--pwc-rose)" opacity="0.8" transform="rotate(72)"/><ellipse cx="0" cy="-8" rx="4.5" ry="7" fill="var(--pwc-rose)" transform="rotate(144)"/><ellipse cx="0" cy="-8" rx="4.5" ry="7" fill="var(--pwc-rose)" opacity="0.8" transform="rotate(216)"/><ellipse cx="0" cy="-8" rx="4.5" ry="7" fill="var(--pwc-rose)" transform="rotate(288)"/><circle cx="0" cy="0" r="5" fill="var(--pwc-warm)"/></g></svg>';
    if (stage === 1) return '<svg viewBox="0 0 44 44"><circle cx="22" cy="30" r="4" fill="var(--pwc-sage)"/></svg>';
    if (stage === 2) return '<svg viewBox="0 0 44 44"><rect x="20.5" y="26" width="3" height="12" rx="1.5" fill="var(--pwc-sage)"/><ellipse cx="22" cy="24" rx="5" ry="3.5" fill="var(--pwc-sage-light)" stroke="var(--pwc-sage)" stroke-width="0.8"/></svg>';
    if (stage === 3) return '<svg viewBox="0 0 44 44"><rect x="20.5" y="22" width="3" height="16" rx="1.5" fill="var(--pwc-sage-dark)"/><ellipse cx="16" cy="28" rx="5" ry="3" fill="var(--pwc-sage)" transform="rotate(-20 16 28)"/><ellipse cx="28" cy="26" rx="5" ry="3" fill="var(--pwc-sage)" transform="rotate(20 28 26)"/><ellipse cx="22" cy="20" rx="4" ry="3" fill="var(--pwc-sage-light)" stroke="var(--pwc-sage)" stroke-width="0.8"/></svg>';
    if (stage === 4) return '<svg viewBox="0 0 44 44"><rect x="20.5" y="24" width="3" height="16" rx="1.5" fill="var(--pwc-sage-dark)"/><ellipse cx="16" cy="30" rx="5" ry="3" fill="var(--pwc-sage)" transform="rotate(-20 16 30)"/><ellipse cx="28" cy="28" rx="5" ry="3" fill="var(--pwc-sage)" transform="rotate(20 28 28)"/><ellipse cx="22" cy="20" rx="6" ry="8" fill="var(--pwc-rose-light)" stroke="var(--pwc-rose)" stroke-width="0.8"/></svg>';
    return '';
  }
  var MAX_STAGE = 5, seeds = 0, totalBlooms = 0, unlockedFacts = [], plots = [], maxPlots = 30;
  var seedEl = document.getElementById("seedCount"), flowerEl = document.getElementById("flowerCount");
  var factCountEl = document.getElementById("factCount"), factTotalEl = document.getElementById("factTotal");
  var plotEl = document.getElementById("gardenPlot"), emptyMsg = document.getElementById("gardenEmpty");
  var factsGrid = document.getElementById("factsGrid"), toast = document.getElementById("factToast");
  var toastText = document.getElementById("factToastText"), clickerBtn = document.getElementById("clickerBtn");
  var plantBtn = document.getElementById("plantBtn"), waterBtn = document.getElementById("waterBtn");
  var harvestBtn = document.getElementById("harvestBtn"), rippleCont = document.getElementById("rippleContainer");
  factTotalEl.textContent = FACTS.length;
  var SAVE_KEY = "pwc_garden";
  function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify({ s: seeds, b: totalBlooms, f: unlockedFacts, p: plots })); } catch (_) {} }
  function load() { try { var d = JSON.parse(localStorage.getItem(SAVE_KEY)); if (!d) return; seeds = d.s || 0; totalBlooms = d.b || 0; unlockedFacts = d.f || []; plots = d.p || []; } catch (_) {} }
  function updateHUD() { seedEl.textContent = seeds; flowerEl.textContent = totalBlooms; factCountEl.textContent = unlockedFacts.length; plantBtn.disabled = seeds < 5 || plots.length >= maxPlots; waterBtn.disabled = plots.length === 0; harvestBtn.disabled = !plots.some(function (p) { return p.stage >= MAX_STAGE; }); }
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
      var inner = '<span class="fact-text">' + text + '</span>';
      if (!unlocked) inner += '<span class="fact-milestone">Bloom ' + MILESTONES[i] + ' flowers to unlock</span>';
      card.innerHTML = inner;
      factsGrid.appendChild(card);
    });
  }
  function showToast(text) {
    toastText.textContent = text; toast.hidden = false; toast.offsetWidth;
    toast.classList.add("visible");
    setTimeout(function () { toast.classList.remove("visible"); setTimeout(function () { toast.hidden = true; }, 300); }, 3000);
  }
  function checkMilestones() {
    for (var i = 0; i < MILESTONES.length && i < FACTS.length; i++) {
      if (totalBlooms >= MILESTONES[i] && unlockedFacts.indexOf(i) === -1) {
        unlockedFacts.push(i); showToast("New fact unlocked: " + FACTS[i]); renderFacts();
      }
    }
  }
  clickerBtn.addEventListener("click", function () {
    var gain = 1 + Math.floor(totalBlooms / 10); seeds += gain;
    var pop = document.createElement("span"); pop.className = "garden-seed-pop"; pop.textContent = "+" + gain;
    var angle = Math.random() * Math.PI * 2, dist = 25 + Math.random() * 25;
    pop.style.setProperty("--dx", Math.cos(angle) * dist + "px"); pop.style.setProperty("--dy", Math.sin(angle) * dist - 15 + "px");
    pop.style.left = "50%"; pop.style.top = "40%"; rippleCont.appendChild(pop);
    setTimeout(function () { pop.remove(); }, 750); updateHUD(); save();
  });
  plantBtn.addEventListener("click", function () { if (seeds < 5 || plots.length >= maxPlots) return; seeds -= 5; plots.push({ stage: 1 }); renderPlots(); updateHUD(); save(); });
  waterBtn.addEventListener("click", function () {
    var grew = false;
    plots.forEach(function (p) { if (p.stage > 0 && p.stage < MAX_STAGE) { p.stage++; grew = true; if (p.stage >= MAX_STAGE) { totalBlooms++; checkMilestones(); } } });
    if (grew) { renderPlots(); updateHUD(); save(); }
  });
  function waterOne(idx) { var p = plots[idx]; if (!p || p.stage <= 0 || p.stage >= MAX_STAGE) return; p.stage++; if (p.stage >= MAX_STAGE) { totalBlooms++; checkMilestones(); } renderPlots(); updateHUD(); save(); }
  harvestBtn.addEventListener("click", function () { var n = 0; plots = plots.filter(function (p) { if (p.stage >= MAX_STAGE) { n++; return false; } return true; }); seeds += n * 3; renderPlots(); updateHUD(); save(); });
  load(); renderPlots(); renderFacts(); updateHUD();
})();
</script>
