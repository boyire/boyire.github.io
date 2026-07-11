require "open3"
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
  assert(!manifest.include?("{{ site.baseurl }}"), "manifest must not publish unresolved Liquid")
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
