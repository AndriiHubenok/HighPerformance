#!/bin/sh

CONTAINER_ALREADY_STARTED="CONTAINER_ALREADY_STARTED_PLACEHOLDER"
if [ ! -e $CONTAINER_ALREADY_STARTED ]; then
  touch $CONTAINER_ALREADY_STARTED
  echo "-- First container startup --"
  /wait
  /var/www/html/installer/cli_install.sh
  mysql --user=orangehrm --password=orangehrm --host=mariadb orangehrm </export.sql
else
  echo "-- Not first container startup --"
fi
