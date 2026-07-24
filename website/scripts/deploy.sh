#!/usr/bin/env bash
# deploy.sh — Zareya auto-deploy (Hermes automation).
# Commits any changes in the website/ folder and pushes to GitHub → Netlify deploys.
# Safe: only stages website content, never force-pushes.
set -e
cd "$(dirname "$0")/.."   # repo root

MSG="${1:-Automated update via Hermes}"

git add website
# If nothing to commit, exit cleanly (no error, no empty push).
if git diff --cached --quiet; then
  echo "No changes to deploy."
  exit 0
fi

git -c user.name='Hermes' -c user.email='hermes@local' commit -q -m "$MSG"
# Rebase in case the remote moved ahead.
git pull --rebase origin main
git push origin main
echo "Deployed: $MSG"
