# Introduction
This repository contains the server-side source code for the "Smart Cities" study project. The project was part of a course at the Institute for Geoinformatics at the University of Münster. The overall goal was to create an ephemeral communication tool that allows it users to communicate anonymously over an ad-hoc network. All communications are of temporary nature and only exist for a fixed amount of time. That allows the users to share possibly sensitive information without being observed by a third party.

Communications take place in zones that can be defined by the users. Each zone marks a geographic area. Users can only send and receive messages while in that particular zone. Each zone has a number of topics that allow users a finer selection of the content relevant to them.

In the course a prototype was implemented. The primary part of this is an [Android app](https://github.com/heinrichloewen/SC-App) used for the communication. This repository holds the the code for an accompanying server component. The user can choose if his messages should be uploaded and stored here until they expire. Users new to the zone can now request a collection of all previous communication in that zone from the server. This reduces the cold start problem of a user entering an empty zone and provides him with an overview of the activities.

Besides of being the backend for the application the server also provides a frontend where existing zones can be explored and new zones are created.

# Features
## The server

The server provides two basic functionalities:
* a public API for the mobile application (and other potential message clients) to gather available zones and store/retrieve corresponding messages
* a web frontend which enables the creation and exploration of zones

## The web frontend:

The website offers several possibilities to explore activities in a city. It answers questions like "Where is the best party?", "Where is the cheapest place to eat or where are the nicest places in the city?" The start screen includes a map with all existing zones and a message box besides the map where the messages, statistics or options for own zones are shown.
Functionalities of the frontend are:

### Searching zones

To find a zone the search functionality can be used. It can be searched for a zone with its name or by topics. The search then will provide a list with all relevant zones, e.g the keyword "BBQ" searches for zones with this keyword in their name as well as for zones that have this keyword as a topic.

### Accessing messages

The messages that were shared within a zone can be accessed by clicking on a zone. If there are overlapping zones, one zone can be chosen from the appearing popup. After choosing one zone the messages are displayed in the message box. They are ordered from the newest to the oldest message. It can also be searched for messages of a specific topic, e.g the keyword "BBQ" searches for messages that were shared under the topic "BBQ".

### Creating zones

New zones can be created with the drawing functionality. With the drawing tool a zone can directly be drawn into the map. The coordinates are added automatically into the properties form. In the properties form information about the zone can be added. It is mandatory to set a name, a duration until when the zone should exists and at least one topic for the zone. Also several topics for one zone can be assigned. The duration can be defined with the poping up calender in the corresponding field. In the calender a date and a time until when the zone should exist can be chosen.

### Exploring statistics

The website offers statistics that show the activity in each zone. For exploring the statistics a zone in the map has to be clicked and the statistic will then be generated automatically.

# API
The API provides methods for requesting zones, requesting messages and uploading new messages. For details, consult `public/apidoc.html`.

# Architecture
The architecture can be roughly split into web frontend, node.js application server and CouchDB database.

The frontend uses both parts of the public API as well as its own API, which means that the application server is responsible for

* serving the frontend webpage files,
* providing the public API,
* communicating with the database server and
* providing additional API URLs for the frontend.

The database server should *never* be contacted by the frontend or another application directly and may be configured to be inaccessible to external requests.

# Installation

For our development we used [Vagrant](https://www.vagrantup.com) to create a consistent environment. Vagrant uses the bootstrap.sh script to setup a virtual server and install the dependencies of the application. A slightly modified version of the same script can be used to setup the project on a real server.
Just clone the project, navigate to the folder and run the script:

```
git clone https://github.com/chack05/sc16-ephemeral-lbs-server.git
cd sc16-ephemeral-lbs-server
sudo sh install.sh
```
You can then start the server application by running `nodejs index.js`. The server then can be reached under port 8080.

# Known issues and limitations

* The web frontend isn't optimized for the screen size of mobile devices.
* The algorithm behind searching zones is rather simple and as a result limited. A more sophisticated searching functionality most likely requires a search engine like Apache Lucene.
* While the graphs show activity by time, there are other details such as monthly trends that are not implemented.
