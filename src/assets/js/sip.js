/* S.I.P. site behavior. No dependencies. Everything degrades to plain HTML without it. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  if (/[?&]static/.test(location.search)) root.classList.add('static');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header: solid on scroll */
  var hdr = d.querySelector('.site-header');
  function onScroll() {
    var s = window.scrollY > 24;
    if (hdr) hdr.classList.toggle('is-scrolled', s);
    d.body.classList.toggle('is-scrolled-page', s);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* mobile menu */
  var toggle = d.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = d.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    d.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () { d.body.classList.remove('nav-open'); toggle.setAttribute('aria-expanded', 'false'); });
    });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { d.body.classList.remove('nav-open'); toggle.setAttribute('aria-expanded', 'false'); } });
  }

  /* current page in nav */
  var key = d.body.getAttribute('data-nav');
  if (key) {
    var cur = d.querySelector('.nav a[data-key="' + key + '"]');
    if (cur) cur.setAttribute('aria-current', 'page');
  }

  /* reveal on scroll */
  var targets = d.querySelectorAll('.reveal, .reveal-line');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .14, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('in'); });
  }

  /* count-up numbers: <span data-count="3000" data-prefix="~" data-suffix="+"> */
  function fmt(n) { return n.toLocaleString('en-US'); }
  var counters = d.querySelectorAll('[data-count]');
  function run(el) {
    var end = parseFloat(el.getAttribute('data-count')), pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
    if (reduce || root.classList.contains('static')) { el.textContent = pre + fmt(end) + suf; return; }
    var t0 = null, dur = 1800;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = pre + fmt(Math.round(end * e)) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { run(e.target); co.unobserve(e.target); } });
    }, { threshold: .6 });
    counters.forEach(function (c) { co.observe(c); });
  } else { counters.forEach(run); }

  /* tabs */
  d.querySelectorAll('.tabs').forEach(function (tabs) {
    var btns = tabs.querySelectorAll('[role="tab"]'), panels = tabs.querySelectorAll('[role="tabpanel"]');
    function show(id, focus) {
      btns.forEach(function (b) { var on = b.getAttribute('aria-controls') === id; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
      panels.forEach(function (p) { p.hidden = p.id !== id; });
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { show(b.getAttribute('aria-controls')); });
      b.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
        if (n === null) return; e.preventDefault();
        var nb = btns[(n + btns.length) % btns.length]; show(nb.getAttribute('aria-controls'), true);
      });
    });
  });

  /* workroom: side-nav highlight + persistent checklist */
  var wn = d.querySelectorAll('.workroom-nav a');
  if (wn.length && 'IntersectionObserver' in window) {
    var secs = Array.prototype.map.call(wn, function (a) { return d.querySelector(a.getAttribute('href')); }).filter(Boolean);
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) wn.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    secs.forEach(function (s) { so.observe(s); });
  }
  var checks = d.querySelectorAll('.verify-item input');
  if (checks.length) {
    var store = {};
    try { store = JSON.parse(localStorage.getItem('sip-verify') || '{}'); } catch (e) { }
    var bar = d.querySelector('.progress i'), lab = d.querySelector('[data-progress-label]');
    var upd = function () {
      var n = 0; checks.forEach(function (c) { if (c.checked) n++; });
      if (bar) bar.style.width = (n / checks.length * 100) + '%';
      if (lab) lab.textContent = n + ' of ' + checks.length + ' confirmed';
    };
    checks.forEach(function (c) {
      c.checked = !!store[c.id];
      c.addEventListener('change', function () {
        store[c.id] = c.checked;
        try { localStorage.setItem('sip-verify', JSON.stringify(store)); } catch (e) { }
        upd();
      });
    });
    upd();
  }

  /* footer year */
  d.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
