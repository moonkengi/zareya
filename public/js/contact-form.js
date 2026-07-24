/* ============================================================
   ZAREYA — Contact Form + Newsletter
   Netlify Forms handles data capture.
   JS handles UX: validation, loading states, success screen.
   ============================================================ */

(function () {

  /* ── TOAST ───────────────────────────────────────────── */
  window.toast = function (message, duration) {
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), duration || 2800);
  };


  /* ── NEWSLETTER SUBMIT ───────────────────────────────── */
  /* Called by each newsletter form's onsubmit.
     Submits to Netlify via fetch, shows toast, clears input. */

  window.handleNewsletter = async function (e, form) {
    e.preventDefault();

    const emailInput = form.querySelector('input[type="email"]');
    const btn        = form.querySelector('button[type="submit"]');
    const email      = emailInput ? emailInput.value.trim() : '';

    if (!email || !email.includes('@') || !email.includes('.')) {
      toast('Please enter a valid email address.');
      return;
    }

    const originalText = btn.textContent;
    btn.textContent = '…';
    btn.disabled = true;

    try {
      const body = new URLSearchParams({ 'form-name': 'newsletter', email });
      await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
      toast('Subscribed. Welcome to The Zareya Letter.');
      emailInput.value = '';
    } catch (err) {
      toast('Something went wrong. Please try again.');
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  };


  /* ── CONTACT FORM SUBMIT ─────────────────────────────── */
  const form      = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const success   = document.getElementById('form-success');

  if (!form) return; /* not on contact page */

  /* Real-time field validation */
  form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.dataset.touched) validateField(field);
    });
  });

  function validateField(field) {
    field.dataset.touched = 'true';
    const empty   = !field.value.trim();
    const badEmail = field.type === 'email' && field.value && (!field.value.includes('@') || !field.value.includes('.'));
    field.style.borderBottomColor = (empty || badEmail) ? '#e05050' : 'var(--rose)';
  }

  /* Form submit */
  window.submitForm = async function (e) {
    if (e) e.preventDefault();

    const firstName = document.getElementById('first-name')?.value.trim();
    const email     = document.getElementById('email')?.value.trim();
    const service   = document.getElementById('service')?.value;
    const message   = document.getElementById('message')?.value.trim();

    if (!firstName) { toast('Please enter your first name.'); return; }
    if (!email || !email.includes('@')) { toast('Please enter a valid email address.'); return; }
    if (!service)   { toast('Please select the service you need.'); return; }
    if (!message || message.length < 20) { toast('Please tell us a bit more about your project.'); return; }

    /* Loading state */
    if (submitBtn) {
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled    = true;
      submitBtn.style.opacity = '0.7';
    }

    try {
      /* Submit to Netlify Forms */
      const formData = new FormData(form);
      formData.set('form-name', 'contact');

      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });

      /* Show success state */
      form.style.opacity    = '0';
      form.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        form.style.display = 'none';
        if (success) {
          success.classList.add('show');
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);

    } catch (err) {
      toast('Something went wrong. Please email us at hello@zareya.co.ke');
      if (submitBtn) {
        submitBtn.textContent = 'Send enquiry ↗';
        submitBtn.disabled    = false;
        submitBtn.style.opacity = '1';
      }
    }
  };

  form.addEventListener('submit', window.submitForm);

  /* Char counter on message textarea */
  const textarea = document.getElementById('message');
  if (textarea) {
    const counter = document.createElement('div');
    counter.style.cssText = 'font-size:11px;color:var(--text-3);text-align:right;margin-top:5px;transition:color 0.2s;';
    textarea.parentNode.appendChild(counter);
    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      counter.textContent = len < 20 ? `${20 - len} more characters needed` : `${len} characters`;
      counter.style.color = len < 20 ? '#e05050' : 'var(--text-3)';
    });
  }

  /* WhatsApp link prefill with name */
  const waLink = document.querySelector('a[href*="wa.me"]');
  if (waLink) {
    const nameInput = document.getElementById('first-name');
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        const name = nameInput.value.trim();
        const msg  = name
          ? `Hi Zareya, I'm ${name} and I'd like to talk about a brand project.`
          : `Hi Zareya, I'd like to talk about a brand project.`;
        waLink.href = 'https://wa.me/254706815149?text=' + encodeURIComponent(msg);
      });
    }
  }

})();
