---
layout: default
title: Poway Woman's Club
hide: true
show_reading_time: false
---

<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Nunito+Sans:wght@300;400;600;700&display=swap');

  :root {
    --pwc-cream: #fbf8f6;
    --pwc-sage: #7a8e6b;
    --pwc-sage-dark: #5c6e50;
    --pwc-sage-light: #dde6d5;
    --pwc-rose: #c4788a;
    --pwc-rose-dark: #a25d6e;
    --pwc-rose-light: #f2dce2;
    --pwc-warm: #c9a070;
    --pwc-charcoal: #342e30;
    --pwc-text: #504a4c;
    --pwc-muted: #928a8c;
    --pwc-border: #e8dfe2;
    --pwc-white: #ffffff;
  }

  .pwc-hero {
    padding: 4rem 2rem 3rem;
    text-align: center;
    background: linear-gradient(135deg, var(--pwc-sage-light) 0%, var(--pwc-cream) 40%, var(--pwc-rose-light) 100%);
    border-bottom: 2px solid var(--pwc-border);
  }

  .pwc-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2.6rem;
    font-weight: 700;
    color: var(--pwc-charcoal);
    line-height: 1.2;
    margin-bottom: 0.75rem;
  }

  .pwc-hero p {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 1.05rem;
    font-weight: 400;
    color: var(--pwc-text);
    max-width: 520px;
    margin: 0 auto 1.75rem;
    line-height: 1.6;
  }

  .pwc-hero-links {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .pwc-btn {
    display: inline-block;
    padding: 0.65rem 1.5rem;
    border-radius: 6px;
    font-family: 'Nunito Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.2s ease, color 0.2s ease;
  }

  .pwc-btn-fill {
    background: linear-gradient(135deg, var(--pwc-sage), var(--pwc-rose));
    color: var(--pwc-white);
    border: none;
  }

  .pwc-btn-fill:hover {
    background: linear-gradient(135deg, var(--pwc-sage-dark), var(--pwc-rose-dark));
  }

  .pwc-btn-border {
    background: none;
    color: var(--pwc-rose-dark);
    border: 1.5px solid var(--pwc-rose);
  }

  .pwc-btn-border:hover {
    background: var(--pwc-rose);
    color: var(--pwc-white);
  }

  .pwc-section {
    padding: 3rem 2rem;
    max-width: 860px;
    margin: 0 auto;
  }

  .pwc-section h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--pwc-charcoal);
    margin-bottom: 0.75rem;
  }

  .pwc-section p {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 0.95rem;
    color: var(--pwc-text);
    line-height: 1.7;
    margin-bottom: 0.75rem;
  }

  .pwc-rule {
    width: 40px;
    height: 2px;
    background: var(--pwc-warm);
    border: none;
    margin: 0 0 1.5rem;
  }

  .pwc-facts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 0.75rem;
    margin-top: 1.25rem;
  }

  .pwc-fact {
    text-align: center;
    padding: 1rem 0.75rem;
    background: var(--pwc-cream);
    border: 1px solid var(--pwc-border);
    border-radius: 8px;
  }

  .pwc-fact strong {
    display: block;
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    color: var(--pwc-charcoal);
  }

  .pwc-fact span {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 0.75rem;
    color: var(--pwc-muted);
  }

  .pwc-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.25rem;
    margin-top: 1.25rem;
  }

  .pwc-card {
    background: var(--pwc-white);
    border: 1px solid var(--pwc-border);
    border-radius: 8px;
    padding: 1.25rem;
  }

  .pwc-card h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem;
    color: var(--pwc-charcoal);
    margin-bottom: 0.4rem;
  }

  .pwc-card p {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 0.85rem;
    color: var(--pwc-muted);
    line-height: 1.55;
    margin: 0;
  }

  .pwc-cta {
    background: linear-gradient(135deg, var(--pwc-sage), var(--pwc-rose));
    padding: 2.5rem 2rem;
    text-align: center;
    border-radius: 8px;
    margin: 1.5rem auto;
    max-width: 860px;
  }

  .pwc-cta h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: var(--pwc-white);
    margin-bottom: 0.5rem;
  }

  .pwc-cta p {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 0.95rem;
    color: rgba(255,255,255,0.85);
    margin-bottom: 1.25rem;
  }

  .pwc-btn-white {
    background: var(--pwc-white);
    color: var(--pwc-sage-dark);
    border: none;
  }

  .pwc-btn-white:hover {
    background: rgba(255,255,255,0.85);
  }

  @media (prefers-color-scheme: dark) {
    .pwc-hero { background: linear-gradient(135deg, #252e22 0%, #1e1a1b 40%, #2e2228 100%); border-color: #3a3438; }
    .pwc-hero h1, .pwc-section h2, .pwc-card h3, .pwc-fact strong { color: #eae8e6; }
    .pwc-hero p, .pwc-section p, .pwc-fact span { color: #b8b2b4; }
    .pwc-card { background: #26242a; border-color: #3a3438; }
    .pwc-card p { color: #9a9498; }
    .pwc-fact { background: #222; border-color: #3a3438; }
    .pwc-btn-border { color: var(--pwc-rose-light); border-color: var(--pwc-rose-light); }
    .pwc-btn-border:hover { background: var(--pwc-rose-light); color: var(--pwc-charcoal); }
  }
</style>

<div class="pwc-hero">
  <h1>Poway Woman's Club</h1>
  <p>A nonprofit service organization in Poway, California. Since 1960, our members have supported local scholarships, the arts, civic programs, and youth leadership.</p>
  <div class="pwc-hero-links">
    <a href="{{ site.baseurl }}/navigation/about" class="pwc-btn pwc-btn-fill">About Us</a>
    <a href="{{ site.baseurl }}/navigation/events" class="pwc-btn pwc-btn-border">Events</a>
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

<div class="pwc-cta">
  <h2>Interested in Joining?</h2>
  <p>Come to a meeting — visitors are always welcome. No RSVP needed.</p>
  <a href="{{ site.baseurl }}/navigation/contact" class="pwc-btn pwc-btn-white">Contact Us</a>
</div>