require "open3"
require "json"
require "yaml"

ROOT = File.expand_path("..", __dir__)

def assert(condition, message)
  raise message unless condition
end

def test_config_uses_the_public_site_url
  config = YAML.load_file(File.join(ROOT, "_config.yml"))

  assert(config.fetch("url") == "https://boyire.github.io", "url must be https://boyire.github.io")
  assert(config.fetch("baseurl") == "", "baseurl must be empty")
end

def test_lockfile_declares_the_linux_build_platform
  lockfile = File.read(File.join(ROOT, "Gemfile.lock"))

  assert(lockfile.match?(/^  x86_64-linux$/), "Gemfile.lock must declare x86_64-linux")
end

def test_generated_pages_expose_page_specific_metadata
  about = File.read(File.join(ROOT, "_site", "about", "index.html"))

  assert(about.include?('<meta name="description" content="这个站点用来记录什么。">'), "about page must use its own description")
  assert(about.include?('<link rel="canonical" href="https://boyire.github.io/about/">'), "about page must have its public canonical URL")
end

def test_generated_manifest_uses_the_site_base_url_and_chinese_identity
  manifest = File.read(File.join(ROOT, "_site", "pwa", "manifest.json"))

  assert(manifest.include?('"name": "项目实验室 | 项目与笔记"'), "manifest must use the site identity")
  assert(manifest.include?('"start_url": "/"'), "manifest must render the configured base URL")
  assert(manifest.include?('"lang": "zh-CN"'), "manifest must declare Chinese as its language")
  assert(!manifest.include?("{{ site.baseurl }}"), "manifest must not publish unresolved Liquid")
end

def test_generated_homepage_exposes_share_and_structured_metadata
  homepage = File.read(File.join(ROOT, "_site", "index.html"))

  assert(homepage.include?('<meta property="og:type" content="website">'), "homepage must expose an Open Graph type")
  assert(homepage.include?('<meta property="og:url" content="https://boyire.github.io/">'), "homepage must expose its public Open Graph URL")
  assert(homepage.include?('<meta property="og:image" content="https://boyire.github.io/img/home-bg.jpg">'), "homepage must use a broadly supported share image")
  assert(homepage.include?('<meta name="twitter:card" content="summary_large_image">'), "homepage must expose a Twitter Card")

  json_ld = homepage[/<script type="application\/ld\+json">\s*(.*?)\s*<\/script>/m, 1]
  assert(!json_ld.nil?, "homepage must expose JSON-LD")
  structured_data = JSON.parse(json_ld)
  assert(structured_data.fetch("@type") == "WebSite", "JSON-LD must describe a WebSite")
  assert(structured_data.fetch("inLanguage") == "zh-CN", "JSON-LD must declare Chinese")
end

def test_generated_sitemap_includes_public_pages
  sitemap = File.read(File.join(ROOT, "_site", "sitemap.xml"))

  assert(sitemap.include?("https://boyire.github.io/"), "sitemap must include the homepage")
  assert(sitemap.include?("https://boyire.github.io/about/"), "sitemap must include the about page")
end

def test_generated_assets_prefer_webp_and_defer_noncritical_scripts
  homepage = File.read(File.join(ROOT, "_site", "index.html"))

  assert(File.exist?(File.join(ROOT, "_site", "img", "home-bg.webp")), "generated site must include the WebP hero image")
  assert(homepage.include?('<script src="/js/portfolio-effects.js?v=20260713-1" defer></script>'), "portfolio effects must defer")
  assert(homepage.include?('<script src="/js/jquery.min.js" defer></script>'), "jQuery must defer")
end

def test_navigation_keeps_keyboard_and_reduced_motion_contracts
  navigation = File.read(File.join(ROOT, "_includes", "nav.html"))
  stylesheet = File.read(File.join(ROOT, "css", "portfolio.css"))
  effects = File.read(File.join(ROOT, "js", "portfolio-effects.js"))

  assert(navigation.include?("aria-hidden=\"true\""), "mobile navigation must expose its hidden state")
  assert(navigation.include?("window.matchMedia('(max-width: 767px)')"), "desktop navigation must remain available to assistive technology")
  assert(navigation.include?("event.key === \"Escape\""), "mobile navigation must close with Escape")
  assert(stylesheet.include?(":focus-visible"), "site controls must have a visible keyboard focus treatment")
  assert(stylesheet.include?("@media (prefers-reduced-motion: reduce)"), "stylesheet must preserve reduced-motion handling")
  assert(effects.include?("prefers-reduced-motion: reduce"), "effects must remain disabled for reduced motion")
end

def test_service_worker_keeps_its_current_cache_and_precaches_offline_page
  service_worker = File.read(File.join(ROOT, "sw.js"))

  assert(service_worker.include?("cache.addAll(PRECACHE_URLS)"), "service worker must precache its offline shell")
  assert(service_worker.include?("key.startsWith(CACHE_PREFIX)"), "service worker must identify its own stale caches")
  assert(service_worker.include?("key !== PRECACHE"), "service worker must preserve its current precache")
end

def test_quality_checker_accepts_the_built_site
  output, status = Open3.capture2e("ruby", "script/check_site.rb", chdir: ROOT)

  assert(status.success?, output)
end

tests = private_methods.grep(/^test_/).sort
failures = tests.filter_map do |test|
  send(test)
  puts "PASS #{test}"
  nil
rescue StandardError => error
  puts "FAIL #{test}: #{error.message}"
  test
end

exit(failures.empty? ? 0 : 1)
