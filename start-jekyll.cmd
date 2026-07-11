@echo off
setlocal
cd /d "%~dp0"
bundle exec jekyll serve --host 127.0.0.1 --port 4000 --trace
