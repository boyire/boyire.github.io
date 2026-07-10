# 内容维护指南

## 编辑权限模型

这个站点是 GitHub Pages/Jekyll 静态站点，不在网页前端提供登录、编辑器或后台数据库。

只有拥有 `boyire/boyire.github.io` 仓库写权限的人，或者持有本机 SSH key/有效 GitHub token 的人，才能修改内容并发布。普通访客只能访问 GitHub Pages 生成后的静态页面，不能直接编辑文章、项目或友链。

不要把编辑入口、token、邮箱、私人仓库地址或未部署项目链接写进前端页面。

## 添加笔记

在 `_posts` 目录中新建 Markdown 文件，命名格式：

```text
YYYY-MM-DD-title.md
```

文章开头使用 front matter：

```yaml
---
layout: post
title: "文章标题"
subtitle: "简短摘要"
date: 2026-07-04
author: "项目实验室"
header-img: "img/home-bg-geek.jpg"
tags:
  - 笔记
---
```

写完后运行：

```bat
D:\blog\build-jekyll.cmd
```

构建通过后提交并推送：

```bash
git -C D:\blog add -A
git -C D:\blog commit -m "Add new note"
git -C D:\blog push git@github.com:boyire/boyire.github.io.git master
```

## 维护项目卡片

项目卡片存放在 `_data/projects.yml`。

- 项目还在本地开发时，保持 `href: ""`。
- 项目部署完成后，再填写公开链接。
- 公开链接准备好之前，`status` 保持为 `本地开发中`。
- `stack` 控制项目卡片底部的技术标签。

## 维护友链

友链存放在 `_data/friends.yml`。确认对方链接可公开后，再添加：

```yaml
- name: "站点名称"
  description: "一句话介绍这个站点。"
  url: "https://example.com"
  tag: "Blog"
```

`_data/friends.yml` 为空时，首页会显示“友链整理中”的空状态。
