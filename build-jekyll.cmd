@echo off
set "GEM_HOME=D:\Ruby33-x64\gems"
set "GEM_PATH=D:\Ruby33-x64\gems"
set "PATH=D:\Ruby33-x64\bin;D:\Ruby33-x64\gems\bin;%PATH%"
cd /d D:\blog
jekyll build --trace
