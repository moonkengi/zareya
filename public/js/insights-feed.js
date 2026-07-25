/* ============================================================
   ZAREYA — Insights Feed
   Loads content/posts.json and renders:
     • the posts grid on insights.html
     • a working article modal (openPost / closePost)
   Hardened so the grid is NEVER blank:
     • cards are shown immediately (no dependence on reveal/JS animation)
     • explicit empty/error states with retry
   ============================================================ */

(function () {
  const GRID = document.getElementById('posts-grid');
  const FEATURED = document.getElementById('featured');
  let POSTS = [];

  function categoryClass(cat) {
    return 'cat-' + (cat || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function excerptPreview(body, n) {
    const text = (body || '').replace(/\n+/g, ' ').trim();
    return text.length > n ? text.slice(0, n).trim() + '…' : text;
  }

  function renderGrid() {
    if (!GRID) return;
    const published = POSTS.filter(p => p.published);
    if (!published.length) {
      GRID.innerHTML = '<p style="color:var(--text-3);grid-column:1/-1;padding:40px 0;text-align:center;">No published insights yet — check back soon.</p>';
      return;
    }
    GRID.innerHTML = published.map((p, i) => `
      <div class="insight-card visible ${i ? 'reveal-delay-' + (i % 3) : ''}" data-cat="${categoryClass(p.category)}" onclick="openPost('${p.id}')">
        <div class="insight-image" style="background: linear-gradient(135deg, #1A2436, #2D3E58);">${p.category || 'Insight'}</div>
        <div class="insight-category">${p.category || ''}</div>
        <div class="insight-title">${p.title}</div>
        <div class="insight-excerpt">${p.excerpt || excerptPreview(p.body, 160)}</div>
        <div class="insight-meta"><span>${p.published_at || ''}</span><span>·</span><span>${p.read_time || ''} min</span></div>
      </div>`).join('');
  }

  function renderFeatured() {
    if (!FEATURED) return;
    const featured = POSTS.find(p => p.published) || POSTS[0];
    if (!featured) return;
    FEATURED.setAttribute('onclick', `openPost('${featured.id}')`);
    const titleEl = FEATURED.querySelector('.insight-featured-title');
    const bodyEl = FEATURED.querySelector('.insight-featured-body p');
    const metaEl = FEATURED.querySelector('.insight-featured-body div[style*="text-transform"]');
    if (titleEl) titleEl.textContent = featured.title;
    if (bodyEl) bodyEl.textContent = featured.excerpt || '';
    if (metaEl) metaEl.textContent = `${featured.published_at || ''} · ${featured.read_time || ''} min read`;
  }

  window.filterPosts = function (filter, btn) {
    document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    document.querySelectorAll('#posts-grid .insight-card').forEach(card => {
      const show = filter === 'all' || card.getAttribute('data-cat') === 'cat-' + filter;
      card.style.display = show ? '' : 'none';
    });
  };

  window.openPost = function (id) {
    const post = POSTS.find(p => p.id === id || p.slug === id);
    if (!post) return;
    const hero = document.getElementById('post-hero');
    const cat = document.getElementById('post-cat');
    const title = document.getElementById('post-title');
    const meta = document.getElementById('post-meta');
    const body = document.getElementById('post-body');
    if (cat) cat.textContent = post.category || '';
    if (title) title.textContent = post.title;
    if (meta) meta.textContent = `${post.published_at || ''} · ${post.read_time || ''} min read`;
    if (hero) hero.textContent = (post.category || '✦').slice(0, 1).toUpperCase();
    if (body) {
      body.innerHTML = (post.body || '')
        .split(/\n{2,}/)
        .map(block => {
          if (block.startsWith('## ')) return `<h2>${block.slice(3)}</h2>`;
          if (block.startsWith('> ')) return `<blockquote>${block.slice(2)}</blockquote>`;
          return `<p>${block.replace(/\n/g, ' ')}</p>`;
        }).join('');
    }
    const overlay = document.getElementById('post-modal-overlay');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closePost = function () {
    const overlay = document.getElementById('post-modal-overlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  function load() {
    fetch('content/posts.json', { cache: 'no-cache' })
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(text => {
        if (!text || !text.trim()) throw new Error('empty response');
        const data = JSON.parse(text);
        POSTS = (data && data.posts) || [];
        renderFeatured();
        renderGrid();
      })
      .catch(err => {
        console.warn('Insights feed failed to load:', err);
        if (GRID) GRID.innerHTML = '<p style="color:var(--text-3);grid-column:1/-1;padding:40px 0;text-align:center;">Could not load insights right now. <a href="content/posts.json">Open the feed directly</a>.</p>';
      });
  }

  load();
})();
