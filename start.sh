#!/bin/bash
cd /Library/WebServer/Documents
sudo ln -s ~/surfspots/ .
sudo apachectl start
open http://localhost/surfspots
tail -f /var/log/apache2/error_log f /var/log/apache2/access_log
