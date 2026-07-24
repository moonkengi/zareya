#!/usr/bin/env python3
"""
new_post.py — Zareya Insights authoring helper (Hermes automation).

Creates a new blog post as a draft in content/posts.json.
Usage:
    python3 scripts/new_post.py --title "..." --category "Brand Strategy" \
        --excerpt "..." --body-file article.md [--slug "..."] [--read-time 8]

Body format: Markdown-ish plain text. Blank line = paragraph break.
  '## ' at line start = subheading.  '> ' at line start = pull quote.

The post is added with published=false. Set published=true (or run with
--publish) to make it live, then deploy (scripts/deploy.sh).
"""
import argparse, json, os, sys, re, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS = os.path.join(ROOT, "content", "posts.json")

def slugify(title):
    return re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--title", required=True)
    ap.add_argument("--category", required=True)
    ap.add_argument("--excerpt", required=True)
    ap.add_argument("--body-file", required=True, help="Path to a .md/.txt file with the article body")
    ap.add_argument("--slug")
    ap.add_argument("--read-time", type=int, default=5)
    ap.add_argument("--publish", action="store_true")
    args = ap.parse_args()

    with open(args.body_file, encoding="utf-8") as f:
        body = f.read().strip()

    slug = args.slug or slugify(args.title)
    post = {
        "id": "post-" + re.sub(r"[^a-z0-9]", "", slug)[:12] + str(abs(hash(slug)) % 10000),
        "slug": slug,
        "title": args.title,
        "excerpt": args.excerpt,
        "category": args.category,
        "body": body,
        "meta_title": args.title + " — Zareya",
        "meta_description": args.excerpt,
        "published": bool(args.publish),
        "published_at": None if not args.publish else __import__("datetime").date.today().isoformat(),
        "read_time": args.read_time,
    }

    data = {"posts": []}
    if os.path.exists(POSTS):
        with open(POSTS, encoding="utf-8") as f:
            data = json.load(f)
    # reject duplicate slug
    if any(p.get("slug") == slug for p in data["posts"]):
        print(f"ERROR: slug '{slug}' already exists.", file=sys.stderr)
        sys.exit(1)
    data["posts"].append(post)
    with open(POSTS, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

    status = "PUBLISHED" if args.publish else "draft"
    print(f"Added '{args.title}' as {status} (slug: {slug})")
    print(f"Edit content/posts.json to tweak, then run scripts/deploy.sh to ship.")

if __name__ == "__main__":
    main()
