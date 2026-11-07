/* Fair Chance Directory: render, search, filter. Reads window.SIP_DIRECTORY. */
(function () {
  'use strict';
  var data = window.SIP_DIRECTORY, d = document;
  if (!data) return;
  var grid = d.getElementById('dir-grid'), chipsEl = d.getElementById('chips'), q = d.getElementById('q'),
      countEl = d.getElementById('dir-count'), emptyEl = d.getElementById('dir-empty');
  var state = { sector: 'all', tier1: false, q: '' };

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function hay(e) { return [e.n, e.b, e.r, e.x || '', (e.h || []).join(' '), data.sectors[e.s]].join(' ').toLowerCase(); }

  /* build cards */
  var cards = data.entries.map(function (e, i) {
    var el = d.createElement('article');
    el.className = 'entry'; el.id = 'e' + i;
    var steps = (e.h || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');
    el.innerHTML =
      '<div class="entry-head"><span class="tag">' + esc(data.sectors[e.s]) + '</span><span>' +
      (e.t ? '<span class="badge">Tier 1 &middot; highest volume</span> ' : '') +
      (e.v ? '<span class="badge verify">Verify</span>' : '') + '</span></div>' +
      '<h3>' + esc(e.n) + '</h3>' +
      '<p class="blurb">' + esc(e.b) + '</p>' +
      (e.r ? '<p class="roles"><b>Roles</b>' + esc(e.r) + '</p>' : '') +
      (steps ? '<details><summary>How to start</summary><ol>' + steps + '</ol></details>' : '') +
      '<div class="links">' + (e.u ? '<a href="' + esc(e.u) + '" target="_blank" rel="noopener">Source &amp; official page &#8599;</a>' : '') +
      (e.x ? '<span class="small">' + esc(e.x) + '</span>' : '') + '</div>' +
      (e.v ? '<p class="vnote">Verify before referring: ' + esc(e.v) + '</p>' : '');
    el._hay = hay(e); el._e = e; el._orig = el.innerHTML;
    grid.appendChild(el);
    return el;
  });

  /* chips */
  var counts = {}; data.entries.forEach(function (e) { counts[e.s] = (counts[e.s] || 0) + 1; });
  function chip(key, label, n) {
    var b = d.createElement('button'); b.type = 'button'; b.className = 'chip'; b.dataset.k = key;
    b.setAttribute('aria-pressed', key === 'all' ? 'true' : 'false');
    b.innerHTML = esc(label) + '<span class="ct">' + n + '</span>'; return b;
  }
  chipsEl.appendChild(chip('all', 'All', data.entries.length));
  Object.keys(data.sectors).forEach(function (k) { chipsEl.appendChild(chip(k, data.sectors[k], counts[k] || 0)); });
  var tierBtn = d.createElement('button'); tierBtn.type = 'button'; tierBtn.className = 'chip'; tierBtn.dataset.k = 'tier1';
  tierBtn.setAttribute('aria-pressed', 'false'); tierBtn.innerHTML = 'Tier 1 only'; chipsEl.appendChild(tierBtn);

  chipsEl.addEventListener('click', function (ev) {
    var b = ev.target.closest('.chip'); if (!b) return;
    if (b.dataset.k === 'tier1') { state.tier1 = !state.tier1; b.setAttribute('aria-pressed', state.tier1); }
    else { state.sector = b.dataset.k; chipsEl.querySelectorAll('.chip').forEach(function (c) { if (c.dataset.k !== 'tier1') c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); }); }
    apply();
  });
  var timer; q.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(function () { state.q = q.value.trim().toLowerCase(); apply(); }, 120); });

  function mark(html, term) {
    /* highlight inside text nodes only */
    var tmp = d.createElement('div'); tmp.innerHTML = html;
    var re = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
    var w = d.createTreeWalker(tmp, NodeFilter.SHOW_TEXT), nodes = [], n;
    while ((n = w.nextNode())) nodes.push(n);
    nodes.forEach(function (t) {
      if (!re.test(t.nodeValue)) return; re.lastIndex = 0;
      var s = d.createElement('span'); s.innerHTML = esc(t.nodeValue).replace(new RegExp('(' + esc(term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>');
      t.parentNode.replaceChild(s, t);
    });
    return tmp.innerHTML;
  }

  function apply() {
    var n = 0;
    cards.forEach(function (el) {
      var e = el._e;
      var ok = (state.sector === 'all' || e.s === state.sector) && (!state.tier1 || e.t) && (!state.q || el._hay.indexOf(state.q) > -1);
      el.hidden = !ok;
      if (ok) { n++; el.innerHTML = state.q && state.q.length > 1 ? mark(el._orig, state.q) : el._orig; }
    });
    countEl.textContent = n + (n === 1 ? ' entry' : ' entries');
    emptyEl.hidden = n !== 0;
  }
  apply();
})();
