# Introduction
This repository contains the server-side source code for the "Smart Cities" project, which has the goal of researching/prototyping ephemeral location-based services.
# Installation
# Features
# API
# Architecture
The architekture can be roughly split into web frontend, node.js application server and CouchDB database.

The frontend uses both parts of the public API as well as its own API, which means that the application server is responsible for

* serving the frontend webpage files,
* providing the public API,
* communicating with the database server and
* providing additional API URLs for the frontend.

The database server is never contacted by the frontend or another application directly and may be configured to be inaccessible to external requests.

# Future Work and Limitations
# Group
