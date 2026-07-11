# 项目实验室

基于 Jekyll 的静态个人项目主页，部署到 GitHub Pages：<https://boyire.github.io>。

## 环境要求

- Ruby 3.3
- Bundler 4

安装依赖：

```powershell
bundle install
```

首次在 Linux 或 macOS 上安装时，Bundler 会使用 `Gemfile.lock` 中的 Linux 平台依赖。若更新 Ruby 或依赖，请在 Windows 与 Linux 平台都重新生成并提交锁文件。

## 本地开发

构建静态站点：

```powershell
bundle exec jekyll build
```

启动带自动刷新的 Jekyll 服务：

```powershell
bundle exec jekyll serve --livereload
```

浏览器访问 <http://127.0.0.1:4000>。Windows 下也可以双击 `build-jekyll.cmd` 或 `start-jekyll.cmd`；它们不再依赖固定盘符。

构建完成后，如只想预览 `_site` 的静态文件：

```powershell
npm run preview
```

## 检查

运行项目质量测试：

```powershell
ruby test/site_quality_test.rb
```

运行构建产物检查（要求先构建）：

```powershell
ruby script/check_site.rb
```

该检查会验证每个页面都有 description 和 canonical URL，并检查生成站点中的本地资源引用。

## 发布

提交到 `master` 会触发 GitHub Actions。流水线依次安装 Ruby 依赖、构建 Jekyll、运行 `jekyll doctor`、检查生成站点，然后部署到 GitHub Pages。

发布前建议在本地执行：

```powershell
bundle exec jekyll build
bundle exec jekyll doctor
ruby test/site_quality_test.rb
ruby script/check_site.rb
```

## 常见问题

- `bundle` 找不到：确认 Ruby 和 Bundler 已加入 `PATH`，然后重新打开终端。
- `bundle install` 提示当前平台不在锁文件中：运行 `bundle lock --add-platform x86_64-linux`，并提交更新后的 `Gemfile.lock`。
- 页面仍显示旧内容：Service Worker 已更新时，请在浏览器开发者工具中更新或注销旧 Service Worker 后重载页面。
- `check_site.rb` 报本地引用错误：检查页面中的相对路径或以 `/` 开头的站点内路径，并重新构建后再检查。
