#!/bin/bash
sudo pkill -9 ruby1.9.1 & > /dev/null 2>&1
cd /vagrant
bundle exec jekyll serve --port 8000 --no-watch --detach
