/* ============================================================
   ZAREYA — Theme Switcher
   Light mode is default. Dark mode toggled by button.
   Preference saved to localStorage so it persists.
   ============================================================ */

(function () {

  const STORAGE_KEY = 'zareya-theme';
  const html = document.documentElement;

  /* ── APPLY SAVED PREFERENCE ──────────────────────────── */
  /* Run immediately before page renders to avoid flash */
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark') {
    html.classList.add('dark');
  }

  /* ── INJECT TOGGLE BUTTON INTO NAV ──────────────────── */
  /* Waits for DOM then adds button between nav links and CTA */
  function injectToggle() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.style.cssText = `
      width: 34px; height: 34px;
      display: flex; align-items: center; justify-content: center;
      background: transparent;
      border: 1px solid var(--border-2);
      border-radius: 50%;
      cursor: pointer;
      color: var(--text-2);
      transition: all 0.2s ease;
      flex-shrink: 0;
    `;

    btn.innerHTML = isDark()
      ? sunIcon()   /* dark mode active — show sun to switch to light */
      : moonIcon(); /* light mode active — show moon to switch to dark */

    btn.addEventListener('click', toggleTheme);
    btn.addEventListener('mouseenter', () => {
      btn.style.borderColor = 'var(--rose)';
      btn.style.color = 'var(--rose)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.borderColor = 'var(--border-2)';
      btn.style.color = 'var(--text-2)';
    });

    /* Insert before the CTA button */
    const cta = navLinks.querySelector('.nav-cta');
    if (cta) {
      navLinks.insertBefore(btn, cta);
    } else {
      navLinks.appendChild(btn);
    }

    /* Also add to mobile nav */
    injectMobileToggle();
  }

  function injectMobileToggle() {
    const mobileNav = document.getElementById('nav-mobile');
    if (!mobileNav) return;

    const row = document.createElement('div');
    row.style.cssText = `
      padding: 14px 0;
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
    `;

    const label = document.createElement('span');
    label.style.cssText = `
      font-size: 13px; font-weight: 500;
      letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--text-2);
    `;
    label.textContent = isDark() ? 'Light Mode' : 'Dark Mode';

    const toggle = document.createElement('div');
    toggle.style.cssText = `
      width: 44px; height: 24px;
      background: ${isDark() ? 'var(--rose)' : 'var(--border-2)'};
      border-radius: 12px; position: relative; cursor: pointer;
      transition: background 0.2s ease; flex-shrink: 0;
    `;
    const knob = document.createElement('div');
    knob.style.cssText = `
      width: 18px; height: 18px; background: #fff; border-radius: 50%;
      position: absolute; top: 3px;
      left: ${isDark() ? '23px' : '3px'};
      transition: left 0.2s ease;
    `;
    toggle.appendChild(knob);

    toggle.addEventListener('click', () => {
      toggleTheme();
      /* Update label and knob */
      label.textContent = isDark() ? 'Light Mode' : 'Dark Mode';
      toggle.style.background = isDark() ? 'var(--rose)' : 'var(--border-2)';
      knob.style.left = isDark() ? '23px' : '3px';
    });

    row.appendChild(label);
    row.appendChild(toggle);

    /* Insert as first item */
    mobileNav.insertBefore(row, mobileNav.firstChild);
  }

  /* ── TOGGLE LOGIC ────────────────────────────────────── */
  function isDark() {
    return html.classList.contains('dark');
  }

  function toggleTheme() {
    const dark = isDark();
    if (dark) {
      html.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY, 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem(STORAGE_KEY, 'dark');
    }

    /* Update the desktop toggle icon */
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.innerHTML = isDark() ? sunIcon() : moonIcon();
    }
  }

  /* ── SVG ICONS ───────────────────────────────────────── */
  function moonIcon() {
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>`;
  }

  function sunIcon() {
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>`;
  }

  /* ── SYSTEM PREFERENCE (optional fallback) ───────────── */
  /* If user has never toggled, respect their OS preference */
  if (!saved) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      html.classList.add('dark');
    }
  }

  /* ── INIT ────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectToggle);
  } else {
    injectToggle();
  }

})();
