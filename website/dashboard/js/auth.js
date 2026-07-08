/* ============================================================
   ZAREYA DASHBOARD — Auth
   Simple password-based session for Phase 0.
   TODO Phase 2: replace with Supabase Auth
   ============================================================ */

const DASH_KEY    = 'zareya-dashboard-auth';
const DASH_USER   = 'zareya-dashboard-user';

/* ── CHECK SESSION ───────────────────────────────────────── */
/* Call on every dashboard page load to guard access */
window.requireAuth = function (redirectTo) {
  const authed = localStorage.getItem(DASH_KEY);
  if (!authed) {
    const back = redirectTo || window.location.href;
    window.location.href = rootPath() + 'index.html?redirect=' + encodeURIComponent(back);
  }
};

/* ── LOGIN ───────────────────────────────────────────────── */
/* Phase 0: password stored as plain text placeholder.
   TODO Phase 2: replace with supabase.auth.signInWithPassword() */
window.dashLogin = async function (password) {
  /* Temporary hardcoded password — change this before going live */
  const TEMP_PASSWORD = 'zareya2026';

  if (password === TEMP_PASSWORD) {
    localStorage.setItem(DASH_KEY, 'true');
    localStorage.setItem(DASH_USER, JSON.stringify({ name: 'Kent', role: 'Admin' }));

    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    window.location.href = redirect || rootPath() + 'home.html';
    return true;
  }
  return false;
};

/* ── LOGOUT ──────────────────────────────────────────────── */
window.dashLogout = function () {
  localStorage.removeItem(DASH_KEY);
  localStorage.removeItem(DASH_USER);
  window.location.href = rootPath() + 'index.html';
};

/* ── GET USER ────────────────────────────────────────────── */
window.getUser = function () {
  const raw = localStorage.getItem(DASH_USER);
  return raw ? JSON.parse(raw) : { name: 'Kent', role: 'Admin' };
};

/* ── HELPER: root path ───────────────────────────────────── */
/* Works whether file is in /dashboard/ or /dashboard/blog/ etc */
function rootPath () {
  const path = window.location.pathname;
  const depth = (path.match(/\//g) || []).length;
  /* index.html is at depth 2 (/dashboard/index.html) */
  if (depth <= 2) return './';
  return '../';
}
window._rootPath = rootPath;

/* ── POPULATE USER IN SIDEBAR ────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const user = getUser();
  const nameEl = document.getElementById('sb-user-name');
  const roleEl = document.getElementById('sb-user-role');
  const initEl = document.getElementById('sb-avatar');
  if (nameEl) nameEl.textContent = user.name;
  if (roleEl) roleEl.textContent = user.role;
  if (initEl) initEl.textContent = (user.name || 'K')[0].toUpperCase();
});
