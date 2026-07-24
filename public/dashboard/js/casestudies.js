/* ============================================================
   ZAREYA DASHBOARD — Case Studies
   Phase 0: localStorage mock. TODO Phase 2: Supabase.
   ============================================================ */

const CS_KEY = 'zareya-casestudies';

const SAMPLE_CS = [
  {
    id:'cs-1', client:'Fika Finance', slug:'fika-finance',
    category:'Brand Identity',
    services:['Brand Strategy','Visual Identity','Brand Guidelines','Social Templates'],
    challenge:'Fika had built a strong fintech product but looked identical to every other startup. Generic logo, inconsistent messaging.',
    what_we_did:'Full Illumination — discovery, positioning architecture, logo system, colour palette, typography, brand voice, social templates.',
    result:'340% increase in organic sign-ups in the quarter following the rebrand.',
    client_quote:'"Zareya didn\'t just redesign our brand — they rebuilt how we think about ourselves." — Amara Diallo, CEO',
    gradient:'linear-gradient(145deg,#1A2436,#2D3E58)',
    thumb_label:'Fika', thumb_color:'rgba(100,160,255,0.32)',
    published:true, created_at:'2025-12-01'
  },
  {
    id:'cs-2', client:'Soko Organic', slug:'soko-organic',
    category:'Campaign',
    services:['Campaign Strategy','Meta Ads','TikTok Campaigns','Content Production','OOH Activation'],
    challenge:'Great product, zero brand presence, launching against established supermarket brands.',
    what_we_did:'6-month integrated launch campaign across Meta, TikTok and OOH. Brand messaging, creative concept, media buying.',
    result:'22,000 new customers in 90 days. CPA 40% below industry benchmark. 2.1M organic TikTok views.',
    client_quote:'"In 90 days we went from unknown to everywhere." — Grace Njoroge, CMO',
    gradient:'linear-gradient(145deg,#2A1A0A,#4A3010)',
    thumb_label:'Soko', thumb_color:'rgba(255,3,237,0.38)',
    published:true, created_at:'2025-11-01'
  }
];

window.getCaseStudies = function () {
  const raw = localStorage.getItem(CS_KEY);
  if (!raw) { localStorage.setItem(CS_KEY, JSON.stringify(SAMPLE_CS)); return SAMPLE_CS; }
  return JSON.parse(raw);
};

window.saveCaseStudy = function (cs) {
  const list = getCaseStudies();
  const idx = list.findIndex(c => c.id === cs.id);
  if (idx >= 0) { list[idx] = cs; }
  else { cs.id = 'cs-' + Date.now(); cs.created_at = new Date().toISOString().split('T')[0]; list.unshift(cs); }
  localStorage.setItem(CS_KEY, JSON.stringify(list));
  return cs;
};

window.deleteCaseStudy = function (id) {
  localStorage.setItem(CS_KEY, JSON.stringify(getCaseStudies().filter(c => c.id !== id)));
};

window.getCaseStudy = function (id) {
  return getCaseStudies().find(c => c.id === id) || null;
};

window.toggleCSPublish = function (id) {
  const list = getCaseStudies();
  const cs = list.find(c => c.id === id);
  if (cs) { cs.published = !cs.published; localStorage.setItem(CS_KEY, JSON.stringify(list)); }
  return cs;
};

/* Tag input helper */
window.initTagInput = function (wrapId, hiddenId, initial) {
  const wrap   = document.getElementById(wrapId);
  const hidden = document.getElementById(hiddenId);
  if (!wrap || !hidden) return;

  let tags = initial ? [...initial] : [];

  function render () {
    wrap.innerHTML = '';
    tags.forEach(tag => {
      const el = document.createElement('span');
      el.className = 'tag';
      el.innerHTML = tag + ' <span class="tag-remove" data-tag="' + tag + '">×</span>';
      wrap.appendChild(el);
    });
    const inp = document.createElement('input');
    inp.className = 'tag-bare-input';
    inp.placeholder = tags.length ? '' : 'Type a service and press Enter…';
    inp.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ',') && inp.value.trim()) {
        e.preventDefault();
        const val = inp.value.trim().replace(/,$/, '');
        if (val && !tags.includes(val)) { tags.push(val); render(); }
        else inp.value = '';
      }
      if (e.key === 'Backspace' && !inp.value && tags.length) {
        tags.pop(); render();
      }
    });
    wrap.appendChild(inp);
    wrap.querySelectorAll('.tag-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        tags = tags.filter(t => t !== btn.dataset.tag); render();
      });
    });
    hidden.value = JSON.stringify(tags);
  }

  wrap.addEventListener('click', () => wrap.querySelector('.tag-bare-input')?.focus());
  render();

  return { getTags: () => tags };
};
