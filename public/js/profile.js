/* ============================================================
   ZAREYA — Profile Portal
   Replaces the old top-right dark-mode toggle with a Profile
   button that opens a slide-in drawer: project tracker,
   theme switch, language switch, sitemap, and preferences.
   All state persists in localStorage.
   ============================================================ */

(function () {
  const PROFILE_KEY = 'zareya-profile';

  /* ── DEFAULT USER / PROJECT DATA ─────────────────────── */
  const DEFAULT_PROFILE = {
    name: 'Kent',
    initial: 'K',
    language: 'en',
    projects: [
      { name: 'Zareya Website v2', type: 'Website', status: 'live', progress: 100, date: 'Live', link: 'index.html' },
      { name: 'The Zareya Letter', type: 'Newsletter', status: 'live', progress: 100, date: 'Weekly', link: 'insights.html' },
      { name: 'Safari Brand Identity', type: 'Brand', status: 'progress', progress: 64, date: 'Due Aug 2026', link: null },
      { name: 'Nova Fintech Campaign', type: 'Campaign', status: 'review', progress: 82, date: 'Awaiting approval', link: null },
      { name: 'Market Scan Q3', type: 'Research', status: 'plan', progress: 12, date: 'Kickoff Jul 2026', link: null },
    ],
  };

  const LANGS = [
    { code: 'en', label: 'English' },
    { code: 'sw', label: 'Swahili' },
    { code: 'fr', label: 'Français' },
  ];

  /* ── STATE ──────────────────────────────────────────── */
  function loadProfile() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) return Object.assign({}, DEFAULT_PROFILE, JSON.parse(raw));
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
  }
  function saveProfile(p) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  }
  let profile = loadProfile();

  /* ── ICONS ──────────────────────────────────────────── */
  function userIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  }
  function sitemapIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M10 6.5h4M10 17.5h4M17.5 10v4M6.5 10v4"/></svg>';
  }
  function linkIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
  }

  const STATUS_LABEL = { live: 'Live', progress: 'In Progress', review: 'In Review', plan: 'Planned' };

  /* ── PROFILE BUTTON (desktop nav) ────────────────────── */
  function injectProfileButton() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    const btn = document.createElement('button');
    btn.id = 'profile-btn';
    btn.setAttribute('aria-label', 'Open profile');
    btn.innerHTML = userIcon();
    const cta = navLinks.querySelector('.nav-cta');
    if (cta) navLinks.insertBefore(btn, cta);
    else navLinks.appendChild(btn);
    btn.addEventListener('click', openDrawer);
  }

  /* ── MOBILE ROW ─────────────────────────────────────── */
  function injectMobileRow() {
    const mobileNav = document.getElementById('nav-mobile');
    if (!mobileNav) return;
    const row = document.createElement('div');
    row.className = 'profile-mobile-row';
    row.innerHTML = '<div class="pm-avatar">' + profile.initial + '</div><div class="pm-name">' + profile.name + '</div>';
    row.style.cursor = 'pointer';
    row.addEventListener('click', openDrawer);
    mobileNav.insertBefore(row, mobileNav.firstChild);
  }

  /* ── DRAWER MARKUP ──────────────────────────────────── */
  function buildDrawer() {
    const overlay = document.createElement('div');
    overlay.id = 'profile-overlay';
    overlay.innerHTML = [
      '<aside id="profile-drawer" aria-label="Profile portal">',
        '<div class="pd-header">',
          '<div class="pd-avatar">' + profile.initial + '</div>',
          '<div>',
            '<div class="pd-name">' + profile.name + '</div>',
            '<div class="pd-sub">Client portal · Zareya</div>',
          '</div>',
          '<button class="pd-close" aria-label="Close" id="pd-close">×</button>',
        '</div>',
        '<div class="pd-body">',
          '<div class="pd-section"><div class="pd-section-title">Your Projects</div><div id="pd-projects"></div></div>',
          '<div class="pd-section"><div class="pd-section-title">Appearance</div><div class="set-row"><div class="set-label">Theme<small>Light or dark mode</small></div><div class="theme-seg" id="pd-theme"></div></div></div>',
          '<div class="pd-section"><div class="pd-section-title">Language</div><div class="lang-pills" id="pd-langs"></div></div>',
          '<div class="pd-section"><div class="pd-section-title">Quick Links</div><div class="pd-links">',
            '<a class="pd-link" href="sitemap.html">' + sitemapIcon() + ' Site Map</a>',
            '<a class="pd-link" href="insights.html">' + linkIcon() + ' Insights &amp; Perspectives</a>',
            '<a class="pd-link" href="contact.html">' + linkIcon() + ' Start a Project</a>',
            '<a class="pd-link" href="privacy.html">' + linkIcon() + ' Privacy &amp; Terms</a>',
          '</div></div>',
        '</div>',
        '<div class="pd-foot">Your preferences are saved on this device.</div>',
      '</aside>'
    ].join('');
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeDrawer(); });
    document.getElementById('pd-close').addEventListener('click', closeDrawer);
    renderProjects();
    renderThemeSeg();
    renderLangs();
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
    document.addEventListener('zareya:themechange', renderThemeSeg);
  }

  function renderProjects() {
    const wrap = document.getElementById('pd-projects');
    if (!wrap) return;
    wrap.innerHTML = profile.projects.map(p => {
      const link = p.link ? '<a class="proj-link" href="' + p.link + '">View →</a>' : '';
      return '<div class="proj">' +
        '<div class="proj-top"><span class="proj-name">' + p.name + '</span>' +
        '<span class="proj-status ' + p.status + '">' + (STATUS_LABEL[p.status] || p.status) + '</span></div>' +
        '<div class="proj-meta">' + p.type + ' · ' + (p.date || '') + '</div>' +
        '<div class="proj-bar"><span style="width:' + p.progress + '%"></span></div>' + link +
      '</div>';
    }).join('');
  }

  function renderThemeSeg() {
    const seg = document.getElementById('pd-theme');
    if (!seg) return;
    const isDark = window.ZareyaTheme && window.ZareyaTheme.isDark();
    /* Buttons do not exist in static markup — build them here */
    seg.innerHTML = '<button data-theme="light">&#9728; Light</button><button data-theme="dark">&#127769; Dark</button>';
    seg.querySelectorAll('button').forEach(b => {
      const active = (b.dataset.theme === 'dark') === !!isDark;
      b.classList.toggle('active', active);
    });
    seg.onclick = e => {
      const t = e.target.closest('button');
      if (!t) return;
      const wantDark = t.dataset.theme === 'dark';
      if (!!window.ZareyaTheme.isDark() !== wantDark) window.ZareyaTheme.toggle();
    };
  }

  function renderLangs() {
    const wrap = document.getElementById('pd-langs');
    if (!wrap) return;
    wrap.innerHTML = LANGS.map(l =>
      '<button class="lang-pill ' + (l.code === profile.language ? 'active' : '') + '" data-lang="' + l.code + '">' + l.label + '</button>'
    ).join('');
    wrap.onclick = e => {
      const b = e.target.closest('.lang-pill');
      if (!b) return;
      profile.language = b.dataset.lang;
      saveProfile(profile);
      renderLangs();
      applyLanguage();
    };
  }

  /* ── LANGUAGE (sets document lang + toast; full i18n later) ─ */
  function applyLanguage() {
    const lang = profile.language;
    document.documentElement.setAttribute('lang', lang);
    const label = LANGS.find(l => l.code === lang);
    if (window.toast && label) window.toast('Language set to ' + label.label);
  }

  /* ── OPEN / CLOSE ────────────────────────────────────── */
  function openDrawer() {
    const overlay = document.getElementById('profile-overlay');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    const overlay = document.getElementById('profile-overlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── INIT ────────────────────────────────────────────── */
  function init() {
    injectProfileButton();
    injectMobileRow();
    buildDrawer();
    applyLanguage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.ZareyaProfile = { open: openDrawer, close: closeDrawer, get: () => profile };

})();
