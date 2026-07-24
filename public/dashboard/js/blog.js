/* ============================================================
   ZAREYA DASHBOARD — Blog / Insights
   CRUD operations for blog posts.
   Phase 0: uses localStorage as mock DB.
   TODO Phase 2: replace with Supabase calls.
   ============================================================ */

const POSTS_KEY = 'zareya-posts';

/* ── MOCK DATA ───────────────────────────────────────────── */
const SAMPLE_POSTS = [
  {
    id: 'post-1', slug: 'why-kenyan-brand-refreshes-fail',
    title: 'Why Most Kenyan Brand Refreshes Fail (and What to Do Instead)',
    excerpt: 'A rebrand is not a logo change. It\'s a strategic repositioning. Here\'s how to know the difference before you spend the budget.',
    category: 'Brand Strategy', body: 'Full article content goes here...',
    meta_title: 'Why Kenyan Brand Refreshes Fail — Zareya',
    meta_description: 'A rebrand is not a logo change. Learn the difference before you spend the budget.',
    published: true, published_at: '2026-02-01', read_time: 8, created_at: '2026-02-01'
  },
  {
    id: 'post-2', slug: 'tiktok-playbook-african-brands',
    title: 'The TikTok Playbook for African Brands: What Works, What Doesn\'t',
    excerpt: 'We\'ve run 23 TikTok campaigns for African brands. The results are counterintuitive.',
    category: 'Campaigns', body: 'Full article content goes here...',
    meta_title: 'TikTok Playbook for African Brands — Zareya',
    meta_description: 'What we\'ve learned running 23 TikTok campaigns for African brands.',
    published: true, published_at: '2026-01-15', read_time: 11, created_at: '2026-01-15'
  },
  {
    id: 'post-3', slug: 'gen-z-nairobi-consumer',
    title: 'Understanding Gen Z in Nairobi: The Consumer Brands Need to Win',
    excerpt: 'Primary research with 400 Nairobi Gen Z consumers. Their relationship with brands is fundamentally different.',
    category: 'Market Research', body: 'Full article content goes here...',
    meta_title: 'Understanding Gen Z in Nairobi — Zareya',
    meta_description: 'Primary research with 400 Nairobi Gen Z consumers on their relationship with brands.',
    published: false, published_at: null, read_time: 15, created_at: '2025-12-10'
  }
];

/* ── STORAGE HELPERS ─────────────────────────────────────── */
window.getPosts = function () {
  const raw = localStorage.getItem(POSTS_KEY);
  if (!raw) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(SAMPLE_POSTS));
    return SAMPLE_POSTS;
  }
  return JSON.parse(raw);
};

window.savePost = function (post) {
  const posts = getPosts();
  const idx = posts.findIndex(p => p.id === post.id);
  if (idx >= 0) {
    posts[idx] = post;
  } else {
    post.id = 'post-' + Date.now();
    post.created_at = new Date().toISOString().split('T')[0];
    posts.unshift(post);
  }
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  return post;
};

window.deletePost = function (id) {
  const posts = getPosts().filter(p => p.id !== id);
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
};

window.getPost = function (id) {
  return getPosts().find(p => p.id === id) || null;
};

window.togglePublish = function (id) {
  const posts = getPosts();
  const post = posts.find(p => p.id === id);
  if (post) {
    post.published = !post.published;
    post.published_at = post.published ? new Date().toISOString().split('T')[0] : null;
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }
  return post;
};

/* ── SLUG GENERATOR ──────────────────────────────────────── */
window.generateSlug = function (title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-');
};

/* ── CHAR COUNT ──────────────────────────────────────────── */
window.initCharCount = function (inputId, countId, max) {
  const input = document.getElementById(inputId);
  const count = document.getElementById(countId);
  if (!input || !count) return;
  const update = () => {
    const len = input.value.length;
    count.textContent = len + ' / ' + max;
    count.className = 'char-count' + (len > max ? ' over' : len > max * 0.9 ? ' warn' : '');
  };
  input.addEventListener('input', update);
  update();
};
