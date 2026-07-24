# Zareya automation — setup & status

## What's automated (Hermes, running on Kent's PC)
- **Content drafts:** every Monday 9:00 — Hermes drafts one Insights article, saves as DRAFT via scripts/new_post.py, commits + pushes to GitHub. Human approves publish (flip published:true in content/posts.json, then scripts/deploy.sh).
- **Deploy monitor:** every day 8:00 — checks whether the live site matches the repo (warns until Netlify is git-connected).
- **Lead capture:** scripts/leads.py reads Netlify Forms submissions (contact + newsletter) via the Netlify API. Needs NETLIFY_TOKEN + NETLIFY_SITE_ID.

## ⚠️ BLOCKER: live site is NOT git-connected
The live site (zareya.netlify.app / zareya.co.ke) is deployed from a MANUAL Netlify drag-drop upload, NOT from the GitHub repo. So:
- Pushes to github.com/moonkengi/zareya update GitHub, but do NOT reach the live site yet.
- The repo already contains: netlify.toml, robots.txt, sitemap.xml, content/posts.json, js/insights-feed.js, working article modal, scripts/.

### One-time fix (human action, ~2 min):
1. Netlify dashboard → Site settings → Build & deploy → Repository → **Connect to GitHub**.
2. Select repo `moonkengi/zareya`.
3. Build command: (leave empty)  ·  Publish directory: `website`
4. Save → trigger a deploy. After this, every git push auto-deploys.

## Lead capture — enable (needs free Netlify token):
1. https://app.netlify.com/user/applications → New access token → copy.
2. Find Site ID: Netlify dashboard → Site settings → General → Site ID.
3. Export in the running shell / cron env:
   export NETLIFY_TOKEN="nfp_xxx"
   export NETLIFY_SITE_ID="xxxxxxxx"
4. Run: python website/scripts/leads.py --form contact
   Add a cron job to run it daily and forward new leads to email/Slack (TBD).
