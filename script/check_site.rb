#!/usr/bin/env ruby

require "pathname"
require "uri"
require "yaml"

ROOT = Pathname.new(__dir__).join("..").realpath
SITE = ROOT.join("_site")
CONFIG = YAML.load_file(ROOT.join("_config.yml"))
BASE_URL = CONFIG.fetch("url").sub(%r{/\z}, "") + CONFIG.fetch("baseurl")

abort "_site is missing; run `bundle exec jekyll build` first." unless SITE.directory?
abort "url in _config.yml must be an absolute HTTPS URL." unless BASE_URL.match?(%r{\Ahttps://[^/]+(?:/.*)?\z})

def local_reference?(value)
  value && !value.empty? && !value.start_with?("#", "mailto:", "tel:", "data:", "javascript:", "http://", "https://", "//")
end

def target_for(page, value)
  path = value.split(/[?#]/, 2).first
  return nil if path.empty?

  candidate = path.start_with?("/") ? SITE.join(path.delete_prefix("/")) : page.dirname.join(path)
  candidate = candidate.join("index.html") if candidate.directory?
  candidate
end

errors = []

SITE.glob("**/*.html").sort.each do |page|
  html = page.read
  relative_path = "/" + page.relative_path_from(SITE).to_s.sub(%r{index\.html\z}, "")
  relative_path = "/" if relative_path == "/"
  expected_canonical = "#{BASE_URL}#{relative_path}"

  description = html[/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i, 1]
  canonical = html[/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i, 1]
  errors << "#{page}: missing non-empty meta description" if description.nil? || description.strip.empty?
  errors << "#{page}: canonical must be #{expected_canonical.inspect}, got #{canonical.inspect}" unless canonical == expected_canonical

  html.scan(/(?:href|src)=["']([^"']+)["']/i).flatten.each do |reference|
    next unless local_reference?(reference)

    target = target_for(page, reference)
    errors << "#{page}: broken local reference #{reference.inspect}" if target && !target.exist?
  end
end

if errors.empty?
  puts "Site quality check passed."
  exit 0
end

warn errors.join("\n")
exit 1
