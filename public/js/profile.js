/* ============================================================
   ZAREYA — Profile Portal
   Replaces the old top-right dark-mode toggle with a Profile
   button that opens a slide-in drawer. The drawer is a set of
   ACTION BUTTONS:
     • Log in to customer portal
     • Change theme (light/dark)
     • Join the newsletter
     • Change language
     • View my projects
     • Site map
     • Start a project (contact)
     • Privacy & terms
   Preferences persist in localStorage.
   ============================================================ */

(function () {
  const PROFILE_KEY = 'zareya-profile';

  const DEFAULT_PROFILE = {
    name: 'Kent',
    initial: 'K',
    language: 'en',
    loggedIn: false,
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

  function loadProfile() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) return Object.assign({}, DEFAULT_PROFILE, JSON.parse(raw));
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
  }
  function saveProfile(p) { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); }
  let profile = loadProfile();

  /* ── ICONS (inline svg strings) ─────────────────────── */
  function userIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  }
  function loginIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/></svg>';
  }
  function themeIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  function mailIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';
  }
  function globeIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
  }
  function folderIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>';
  }
  function mapIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>';
  }
  function plusIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  }
  function lockIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
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
            '<div class="pd-sub">' + (profile.loggedIn ? 'Signed in' : 'Guest · Zareya') + '</div>',
          '</div>',
          '<button class="pd-close" aria-label="Close" id="pd-close">×</button>',
        '</div>',

        '<div class="pd-body">',

          /* ── ACTION BUTTONS ── */
          '<div class="pd-grid">',
            '<button class="pd-action" id="pd-login">' + loginIcon() + '<span>Log in</span><small>Customer portal</small></button>',
            '<button class="pd-action" id="pd-theme">' + themeIcon() + '<span>Change theme</span><small id="pd-theme-sub">Light / Dark</small></button>',
            '<button class="pd-action" id="pd-news">' + mailIcon() + '<span>Join newsletter</span><small>The Zareya Letter</small></button>',
            '<button class="pd-action" id="pd-lang">' + globeIcon() + '<span>Language</span><small id="pd-lang-sub">' + (LANGS.find(l=>l.code===profile.language)||{}).label + '</small></button>',
            '<button class="pd-action" id="pd-projects-btn">' + folderIcon() + '<span>My projects</span><small>' + profile.projects.length + ' active</small></button>',
            '<a class="pd-action" href="sitemap.html">' + mapIcon() + '<span>Site map</span><small>All pages</small></a>',
            '<a class="pd-action" href="contact.html">' + plusIcon() + '<span>Start a project</span><small>Talk to us</small></a>',
            '<a class="pd-action" href="privacy.html">' + lockIcon() + '<span>Privacy &amp; terms</span><small>How we handle data</small></a>',
          '</div>',

          /* ── PROJECTS PANEL (toggle) ── */
          '<div class="pd-section pd-projects-panel" id="pd-projects-panel" style="display:none;">',
            '<div class="pd-section-title">Your Projects</div>',
            '<div id="pd-projects"></div>',
          '</div>',

          /* ── LANGUAGE PANEL (toggle) ── */
          '<div class="pd-section pd-langs-panel" id="pd-langs-panel" style="display:none;">',
            '<div class="pd-section-title">Language</div>',
            '<div class="lang-pills" id="pd-langs"></div>',
          '</div>',

          /* ── NEWSLETTER PANEL (toggle) ── */
          '<div class="pd-section pd-news-panel" id="pd-news-panel" style="display:none;">',
            '<div class="pd-section-title">Join The Zareya Letter</div>',
            '<form class="pd-news-form" onsubmit="return window.ZareyaProfile.subscribe(event)">',
              '<input type="email" placeholder="you@email.com" required>',
              '<button type="submit">Subscribe</button>',
            '</form>',
            '<p class="pd-note">We send one short, useful note a week. No spam.</p>',
          '</div>',

        '</div>',
        '<div class="pd-foot">Preferences are saved on this device.</div>',
      '</aside>'
    ].join('');
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeDrawer(); });
    document.getElementById('pd-close').addEventListener('click', closeDrawer);
    bindActions();
    renderProjects();
    renderThemeSub();
    renderLangs();
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
    document.addEventListener('zareya:themechange', renderThemeSub);
  }

  function bindActions() {
    const login = document.getElementById('pd-login');
    const theme = document.getElementById('pd-theme');
    const news = document.getElementById('pd-news');
    const lang = document.getElementById('pd-lang');
    const projBtn = document.getElementById('pd-projects-btn');

    if (login) login.addEventListener('click', () => {
      profile.loggedIn = !profile.loggedIn;
      saveProfile(profile);
      document.querySelector('#pd-login span').textContent = profile.loggedIn ? 'Log out' : 'Log in';
      document.querySelector('.pd-sub').textContent = profile.loggedIn ? 'Signed in' : 'Guest · Zareya';
      if (window.toast) window.toast(profile.loggedIn ? 'Logged in to customer portal' : 'Logged out');
    });

    if (theme) theme.addEventListener('click', () => {
      if (window.ZareyaTheme) window.ZareyaTheme.toggle();
    });

    if (news) news.addEventListener('click', () => {
      togglePanel('pd-news-panel');
    });

    if (lang) lang.addEventListener('click', () => {
      togglePanel('pd-langs-panel');
    });

    if (projBtn) projBtn.addEventListener('click', () => {
      togglePanel('pd-projects-panel');
    });
  }

  function togglePanel(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const hide = el.style.display !== 'none' ? 'none' : '';
    el.style.display = hide;
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

  function renderThemeSub() {
    const sub = document.getElementById('pd-theme-sub');
    if (sub && window.ZareyaTheme) {
      sub.textContent = window.ZareyaTheme.isDark() ? 'Currently Dark' : 'Currently Light';
    }
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

  function applyLanguage() {
    const lang = profile.language;
    document.documentElement.setAttribute('lang', lang);
    const label = LANGS.find(l => l.code === lang);
    if (window.toast && label) window.toast('Language set to ' + label.label);
  }

  /* Newsletter subscribe (works with Netlify Forms via contact-form.js if present) */
  window.ZareyaProfile = window.ZareyaProfile || {};
  window.ZareyaProfile.subscribe = function (e) {
    e.preventDefault();
    const input = e.target.querySelector('input[type="email"]');
    const email = input ? input.value.trim() : '';
    if (!email || !email.includes('@')) { if (window.toast) window.toast('Enter a valid email.'); return false; }
    if (window.handleNewsletter) {
      // delegate to the shared newsletter handler
      window.handleNewsletter(e, e.target);
    } else {
      if (window.toast) window.toast('Subscribed. Welcome to The Zareya Letter.');
    }
    e.target.reset();
    togglePanel('pd-news-panel');
    return false;
  };

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

})();
