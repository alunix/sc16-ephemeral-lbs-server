#!/usr/bin/env bash

sudo apt-get update
sudo apt-get upgrade

# Installing CouchDB
# based on https://www.digitalocean.com/community/tutorials/how-to-install-couchdb-and-futon-on-ubuntu-14-04
sudo add-apt-repository ppa:couchdb/stable -y
sudo apt-get update
sudo apt-get install couchdb -y
sudo stop couchdb
sudo chown -R couchdb:couchdb /usr/lib/couchdb /usr/share/couchdb /etc/couchdb /usr/bin/couchdb
sudo chmod -R 0770 /usr/lib/couchdb /usr/share/couchdb /etc/couchdb /usr/bin/couchdb
sudo start couchdb

# Installing nodejs
# https://nodejs.org/en/download/package-manager/
# LTS:
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get update
sudo apt-get install nodejs -y
# To compile and install native addons from npm
sudo apt-get install -y build-essential

# Creating Databases
curl -X PUT localhost:5984/zones
curl -X PUT localhost:5984/messages

# setup project
cd /vagrant
npm install
