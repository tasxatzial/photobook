# Photobook

A simple platform where people can share information about travel locations.

**Note:** This is my first attempt at designing a UI and writing frontend and backend code without using any frameworks.

## Features

### Sign up screen

* Notification if a form input does not match the required format.
* Notification if the username & email are already taken by someone else.
* Ability to verify current location (**Nominatim API**) and see it on a map (**Openlayers API**).
* Automatic fill in of the country, city, address fields (**HTML5 Geolocation + Nominatim API**).
* Option to associate a username to a face photo (**Face++ API**).

### Sign in screen

* Automatic fill in of the username using a face photo (**Face++ API**).
* Show an appropriate message if the face photo shows any emotion (**Face++ API**).

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

## Implementation

### Frontend

* Single Page Application. Only AJAX requests are used.
* Responsive website.
* All top level JavaScript functions are implemented using the module pattern.
* Encoding of passwords before sending them to the server.
* Thorough handling of response codes, offering clear messages to the user.

### Backend

* Java servlets.
* Cookies based session.
* SQL database.

### API calls

* Nominatim
* Face++
* OpenLayers
* HTML5 Geolocation

## Dependencies

The project is written in HTML, CSS, JavaScript, Java.

The following dependencies do not require an online connection:

* [CryptoJS](https://code.google.com/archive/p/crypto-js/)
* [JSON Simple](https://code.google.com/archive/p/json-simple/)
* [PostgreSQL JDBC](https://jdbc.postgresql.org/)

The following dependencies require an online connection:

* [Nominatim](https://nominatim.org/)
* [Face++](https://www.faceplusplus.com/)
* [OpenLayers](https://openlayers.org/)

## Run locally

Tested with Java (8 or 11), Maven 3.6, Tomcat 8.5, PostgreSQL 10.

1. Switch to the 'photobook' folder and run:

        mvn package

    The above command will build a .war file inside the 'target' folder. Deploy the file in Tomcat.
2. Create a database and add a user role using the info found [here](photobook/src/main/java/gr/csd/uoc/cs359/winter2020/photobook/db/CS359DB.java).
3. This role will be used for creating and deleting users, creating and deleting posts etc. So, make sure it has the appropriate permissions.
4. Use the commands found in the [sql](sql/) folder to create the database tables.

## Known issues

* Page URL/title never changes, back/forward functionality is disabled.

## Screenshots

See [screenshots](screenshots/).

## Contributions

Initial parts of the project were contributed by [Panagiotis Padadakos](https://github.com/papadako).
