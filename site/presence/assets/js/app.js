(() => {
  'use strict';

  const shell = document.querySelector('.site-shell');
  const book = document.getElementById('flipbook');
  const papers = [...document.querySelectorAll('.paper')];
  const pages = [...document.querySelectorAll('.paper > .page')];
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  const cornerPrevButtons = [document.getElementById('prevButtonTL'), document.getElementById('prevButtonBL')].filter(Boolean);
  const cornerNextButtons = [document.getElementById('nextButtonTR'), document.getElementById('nextButtonBR')].filter(Boolean);
  const progressBar = document.getElementById('progressBar');
  const pageLabel = document.getElementById('pageLabel');
  const soundButton = document.getElementById('soundButton');
  const fullscreenButton = document.getElementById('fullscreenButton');
  const searchButton = document.getElementById('searchButton');
  const searchDialog = document.getElementById('searchDialog');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const toast = document.getElementById('toast');
  const mobileReader = document.getElementById('mobileReader');
  const mobileJump = document.getElementById('mobileJump');

  const labels = ["Cover", "Welcome", "Contents", "House Signatures", "Presence", "Clarity", "Legacy", "Renaissance", "Reserve Collection", "The Sovereign", "Midnight Gold", "Quiet Authority", "Afterglow", "Ital Collection", "Grounded", "Provision", "Green Wisdom", "Roots & Reason", "Sparkling Collection", "First Light", "Jubilee", "Golden Hour", "Celebration", "Wellness Elixirs", "Restore", "Focus", "Balance", "Renewal", "Dessert & Seasonal", "Velvet", "Cocoa Ceremony", "Harvest Moon", "Sunday Best", "Choose Your Moment", "Order & Reserve", "Back Cover"];
  const pageHashes = ["cover", "welcome", "contents", "house-signatures", "presence", "clarity", "legacy", "renaissance", "reserve-collection", "the-sovereign", "midnight-gold", "quiet-authority", "afterglow", "ital-collection", "grounded", "provision", "green-wisdom", "roots-and-reason", "sparkling-collection", "first-light", "jubilee", "golden-hour", "celebration", "wellness-elixirs", "restore", "focus", "balance", "renewal", "dessert-seasonal", "velvet", "cocoa-ceremony", "harvest-moon", "sunday-best", "choose-your-moment", "order-and-reserve", "back-cover"];
  const navTargets = [0, 0, 2, 3, 3, 3, 3, 3, 8, 8, 8, 8, 8, 13, 13, 13, 13, 13, 18, 18, 18, 18, 18, 23, 23, 23, 23, 23, 28, 28, 28, 28, 28, 33, 34, 34];
  const searchIndex = [{"title": "Cover", "subtitle": "The complete SIP crafted zero-proof collection", "page": 0}, {"title": "Welcome", "subtitle": "Presence before preference", "page": 1}, {"title": "Contents", "subtitle": "Six collections and twenty-four beverages", "page": 2}, {"title": "House Signatures", "subtitle": "Four permanent compositions that carry the clearest expression of SIP: memorable without excess, generous without noise, and unmistakable from the first sip.", "page": 3}, {"title": "Presence", "subtitle": "Blackberry · Assam Black Tea · Charred Orange · Allspice", "page": 4}, {"title": "Clarity", "subtitle": "Green Grape · Cucumber · Silver Needle White Tea · Citrus Blossom", "page": 5}, {"title": "Legacy", "subtitle": "Jamaican Sorrel · Roasted Ginger · Pimento · Blood Orange · Bay Leaf", "page": 6}, {"title": "Renaissance", "subtitle": "Pink Guava · Passion Fruit · Hibiscus · Lime · Pink Peppercorn", "page": 7}, {"title": "Reserve Collection", "subtitle": "Rare ingredients, measured service, and slower rituals. These compositions reward attention and reveal themselves in chapters rather than all at once.", "page": 8}, {"title": "The Sovereign", "subtitle": "Blackcurrant · Mission Fig · Smoked Tea · Cacao · Verjus", "page": 9}, {"title": "Midnight Gold", "subtitle": "Roasted Pineapple · Saffron · Toasted Coconut · Lime · Black Pepper", "page": 10}, {"title": "Quiet Authority", "subtitle": "Roasted Pear · Oolong · Lemon Verbena · Celery Seed · Lemon", "page": 11}, {"title": "Afterglow", "subtitle": "Blood Orange · Apricot · Rooibos · Sumac · Vanilla", "page": 12}, {"title": "Ital Collection", "subtitle": "Plant-first Caribbean compositions shaped by roots, leaves, fruit, spice, and restraint. Nourishing in spirit, generous in flavor, and alive from first aroma to final sip.", "page": 13}, {"title": "Grounded", "subtitle": "Beet · Carrot · Ginger · Lime · Thyme · Coconut Water", "page": 14}, {"title": "Provision", "subtitle": "Roasted Pineapple · Tamarind · Toasted Breadfruit · Coconut · Nutmeg", "page": 15}, {"title": "Green Wisdom", "subtitle": "Green Apple · Cucumber · Callaloo · Basil · Lime · Coconut Water", "page": 16}, {"title": "Roots & Reason", "subtitle": "Sarsaparilla · Ginger · Turmeric · Chicory · Lime · Blackstrap", "page": 17}, {"title": "Sparkling Collection", "subtitle": "Effervescent compositions designed for arrivals, milestones, and tables that deserve a collective toast. Bright, lifted, and celebratory without becoming sugary.", "page": 18}, {"title": "First Light", "subtitle": "Ruby Grapefruit · White Peach · Lemongrass · Rosemary", "page": 19}, {"title": "Jubilee", "subtitle": "Strawberry · Lychee · Rose · Lemon", "page": 20}, {"title": "Golden Hour", "subtitle": "Mango · Tangerine · Chamomile · Ginger Flower", "page": 21}, {"title": "Celebration", "subtitle": "Concord Grape · Elderflower · Lemon · Thyme", "page": 22}, {"title": "Wellness Elixirs", "subtitle": "Hydration-forward, tea-led, and botanical compositions created for how guests want to feel in the room: clear, replenished, balanced, and fully engaged.", "page": 23}, {"title": "Restore", "subtitle": "Coconut Water · Watermelon · Lime · Mint · Sea Salt", "page": 24}, {"title": "Focus", "subtitle": "Sencha · Blueberry · Lemon · Basil · Ginger", "page": 25}, {"title": "Balance", "subtitle": "Pear · Rooibos · Ginger · Cardamom · Lemon", "page": 26}, {"title": "Renewal", "subtitle": "Tart Cherry · Pomegranate · Rosemary · Lime", "page": 27}, {"title": "Dessert & Seasonal", "subtitle": "Rich, aromatic compositions designed to close the meal with intention. Indulgent without becoming careless, and seasonal without becoming novelty.", "page": 28}, {"title": "Velvet", "subtitle": "Black Cherry · Cold Brew · Vanilla · Cacao · Oat Cream", "page": 29}, {"title": "Cocoa Ceremony", "subtitle": "Cacao · Toasted Coconut · Cinnamon · Orange · Oat Cream", "page": 30}, {"title": "Harvest Moon", "subtitle": "Roasted Apple · Pumpkin · Maple · Sage · Rooibos", "page": 31}, {"title": "Sunday Best", "subtitle": "Roasted Sweet Potato · Chicory · Vanilla · Pecan · Nutmeg", "page": 32}, {"title": "Choose Your Moment", "subtitle": "Browse the collection by mood and occasion", "page": 33}, {"title": "Order & Reserve", "subtitle": "SIP address, phone, website, ordering, and reservations", "page": 34}, {"title": "Back Cover", "subtitle": "SIP Chicago contact information", "page": 35}];

  const initialHash = window.location.hash.replace('#','').toLowerCase();
  let currentPage = Math.max(0, pageHashes.indexOf(initialHash));
  let soundEnabled = false;
  let touchStartX = 0;
  let toastTimer;

  function paperStateForPage(page) {
    return page === 0 ? 0 : Math.ceil(page / 2);
  }

  function companionPageFor(page) {
    if (page === 0) return -1;
    if (page === labels.length - 1) return -1;
    return page % 2 === 0 ? page - 1 : page + 1;
  }

  function updateBook() {
    const turns = paperStateForPage(currentPage);
    papers.forEach((paper, index) => paper.classList.toggle('flipped', index < turns));
    book.classList.toggle('is-open', turns > 0 && turns < papers.length);
    book.style.setProperty('--active-turns', String(turns));
    shell.dataset.page = String(currentPage);

    const companionPage = companionPageFor(currentPage);
    pages.forEach((page, index) => {
      const isCurrent = index === currentPage;
      const isCompanion = index === companionPage;
      page.classList.toggle('is-current-page', isCurrent);
      page.classList.toggle('is-companion-page', isCompanion);
      page.setAttribute('aria-hidden', String(!isCurrent && !isCompanion));
      if (isCurrent) page.setAttribute('aria-current', 'page');
      else page.removeAttribute('aria-current');
    });

    pageLabel.textContent = labels[currentPage];
    progressBar.style.width = `${((currentPage + 1) / labels.length) * 100}%`;
    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === labels.length - 1;
    cornerPrevButtons.forEach(btn => { btn.disabled = prevButton.disabled; });
    cornerNextButtons.forEach(btn => { btn.disabled = nextButton.disabled; });

    const activeTarget = navTargets[currentPage];
    document.querySelectorAll('.chapter-nav button').forEach(btn => {
      btn.classList.toggle('is-active', Number(btn.dataset.go) === activeTarget);
    });
    if (mobileJump) mobileJump.value = String(activeTarget);
  }

  function goTo(page, withSound = true) {
    const nextPage = Math.max(0, Math.min(labels.length - 1, Number(page)));
    if (nextPage === currentPage) return;
    currentPage = nextPage;
    const hash = pageHashes[currentPage];
    if (window.location.hash !== `#${hash}`) history.replaceState(null, '', `#${hash}`);
    if (withSound) playPageSound();
    updateBook();
    if (window.innerWidth <= 760) {
      document.getElementById(`mobile-page-${currentPage}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function next() { goTo(currentPage + 1); }
  function prev() { goTo(currentPage - 1); }

  function playPageSound() {
    if (!soundEnabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const bufferSize = ctx.sampleRate * 0.16;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const envelope = Math.sin(Math.PI * i / bufferSize) ** 2;
        data[i] = (Math.random() * 2 - 1) * envelope * 0.16;
      }
      const source = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass'; filter.frequency.value = 1600;
      source.buffer = buffer; source.connect(filter); filter.connect(ctx.destination);
      source.start(); source.onended = () => ctx.close();
    } catch (_) {}
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  function renderSearch(query = '') {
    const q = query.trim().toLowerCase();
    const matches = searchIndex.filter(item => `${item.title} ${item.subtitle}`.toLowerCase().includes(q));
    searchResults.innerHTML = matches.length ? matches.map(item => `
      <button class="search-result" type="button" data-result-page="${item.page}">
        <span>${String(item.page + 1).padStart(2,'0')}</span>
        <b>${item.title}</b>
        <small>${item.subtitle}</small>
      </button>`).join('') : '<p>No matching page in this collection.</p>';
  }

  function buildMobileReader() {
    const pages = [...document.querySelectorAll('.page')];
    pages.forEach((page, index) => {
      const section = document.createElement('section');
      section.className = 'mobile-page';
      section.id = `mobile-page-${index}`;
      section.setAttribute('aria-label', labels[index]);
      const clone = page.cloneNode(true);
      clone.classList.remove('front','back','page');
      clone.removeAttribute('id');
      clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      section.appendChild(clone);
      mobileReader.appendChild(section);
    });

    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible || window.innerWidth > 760) return;
      currentPage = Number(visible.target.id.replace('mobile-page-',''));
      shell.dataset.page = String(currentPage);
      pageLabel.textContent = labels[currentPage];
      if (mobileJump) mobileJump.value = String(navTargets[currentPage]);
    }, { threshold: [0.45,0.7] });
    [...mobileReader.children].forEach(el => observer.observe(el));
  }

  nextButton.addEventListener('click', next);
  prevButton.addEventListener('click', prev);
  cornerPrevButtons.forEach(btn => btn.addEventListener('click', prev));
  cornerNextButtons.forEach(btn => btn.addEventListener('click', next));
  mobileJump?.addEventListener('change', event => goTo(event.target.value));

  document.addEventListener('click', event => {
    const goButton = event.target.closest('[data-go]');
    if (goButton) goTo(goButton.dataset.go);
  });

  soundButton.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundButton.setAttribute('aria-pressed', String(soundEnabled));
    showToast(soundEnabled ? 'Page sound enabled' : 'Page sound muted');
    if (soundEnabled) playPageSound();
  });

  fullscreenButton.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) { showToast('Full screen is unavailable in this browser.'); }
  });

  searchButton.addEventListener('click', () => {
    renderSearch('');
    searchDialog.showModal();
    setTimeout(() => searchInput.focus(), 50);
  });
  searchInput.addEventListener('input', event => renderSearch(event.target.value));
  searchResults.addEventListener('click', event => {
    const button = event.target.closest('[data-result-page]');
    if (!button) return;
    searchDialog.close();
    goTo(button.dataset.resultPage);
  });

  document.addEventListener('keydown', event => {
    if (searchDialog.open) return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown') next();
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') prev();
    if (event.key === 'Home') goTo(0);
    if (event.key === 'End') goTo(labels.length - 1);
  });

  book.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, { passive:true });
  book.addEventListener('touchend', event => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) < 45) return;
    delta < 0 ? next() : prev();
  }, { passive:true });

  window.addEventListener('hashchange', () => {
    const requested = pageHashes.indexOf(window.location.hash.replace('#','').toLowerCase());
    if (requested >= 0 && requested !== currentPage) {
      currentPage = requested;
      updateBook();
    }
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('./service-worker.js?v=6.5.0');
        registration.update();
      } catch (_) {}
    });
  }

  buildMobileReader();
  updateBook();
})();
