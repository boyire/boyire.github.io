# Discoverability and Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every public page shareable, discoverable, faster to render, and dependable for keyboard and low-motion users.

**Architecture:** Extend the shared Jekyll head include with page-aware social and structured metadata, render a static sitemap through Liquid, and preserve the existing project-lab visual system. Modern image derivatives are used only for shared/header imagery, while legacy source files remain available for compatibility.

**Tech Stack:** Jekyll 4.4, Liquid, vanilla JavaScript, CSS, Ruby standard-library tests.

## Global Constraints

- Preserve existing routes, anchor IDs, navigation labels, and Chinese brand copy.
- Keep the public base URL as `https://boyire.github.io`.
- Do not add a client-side framework or third-party runtime dependency.
- Retain and extend `prefers-reduced-motion` behavior.

---

### Task 1: Test share and accessibility contracts

**Files:**
- Modify: `test/site_quality_test.rb`

- [ ] Add failing assertions for Open Graph, Twitter Card, JSON-LD, sitemap, deferred scripts, Chinese Manifest fields, and navigation accessibility contracts.
- [ ] Run `ruby test/site_quality_test.rb` and confirm the new assertions fail against the current build.

### Task 2: Add discovery metadata and sitemap

**Files:**
- Modify: `_includes/head.html`
- Modify: `_config.yml`
- Create: `sitemap.xml`

- [ ] Render page-aware Open Graph and Twitter metadata, using header imagery as the share image fallback.
- [ ] Render a `WebSite` JSON-LD object with the public site URL and Chinese language.
- [ ] Generate a sitemap covering indexable site pages and posts.
- [ ] Build the site and rerun the tests.

### Task 3: Improve media delivery and interaction accessibility

**Files:**
- Create: `img/home-bg.webp`
- Create: `img/404-bg.webp`
- Create: `img/tag-bg.webp`
- Modify: `_config.yml`
- Modify: `404.html`
- Modify: `tags.html`
- Modify: `pwa/manifest.json`
- Modify: `_includes/footer.html`
- Modify: `_includes/nav.html`
- Modify: `css/portfolio.css`

- [ ] Convert shared header images to WebP and switch only the matching header references.
- [ ] Add `defer` to non-critical theme scripts.
- [ ] Add a visible focus treatment and correct mobile-menu `aria-hidden`/Escape behavior.
- [ ] Keep all effect code disabled when reduced motion is requested.
- [ ] Build and run tests.

### Task 4: Verify generated output

**Files:**
- Test: `test/site_quality_test.rb`
- Test: `script/check_site.rb`

- [ ] Run `bundle exec jekyll build`, `ruby test/site_quality_test.rb`, `ruby script/check_site.rb`, and `bundle exec jekyll doctor`.
- [ ] Check generated metadata, sitemap, WebP references, and no malformed local references.
