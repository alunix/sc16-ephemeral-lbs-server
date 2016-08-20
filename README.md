# Introduction
This repository contains the server-side source code for the "Smart Cities" project, which has the goal of researching/prototyping ephemeral location-based services.
# Installation
# Features
The server provides two basic functionalities:
* a public API for the mobile application (and other potential message clients) to gather available zones and store/retrieve corresponding messages
* a web frontend which enables the creation and exploration of zones
# API
# Architecture
The architecture can be roughly split into web frontend, node.js application server and CouchDB database.

The frontend uses both parts of the public API as well as its own API, which means that the application server is responsible for

* serving the frontend webpage files,
* providing the public API,
* communicating with the database server and
* providing additional API URLs for the frontend.

The database server should *never* be contacted by the frontend or another application directly and may be configured to be inaccessible to external requests.

# Future Work and Limitations
# Group
