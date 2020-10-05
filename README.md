# Logbook

## Description

A simple platform where people can share information about travel locations.

## Language

Frontend: Plain HTML, CSS, Javascript (ES5)

Backend: Java

Database: SQL

## Features

Here's a complete list of features:

### Sign up screen

* Notifications if a required input does not match the accepted format.
* Password mismatch notification.
* Username & email notifications if they are already taken by someone else.
* Able to verify the input location (Nominatim online service).
* Given a verified location, the user can see it on a map (Openlayers online service).
* Automatic fill in of the country, city, address fields (HTML5 geolocation + Nominatim online service).
* Option to associate a username to a face using a photo (Face++ online service). A photo that shows the same face can be used during signin so that the username is filled in automatically.

### Sign in screen

* Automatic fill in of the username using a face photo (Face++ online service).
* The Face++ service is also used to detect if the face in the photo shows any emotion. In that case it returns an appropriate message.

### Logged in features

* Create posts, this is possible both from the user posts page and the main page.
* Delete own posts.
* Edit account details.
* Delete account. This also deletes all owned posts.
* Browse a list of all users.
* See the profile of any user. This is possible both from the all users list and from every post.
* See a short list of the 10 latest posts of a user or the 10 latest posts from all users.
* See an expanded version of a short post. An expanded post includes all the details that are not displayed in the short list of posts.
* There is a top-navigation bar that can be used to see own account details, see all users, see all posts, and log out.
* Sessions expire after 10 mins of inactivity.

## Implementation

### Frontend

* MVC model.
* Single Page Application.
* The site is responsive.

### Backend

* Java servlets.
* MVC model.
* Cookies based session.
* SQL database.

## Compile & Run

This is a maven project. It can be compiled with:

    mvn package

Currently only way to run the website is by seting up a tomcat and a SQL database locally. Details may be added in the future.

## Screenshots

Check the [screenshots](/screenshots) folder.

## Contributions

Parts of the project were contributed by [Panagiotis Padadakos](https://github.com/papadako).
