#!/usr/bin/env python3
"""
leads.py — Zareya lead capture reader (Hermes automation).

Pulls submissions from Netlify Forms (contact + newsletter) using the
Netlify API. Requires a Personal Access Token exported as NETLIFY_TOKEN.

Usage:
    export NETLIFY_TOKEN="nfp_xxx"          # your Netlify PAT (free)
    python3 scripts/leads.py                # list recent submissions (JSON)
    python3 scripts/leads.py --since 2026-07-01 --csv out.csv
    python3 scripts/leads.py --form contact --watch   # poll and print new ones

No token? Get one at: https://app.netlify.com/user/applications#personal-access-tokens
The site's Site ID is needed too — set NETLIFY_SITE_ID, or it's auto-dashbaord.
"""
import argparse, json, os, sys, urllib.request, urllib.error

API = "https://api.netlify.com/api/v1"
SITE_ID = os.environ.get("NETLIFY_SITE_ID", "")
TOKEN = os.environ.get("NETLIFY_TOKEN", "")

def auth_header():
    return {"Authorization": f"Bearer {TOKEN}", "Accept": "application/json"}

def api_get(path):
    req = urllib.request.Request(API + path, headers=auth_header())
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code}: {e.read().decode()[:300]}", file=sys.stderr)
        sys.exit(1)

def forms():
    return api_get(f"/sites/{SITE_ID}/forms")

def submissions(form_id, since=None):
    path = f"/forms/{form_id}/submissions"
    if since:
        path += f"?since={since}"
    return api_get(path)

def main():
    if not TOKEN:
        print("ERROR: set NETLIFY_TOKEN environment variable (free Netlify PAT).", file=sys.stderr)
        sys.exit(1)
    if not SITE_ID:
        print("ERROR: set NETLIFY_SITE_ID (found in Netlify dashboard → Site settings → General).", file=sys.stderr)
        sys.exit(1)

    ap = argparse.ArgumentParser()
    ap.add_argument("--form", default="contact", help="form name (contact | newsletter)")
    ap.add_argument("--since", help="ISO date, e.g. 2026-07-01")
    ap.add_argument("--csv", help="write results to this CSV path")
    args = ap.parse_args()

    fs = forms()
    target = next((f for f in fs if f.get("name") == args.form), None)
    if not target:
        print(f"Form '{args.form}' not found. Available: {[f.get('name') for f in fs]}", file=sys.stderr)
        sys.exit(1)

    subs = submissions(target["id"], args.since)
    print(json.dumps(subs, indent=2, ensure_ascii=False))
    if args.csv:
        import csv
        if subs:
            keys = list(subs[0].keys())
            with open(args.csv, "w", newline="", encoding="utf-8") as fh:
                w = csv.DictWriter(fh, fieldnames=keys)
                w.writeheader()
                w.writerows(subs)
            print(f"Wrote {len(subs)} rows to {args.csv}")

if __name__ == "__main__":
    main()
