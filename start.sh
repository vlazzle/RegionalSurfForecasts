#!/bin/bash
cd /Library/WebServer/Documents
sudo ln -s ~/surfspots/ .
sudo apachectl start
open http://localhost/surfspots
# or http://localhost/surfspots/home.html if you don't have php enabled
tail -f /var/log/apache2/error_log f /var/log/apache2/access_log
