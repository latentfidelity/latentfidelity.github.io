# Bugbot Review Instructions

This repository is a static GitHub Pages portfolio. Treat changes as user-facing web work.

Prioritize findings that would break the shipped site:

- Broken links, missing assets, incorrect relative paths, or pages that fail when served from the repository root.
- Responsive layout regressions, especially horizontal overflow, clipped text, or controls hidden behind other content on mobile widths from 320px upward.
- JavaScript errors, missing DOM guards, or interactions that fail when optional elements are absent.
- Accessibility regressions that block navigation or comprehension, such as unlabeled controls, invalid form labels, or unusable keyboard focus.
- Large generated assets that are committed but never referenced by HTML or CSS.

Do not flag purely subjective fidelity, branding, or copy changes unless they create a concrete functional problem.

For this repo, practical validation is:

- Serve from the repository root with `python3 -m http.server 8765`.
- Check `/`, `/web/`, `/web/runway/`, `/web/streaming/`, and `/web/commerce/`.
- Confirm images load, the browser console is clean, and `document.documentElement.scrollWidth === document.documentElement.clientWidth` at representative mobile widths.
