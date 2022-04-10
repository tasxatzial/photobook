# Photobook

A simple platform where people can share information about travel locations.

**Note:** This is my first attempt at writing frontend and backend code. Both parts have been written from scratch and without using any frameworks.

## Implementation

### Frontend

* Single Page Application.
* Responsive.
* Encoding of passwords before sending them to the server.
* AJAX requests.

### Backend

* Java servlets.
* Cookies based session.
* SQL database.

### API calls

* [Nominatim](https://nominatim.org/).
* [Face++](https://www.faceplusplus.com/).
* [OpenLayeys](https://openlayers.org/).
* HTML5 Geolocation.

## Features

### Sign up screen

* The user is notified if a form input does not match the required format.
* The user is notified if the username & email are already taken by someone else.
* The user is able to verify their location (Nominatim).
* Given a verified location the user can see it on a map (Openlayers).
* Automatic fill in of the country, city, address fields (Geolocation + Nominatim).
* Option to associate a username to a face photo (Face++).

### Sign in screen

* Automatic fill in of the username using a face photo (Face++).
* Show an appropriate message if the face photo shows any emotion (Face++).

### Logged in features

* Create posts. This includes uploading a photo, selecting its location, and writing text about it.
* Rate posts.
* Delete own posts.
* Edit account details.
* Delete account. This also deletes all owned posts, the ratings of the posts, and the ratings by this account.
* Able to sort posts based on the average score rating or creation date.
* Browse a list of all users.
* See which users are online.
* See the profile of any user.
* See a short list of the 10 latest posts of a user or the 10 latest posts from all users.
* See an expanded version of a short post. From that page the user is able to edit the post, see a map of the location, a larger photo, and the full text.
* Sessions expire after 10 mins of inactivity.

## Known issues

* Page URL/title never changes, back/forward functionality is disabled.

## Compile & Run

Tested with Java (8 or 11), Maven 3.6, Tomcat 8.5, PostgreSQL 10.

1. Switch to the 'photobook' folder and run:

        mvn package

    The above command will build a .war file inside the 'target' folder. Deploy the file in Tomcat.
2. Create a database and add a user role using the info found [here](photobook/src/main/java/gr/csd/uoc/cs359/winter2020/photobook/db/CS359DB.java).
3. This role will be used for creating and deleting users, creating and deleting posts etc. So, make sure it has the appropriate permissions.
4. Use the commands found in the [sql](sql/) folder to create the database tables.

## Screenshots

See [screenshots](screenshots/).

## Contributions

Initial parts of the project were contributed by [Panagiotis Padadakos](https://github.com/papadako).
