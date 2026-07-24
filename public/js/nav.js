/* ============================================================
   ZAREYA — Navigation
   Handles: scroll state, active link, mobile menu,
   smooth scroll, page transition fade
   ============================================================ */

(function () {

  /* ── SCROLL STATE ────────────────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /* ── ACTIVE NAV LINK ─────────────────────────────────── */
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });


  /* ── MOBILE MENU ─────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('nav-mobile');

  window.toggleNav = function () {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  document.addEventListener('click', e => {
    if (
      mobileNav &&
      mobileNav.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });


  /* ── PAGE TRANSITION ─────────────────────────────────── */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (
      href &&
      href.endsWith('.html') &&
      !href.startsWith('http') &&
      !href.startsWith('#')
    ) {
      link.addEventListener('click', e => {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.18s ease';
        setTimeout(() => { window.location.href = href; }, 180);
      });
    }
  });

  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.28s ease';
  window.addEventListener('load', () => { document.body.style.opacity = '1'; });
  if (document.readyState === 'complete') { document.body.style.opacity = '1'; }


  /* ── SMOOTH SCROLL ───────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
