# Site Foundation Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Jekyll site reliably buildable on Windows and GitHub Pages, correctly indexed, and genuinely usable offline.

**Architecture:** Keep the existing static Jekyll architecture. Add a small Ruby standard-library quality gate that validates the built `_site` output; invoke it locally and in GitHub Actions after Jekyll builds. Service Worker caching is limited to this site's named caches, with a precache for offline shell assets and network-first navigation fallback.

**Tech Stack:** Jekyll 4.4, Ruby standard library/Minitest, GitHub Actions, vanilla Service Worker.

## Global Constraints

- Keep deployment target as `https://boyire.github.io` with `baseurl: ""`.
- Do not introduce a JavaScript package manager or external test dependency.
- Preserve all existing public routes.
- Every changed runtime behavior must have an automated verification.

---

### Task 1: Add site quality gate

**Files:**
- Create: `script/check_site.rb`
- Create: `test/site_quality_test.rb`
- Modify: `.github/workflows/pages.yml`

- [ ] Write failing tests for canonical URL, per-page description, and local asset references.
- [ ] Run `ruby -Itest test/site_quality_test.rb` and confirm failure because the checker does not exist.
- [ ] Implement `script/check_site.rb` using Ruby standard library parsing and file checks.
- [ ] Run tests and checker against `_site`; confirm success.
- [ ] Run the same checker in GitHub Actions after the Jekyll build.

### Task 2: Make metadata and local setup portable

**Files:**
- Modify: `_config.yml`
- Modify: `_includes/head.html`
- Modify: `pwa/manifest.json`
- Modify: `build-jekyll.cmd`
- Modify: `start-jekyll.cmd`
- Modify: `start-jekyll-log.cmd`
- Modify: `package.json`
- Modify: `Gemfile.lock`

- [ ] Add failing metadata assertions to the quality tests.
- [ ] Configure URL/base URL and page-aware descriptions, then make the manifest match the Chinese site identity.
- [ ] Replace fixed Ruby paths with `bundle exec` commands and make npm preview scripts Python 3 compatible.
- [ ] Add `x86_64-linux` to the lockfile using Bundler.
- [ ] Rebuild and run the quality gate.

### Task 3: Repair PWA cache lifecycle

**Files:**
- Modify: `sw.js`
- Test: `test/site_quality_test.rb`

- [ ] Add a failing source-level behavior test: activation preserves current cache and fetches can fall back to precached assets.
- [ ] Implement versioned precache, selective old-cache cleanup, cache-first static assets, and network-first navigation with offline fallback.
- [ ] Run tests, build, and quality gate.

### Task 4: Document the workflow

**Files:**
- Modify: `README.md`

- [ ] Add setup, build, preview, deployment, CI, and troubleshooting instructions.
- [ ] Rebuild and run the full local verification sequence documented in the README.
