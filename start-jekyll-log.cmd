@echo off
setlocal
cd /d "%~dp0"
if not exist logs mkdir logs
bundle exec jekyll serve --host 127.0.0.1 --port 4000 --trace --no-watch > logs\jekyll-serve.log 2>&1
