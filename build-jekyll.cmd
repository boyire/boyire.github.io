@echo off
setlocal
cd /d "%~dp0"
bundle exec jekyll build --trace
