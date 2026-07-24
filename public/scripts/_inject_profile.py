#!/usr/bin/env python3
"""Inject profile.css link + profile.js script + footer 'Important Links' into all public pages.
Deterministic, idempotent. Run from website/ root: python scripts/_inject_profile.py
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PAGES = [f for f in os.listdir(ROOT) if f.endswith('.html') and f != 'sitemap.html']

PROFILE_CSS = '  <link rel="stylesheet" href="css/profile.css">\n'
PROFILE_JS  = '<script src="js/profile.js"></script>\n'

FOOTER_IMPORTANT = '''
      <div class="footer-col">
        <h4>Important Links</h4>
        <a href="sitemap.html">Site Map</a>
        <a href="privacy.html">Privacy &amp; Terms</a>
        <a href="links.html">Link in Bio</a>
        <a href="insights.html">The Zareya Letter</a>
      </div>
'''

changed = []
for page in PAGES:
    path = os.path.join(ROOT, page)
    s = open(path, encoding='utf-8').read()
    orig = s

    # 1) inject profile.css after the last css/components.css link
    if 'css/profile.css' not in s:
        s = s.replace('  <link rel="stylesheet" href="css/components.css">\n',
                      '  <link rel="stylesheet" href="css/components.css">\n' + PROFILE_CSS, 1)

    # 2) inject profile.js script after theme.js script
    if 'js/profile.js' not in s:
        s = s.replace('<script src="js/theme.js"></script>\n',
                      '<script src="js/theme.js"></script>\n' + PROFILE_JS, 1)

    # 3) inject Important Links footer column if a footer-col exists and not present
    if 'Important Links' not in s and 'class="footer-col"' in s:
        # insert before the closing </div> of footer-top (after last footer-col)
        s = s.replace('      <div class="footer-col">\n        <h4>Services</h4>',
                      FOOTER_IMPORTANT + '      <div class="footer-col">\n        <h4>Services</h4>', 1)

    if s != orig:
        open(path, 'w', encoding='utf-8').write(s)
        changed.append(page)

print("Injected into:", changed if changed else "NONE — already present?")
