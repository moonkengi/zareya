/* ============================================================
   ZAREYA DASHBOARD — SEO Settings
   Phase 0: localStorage. TODO Phase 2: Supabase seo_pages table.
   ============================================================ */

const SEO_KEY = 'zareya-seo';

const DEFAULT_SEO = {
  home:         { page:'Home',                file:'index.html',    meta_title:'Zareya — African Brands, Brilliantly Told', meta_description:'Zareya is a brand and marketing agency for African businesses. We build brand identities that are distinctly African and globally competitive.' },
  process:      { page:'The Process',          file:'process.html',  meta_title:'The Illumination Process — Zareya', meta_description:'Every Zareya engagement follows the same rigorous methodology. Four phases. Zero guesswork. One standard: the work must illuminate something true about your brand.' },
  services:     { page:'Services',             file:'services.html', meta_title:'Services — Zareya', meta_description:'Brand strategy, visual identity, campaigns, content, websites, and market research — built for African businesses.' },
  work:         { page:'Work',                 file:'work.html',     meta_title:'Work — Zareya', meta_description:'Selected work from Zareya — brand identities, campaigns, and digital presence built for African businesses.' },
  insights:     { page:'Insights',             file:'insights.html', meta_title:'Insights — Zareya', meta_description:'Brand and marketing thinking from Zareya — perspectives on African business, brand strategy, and what makes campaigns work.' },
  about:        { page:'About',                file:'about.html',    meta_title:'About — Zareya', meta_description:'Zareya is a brand and marketing agency founded in Nairobi. We exist to make African businesses look, sound, and feel as powerful as they actually are.' },
  contact:      { page:'Contact',              file:'contact.html',  meta_title:'Contact — Zareya', meta_description:'Start a project with Zareya. Tell us about your brand and what you need — we respond within 24 hours.' },
  links:        { page:'Link in Bio',          file:'links.html',    meta_title:'Zareya — African Brands, Brilliantly Told', meta_description:'Zareya is a brand and marketing agency for African businesses. Book a discovery call or explore our work.' },
};

window.getSEO = function () {
  const raw = localStorage.getItem(SEO_KEY);
  if (!raw) { localStorage.setItem(SEO_KEY, JSON.stringify(DEFAULT_SEO)); return DEFAULT_SEO; }
  return JSON.parse(raw);
};

window.saveSEO = function (pageKey, data) {
  const all = getSEO();
  all[pageKey] = { ...all[pageKey], ...data };
  localStorage.setItem(SEO_KEY, JSON.stringify(all));
};

window.getSEOScore = function (title, desc) {
  let score = 0;
  if (title && title.length >= 30 && title.length <= 60) score += 40;
  else if (title && title.length > 0) score += 20;
  if (desc && desc.length >= 120 && desc.length <= 160) score += 60;
  else if (desc && desc.length > 0) score += 30;
  return score;
};
