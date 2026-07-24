/* ============================================================
   ZAREYA — Animations
   Handles: scroll reveal, staggered children, counter
   animation on stats, hero parallax, marquee pause on hover
   ============================================================ */

(function () {

  /* ── SCROLL REVEAL ───────────────────────────────────── */
  /* Any element with class "reveal" fades + slides up
     when it enters the viewport.
     Add "reveal-delay-1/2/3/4" for staggered timing. */

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); /* only trigger once */
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -48px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });


  /* ── STAGGERED GRID CHILDREN ─────────────────────────── */
  /* When a .grid-2, .grid-3, or .grid-4 enters view,
     each direct child gets a staggered reveal delay */

  const gridObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.children;
        Array.from(children).forEach((child, i) => {
          if (!child.classList.contains('reveal')) {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            child.style.transition = `opacity 0.4s var(--ease) ${i * 0.08}s, transform 0.4s var(--ease) ${i * 0.08}s`;
            /* Force reflow then animate */
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
              });
            });
          }
        });
        gridObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08
  });

  document.querySelectorAll('.grid-2, .grid-3, .grid-4').forEach(grid => {
    /* Only stagger if children don't already have reveal class */
    const hasRevealChildren = grid.querySelector('.reveal');
    if (!hasRevealChildren) {
      gridObserver.observe(grid);
    }
  });


  /* ── COUNTER ANIMATION ───────────────────────────────── */
  /* Animates .stat-number elements from 0 to their value
     when they scroll into view */

  function animateCounter(el) {
    const text    = el.textContent;
    const num     = parseFloat(text.replace(/[^0-9.]/g, ''));
    const suffix  = text.replace(/[0-9.]/g, ''); /* +, %, yr, etc. */
    const duration = 1400;
    const start    = performance.now();
    const sup      = el.querySelector('sup');

    if (isNaN(num)) return;

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      /* Ease out cubic */
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * num);

      /* Rebuild content preserving sup tag */
      if (sup) {
        el.textContent = current;
        el.appendChild(sup);
      } else {
        el.textContent = current + suffix;
      }

      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => {
    counterObserver.observe(el);
  });


  /* ── HERO PARALLAX ───────────────────────────────────── */
  /* The decorative large Z drifts slightly on scroll */

  const heroZ = document.querySelector('#hero [style*="340px"]');
  if (heroZ) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroZ.style.transform = `translateY(calc(-50% + ${scrolled * 0.12}px))`;
    }, { passive: true });
  }


  /* ── PROCESS LIST HOVER ──────────────────────────────── */
  /* Arrow nudges right on hover — handled via CSS,
     but we add a class-based approach for reliability */

  document.querySelectorAll('.process-list-item').forEach(item => {
    const arrow = item.querySelector('.process-list-arrow');
    if (!arrow) return;
    item.addEventListener('mouseenter', () => {
      arrow.style.transform = 'translateX(6px)';
    });
    item.addEventListener('mouseleave', () => {
      arrow.style.transform = 'translateX(0)';
    });
  });


  /* ── SERVICE CARD HOVER ──────────────────────────────── */
  document.querySelectorAll('.service-card').forEach(card => {
    const arrow = card.querySelector('.service-arrow');
    if (!arrow) return;
    card.addEventListener('mouseenter', () => {
      arrow.style.transform = 'translateX(4px)';
    });
    card.addEventListener('mouseleave', () => {
      arrow.style.transform = 'translateX(0)';
    });
  });


  /* ── WORK CARD TILT ──────────────────────────────────── */
  /* Subtle 3D tilt on work cards on desktop only */

  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.work-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect   = card.getBoundingClientRect();
        const x      = (e.clientX - rect.left) / rect.width  - 0.5;
        const y      = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateZ(4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.4s var(--ease)';
      });
    });
  }


  /* ── MARQUEE PAUSE ON HOVER ──────────────────────────── */
  /* Already handled via CSS :hover rule in layout.css
     This adds touch support for mobile */

  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('touchstart', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    }, { passive: true });
    marqueeTrack.addEventListener('touchend', () => {
      marqueeTrack.style.animationPlayState = 'running';
    }, { passive: true });
  }


  /* ── INSIGHT CARD HOVER ──────────────────────────────── */
  document.querySelectorAll('.insight-card').forEach(card => {
    const img = card.querySelector('.insight-image');
    if (!img) return;
    card.addEventListener('mouseenter', () => {
      img.style.transform = 'translateY(-3px)';
      img.style.transition = 'transform 0.35s var(--ease)';
    });
    card.addEventListener('mouseleave', () => {
      img.style.transform = 'translateY(0)';
    });
  });


  /* ── TESTIMONIAL BORDER HIGHLIGHT ───────────────────── */
  document.querySelectorAll('.testimonial').forEach(t => {
    t.addEventListener('mouseenter', () => {
      t.style.borderColor = 'var(--border-3)';
    });
    t.addEventListener('mouseleave', () => {
      t.style.borderColor = '';
    });
  });


  /* ── INDUSTRY PILL RIPPLE ────────────────────────────── */
  document.querySelectorAll('.industry-pill').forEach(pill => {
    pill.addEventListener('click', function (e) {
      const rect   = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: var(--rose-18);
        width: 100px; height: 100px;
        top: ${e.clientY - rect.top - 50}px;
        left: ${e.clientX - rect.left - 50}px;
        transform: scale(0);
        animation: ripple 0.5s ease-out forwards;
        pointer-events: none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  /* Inject ripple keyframe */
  const style = document.createElement('style');
  style.textContent = `@keyframes ripple { to { transform: scale(3); opacity: 0; } }`;
  document.head.appendChild(style);

})();
