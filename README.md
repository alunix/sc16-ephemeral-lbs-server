# Introduction
This repository contains the server-side source code for the "Smart Cities" project, which has the goal of researching/prototyping ephemeral location-based services.
# Installation
# Features
The server provides two basic functionalities:
* a public API for the mobile application (and other potential message clients) to gather available zones and store/retrieve corresponding messages
* a web frontend which enables the creation and exploration of zones

The web frontend:

The website offers several possibilities to explore activities in a city. It answers questions like "Where is the best party?", "Where is the cheapest place to eat or where are the nicest places in the city?" The start screen includes a map with all existing zones and a message box besides the map where the messages, statistics or options for own zones are shown.
Functionalities of the frontend are:

1. Searching zones
To find a zone the search functionality can be used. It can be searched for a zone with its name or by topics. The search then will provide a list with all relevant zones, e.g the keyword "BBQ" searches for zones with this keyword in their name as well as for zones that have this keyword as a topic.

2. Accessing messages
The messages that were shared within a zone can be accessed by clicking on a zone. If there are overlapping zones, one zone can be chosen from the appearing popup. After choosing one zone the messages are displayed in the message box. They are ordered from the newest to the oldest message. It can also be searched for messages of a specific topic, e.g the keyword "BBQ" searches for messages that were shared under the topic "BBQ".

3. Creating zones
New zones can be created with the drawing functionality. With the drawing tool a zone can directly be drawn into the map. The coordinates are added automatically into the properties form. In the properties form information about the zone can be added. It is mandatory to set a name, a duration until when the zone should exists and at least one topic for the zone. Also several topics for one zone can be assigned. The duration can be defined with the poping up calender in the corresponding field. In the calender a date and a time until when the zone should exist can be chosen.

4. Exploring statistics
The website offers statistics that show the activity in each zone. For exploring the statistics a zone in the map has to be clicked and the statistic will then be generated automatically.

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
