#!/bin/bash

# This is for Mac OS X only.

sudo ln -s `pwd` /Library/WebServer/Documents/surfspots
sudo apachectl start
open http://localhost/surfspots
# or http://localhost/surfspots/home.html if you don't have php enabled

# optionally, to watch logs:
tail -f /var/log/apache2/error_log f /var/log/apache2/access_log
