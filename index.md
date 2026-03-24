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

<div class="pwc-cta">
  <h2>Interested in Joining?</h2>
  <p>Come to a meeting — visitors are always welcome. No RSVP needed.</p>
  <a href="{{ site.baseurl }}/navigation/contact" class="pwc-btn pwc-btn-white">Contact Us</a>
</div>

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