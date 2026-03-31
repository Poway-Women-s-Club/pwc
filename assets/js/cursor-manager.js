/**
 * cursor-manager.js — PWC Custom Cursor System
 *
 * Loaded on every page (via head.html). Reads the saved cursor preference
 * from localStorage and injects a <style> tag that overrides the default
 * arrow cursor site-wide. The profile Appearance tab calls CursorManager.apply()
 * to change and persist the preference.
 */

(function () {
  "use strict";

  var STORAGE_KEY = "pwc_cursor";

  /* ── Cursor catalogue ─────────────────────────────────────────────────── */
  /* Each entry: key, display label, SVG fill, SVG outline stroke, group    */

  var CURSORS = [
    /* Standard colors */
    { key: "default", label: "Default", fill: null,      stroke: null,      group: "standard" },
    { key: "black",   label: "Black",   fill: "#1c1c1c", stroke: "#ffffff",  group: "standard" },
    { key: "white",   label: "White",   fill: "#ffffff", stroke: "#555555",  group: "standard" },
    { key: "red",     label: "Red",     fill: "#d94f4f", stroke: "#7a0000",  group: "standard" },
    { key: "blue",    label: "Blue",    fill: "#4a7fc1", stroke: "#1a3d6b",  group: "standard" },
    { key: "purple",  label: "Purple",  fill: "#8b5cf6", stroke: "#3b0764",  group: "standard" },
    /* Website-themed */
    { key: "rose",    label: "Rose",    fill: "#c4788a", stroke: "#5a1e2e",  group: "themed"   },
    { key: "sage",    label: "Sage",    fill: "#7a8e6b", stroke: "#2a3e1e",  group: "themed"   },
    { key: "gold",    label: "Gold",    fill: "#c9a070", stroke: "#6a4010",  group: "themed"   },
    /* Shaped themed */
    { key: "flower",  label: "Flower",  fill: "#c4788a", stroke: "#8a4a5a",  group: "themed", isFlower: true },
  ];

  /* ── SVG helpers ──────────────────────────────────────────────────────── */

  /* Builds the standard arrow-cursor SVG string at 24×24 px */
  function buildArrowSVG(fill, stroke) {
    return (
      "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'>" +
      "<path d='M4 1 L4 19 L8 14.5 L11 21 L13.5 20 L10.5 13.5 L16 13.5 Z'" +
      " fill='" + fill + "'" +
      " stroke='" + stroke + "'" +
      " stroke-width='1.5' stroke-linejoin='round'/>" +
      "</svg>"
    );
  }

  /*
   * Builds a 5-petal flower SVG centered in a square of `size` px.
   * Petals use the given fill/stroke; the center uses the site's warm gold.
   * Hotspot is the geometric center (size/2, size/2).
   */
  function buildFlowerSVG(fill, stroke, size) {
    var s   = size || 24;
    var cx  = s / 2;
    /* Scale petal and center dimensions proportionally to a 24 px base */
    var pr  = (s * 0.125).toFixed(2);   /* petal rx  ≈ 3 at 24 px  */
    var ph  = (s * 0.229).toFixed(2);   /* petal ry  ≈ 5.5 at 24 px */
    var cr  = (s * 0.146).toFixed(2);   /* center r  ≈ 3.5 at 24 px */
    var petals = "";
    for (var i = 0; i < 5; i++) {
      petals +=
        "<ellipse rx='" + pr + "' ry='" + ph + "' cy='-" + ph + "'" +
        " fill='" + fill + "' stroke='" + stroke + "' stroke-width='0.8'" +
        " transform='rotate(" + (i * 72) + ")'/>";
    }
    return (
      "<svg xmlns='http://www.w3.org/2000/svg' width='" + s + "' height='" + s + "'>" +
      "<g transform='translate(" + cx + "," + cx + ")'>" +
      petals +
      "<circle r='" + cr + "' fill='#c9a070' stroke='#8a5f2a' stroke-width='0.8'/>" +
      "</g>" +
      "</svg>"
    );
  }

  /* Returns a CSS cursor value string (data URI + fallback) */
  function toCursorValue(cursor) {
    var svg, hotspot;
    if (cursor.isFlower) {
      svg     = buildFlowerSVG(cursor.fill, cursor.stroke, 24);
      hotspot = "12 12";
    } else {
      svg     = buildArrowSVG(cursor.fill, cursor.stroke);
      hotspot = "4 1";
    }
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '") ' + hotspot + ', auto';
  }

  /* ── Apply / remove ───────────────────────────────────────────────────── */

  function applyCSS(key) {
    var styleId = "pwc-cursor-style";
    var tag = document.getElementById(styleId);
    if (!tag) {
      tag = document.createElement("style");
      tag.id = styleId;
      document.head.appendChild(tag);
    }

    /* Find cursor definition */
    var cursor = null;
    for (var i = 0; i < CURSORS.length; i++) {
      if (CURSORS[i].key === key) { cursor = CURSORS[i]; break; }
    }

    if (!cursor || !cursor.fill) {
      tag.textContent = ""; /* restore browser default */
    } else {
      var val = toCursorValue(cursor);
      tag.textContent = "html, body { cursor: " + val + "; }";
    }
  }

  /* ── Public API ───────────────────────────────────────────────────────── */

  function apply(key) {
    localStorage.setItem(STORAGE_KEY, key || "default");
    applyCSS(key);
  }

  function getSaved() {
    return localStorage.getItem(STORAGE_KEY) || "default";
  }

  /* Apply immediately when the script is parsed */
  applyCSS(getSaved());

  window.CursorManager = {
    CURSORS:        CURSORS,
    apply:          apply,
    getSaved:       getSaved,
    buildArrowSVG:  buildArrowSVG,
    buildFlowerSVG: buildFlowerSVG,
  };
})();
