# Content Editing Guide

## Edit Project Cards

Project cards are stored in `_data/projects.yml`.

- Keep `href` empty while a project is still local.
- Fill `href` only after the project is deployed.
- Keep `status` as `本地开发中` until the public link is ready.
- `stack` controls the small technology tags.

## Write Blog Posts

Create posts in `_posts` with this filename format:

```text
YYYY-MM-DD-title.md
```

Use this front matter:

```yaml
---
layout: post
title: "Post title"
subtitle: "Short summary"
date: 2026-06-11
author: "Project Lab"
header-img: "img/home-bg-geek.jpg"
tags:
  - Notes
---
```

After committing changes, GitHub Pages rebuilds and publishes the site automatically.
