# Photobook

A simple platform where people can share information about travel locations.

*Note:* This is one of my earliest attemps at writing HTML/CSS/Javascript. The site works without any problems, however, there is plenty of room for improvements, especially regarding the code style.

## Features

Here's a complete list of features:

### Sign up screen

* Notifications if a required input does not match the accepted format.
* Password is entered twice and if there is a mismatch, a notification is displayed.
* Username & email notifications if they are already taken by someone else.
* Able to verify the user location (Nominatim online service).
* Given a verified location the user can see it on a map (Openlayers online service).
* Automatic fill in of the country, city, address fields (HTML5 geolocation + Nominatim online service).
* Option to associate a username to a face using a photo (Face++ online service).

### Sign in screen

* Automatic fill in of the username using a face photo (Face++ online service).
* The Face++ service is also used to detect if the face in the photo shows any emotion.

### Logged in features

* Create posts.
* Rate a post.
* Delete own posts.
* Edit account details.
* Delete account. This also deletes all owned posts, the ratings of the posts, and the ratings by this account.
* Able to sort posts based on the average score rating or creation date.
* Browse a list of all users.
* See which users are online.
* See the profile of any user.
* See a short list of the 10 latest posts of a user or the 10 latest posts from all users.
* See an expanded version of a short post. An expanded post includes all the details that are not displayed in the short list of 10 latest posts.
* Sessions expire after 10 mins of inactivity.

## Implementation

This project was created without the help of any frontend/backend frameworks. More specifically:

### Frontend

* MVC model.
* Single Page Application.
* The website is responsive and should work properly when width > 320px.
* Passwords are md5 encoded before sending them over the network.

### Backend

* Java servlets.
* MVC model.
* Cookies based session.
* SQL database.

## Known issues

This is a single page application thus all requests are AJAX requests. That means we should be changing
the browser URLs manually so that we can use bookmarks and navigate to previous/next page.
Currently, such functionality has not been implemented: The URLs never change.

## Compile & Run

This is a maven project. Switch to the root folder and execute:

    mvn package

Currently, the only way to run the project is by seting up Tomcat and a SQL database (postgres) locally.
Details may be added in the future.

## Screenshots

See [screenshots](/screenshots).

## Contributions

Parts of the project were contributed by [Panagiotis Padadakos](https://github.com/papadako).
