# 内容编辑指南

## 编辑项目卡片

项目卡片存放在 `_data/projects.yml`。

- 项目还在本地开发时，保持 `href` 为空。
- 项目部署完成后，再填写 `href`。
- 公开链接准备好之前，`status` 保持为 `本地开发中`。
- `stack` 控制项目卡片底部的技术标签。

## 写博客文章

在 `_posts` 目录中新建文章，文件名格式如下：

```text
YYYY-MM-DD-title.md
```

文章开头使用下面的 front matter：

```yaml
---
layout: post
title: "文章标题"
subtitle: "简短摘要"
date: 2026-06-11
author: "项目实验室"
header-img: "img/home-bg-geek.jpg"
tags:
  - 笔记
---
```

提交修改后，GitHub Pages 会自动重新构建并发布站点。
