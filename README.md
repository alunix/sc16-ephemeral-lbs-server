# Introduction
This repository contains the server-side source code for the "Smart Cities" study project. The project was part of a course at the Institute for Geoinformatics at the University of Münster. The overall goal was to create an ephemeral communication tool that allows it users to communicate anonymously over an ad-hoc network. All communications are of temporary nature and only exist for a fixed amount of time. That allows the users to share possibly sensitive information without being observed by a third party.  
Communications take place in zones that can be defined by the users. Each zone marks a geographic area. Users can only send and receive messages while located in that particular zone. Each zone has a number of topics that allow users a finer selection of the content relevant to them.  
In the course a prototype was implemented. The primary part of this is an [Android app](https://github.com/heinrichloewen/SC-App) used for the communication. This repository holds the the code for an accompanying server component. The user can choose if his messages should be uploaded and stored here until they expire. Users new to the zone can request a collection of all previous communications in that zone from the server. This reduces the cold start problem of a user entering an empty zone and provides him with an overview over recent activities.  
Besides of being the backend for the application the server also provides a frontend where existing zones can be explored and new zones are created.

# Features
The server provides two basic functionalities:
* a public API allowing the mobile application (and other potential message clients) to retrieve the available zones and their corresponding messages and  also to upload communications
* a web frontend which enables the creation and exploration of zones

## API
The API provides methods for requesting zones, requesting messages and uploading new messages. For details, consult `public/apidoc.html`.

## Web frontend

The website gives the user a tool to explore existing zones with their corresponding messages and to create new zones. It can be see as a companion to the app. Users can get a overview about the locations of zones and where the most active communications take place. In the following a few of the websites features are described in more detail.

### Exploring zones on the mapping

A big part of the interface is reserved for a map where all the zones are displayed. The user can now navigate to a location of interest and see whether a suitable zone exists.

### Searching zones

A second way of finding a zone is the search bar at the top of the sidebar on the right. Here the user can search for a zone by its name or topics. The search then provides a list with all relevant zones, e.g a search for the keyword "BBQ" will return all zones with this keyword in their name as well as the zones with a topic corresponding to the keyword.

### Creating zones

New zones can be create by pressing the "Add new zone"-button. The user then has to fill out a form describing the zones properties. Every zone has to have a name, a duration for which it should exist and at least one topic. The expiry date and time can be set using a popup calendar. The geographic extend of the zone can be added by drawing on the map using the drawing tool. The coordinates are then automatically added to the form.

### Accessing zone information

On clicking on a zone either in the map or the search results the details of that zone are displayed. The details consist of its name the date it expires an the available topics. In case there are two overlapping zone at the point that was clicked the user is shown a popup dialog asking which zone he was looking for.

#### Statistics

Part of the zones' details is a graph that shows the distribution of activity in each zone by time. It shows the number of messages that where send at a specific time of the day. This way users can see in which times the zones is the most active and when not to expect any activity.

#### Messages

Additionally to the zone details the messages of that particular zone are shown. The messages are ordered chronologically from the newest to the oldest message. The messages can be filtered by topic. Clicking one of the topics in the zone details results in only the messages of that topic being shown.

# Architecture
The architecture can be roughly split into web frontend, node.js application server and CouchDB database.

The frontend communicates with the application server using both parts of the public API as well as its own API endpoints.

The application server is the central part on the application and is responsible for:

* serving the frontend's webpage files
* providing the public API
* providing additional private API endpoints for the frontend
* communicating with the database server

The database server configured to be inaccessible to external requests. The data can only be accessed through the application server.

# Installation

For our development we used [Vagrant](https://www.vagrantup.com) to create a consistent environment. Vagrant uses the bootstrap.sh script to setup a virtual server and install the dependencies of the application. A slightly modified version of the same script can be used to setup the project on a real server.
Just clone the project, navigate to the folder and run the script:

```
git clone https://github.com/chack05/sc16-ephemeral-lbs-server.git
cd sc16-ephemeral-lbs-server
sudo sh install.sh
```
You can then start the server application by running `nodejs index.js`. The server then can be reached under port 8080.

The script was tested under Ubuntu 14.04

# Known issues and limitations

* The web frontend is not optimized for the smaller screen sizes of mobile devices.
* The algorithm behind searching zones is rather simple and the results a bit limited. A more sophisticated searching functionality could be achieved using a search engine like [Apache Lucene](https://lucene.apache.org/core/).
* Currently the graphs only show the activity by time of the the day, this could be further improved by adding a possibility to switch to a weekly or monthly overview. Additionally the numbers shown could be tied to the selected topic providing the user with activity information tailored more closely to his interests.
* There is also currently no protection against someone spamming an area with a lot of zones. Everybody can freely create zones. Due to the ephemeral and anonymous character of the application we decided against requiring users to login. In a production environment users could for example be required to fill a CAPTCHA when creating a zone to at least prevent bots from spamming.
