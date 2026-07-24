#!/usr/bin/env bash
# deploy.sh — Zareya auto-deploy (Hermes automation).
# Commits any changes in the public/ folder and pushes to GitHub → Netlify deploys.
# Safe: only stages website content, never force-pushes.
set -e
# Resolve to REPO root: this script lives at <repo>/website/scripts/deploy.sh
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"
echo "Deploy working dir: $REPO_ROOT"

MSG="${1:-Automated update via Hermes}"

git add public
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
