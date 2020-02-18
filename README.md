# Logbook

## Description

A platform where people can share information about travel locations.

## Language

HTML, CSS, Javascript (ES5).

## Features

### Sign up

* Notifications if all required inputs match the accepted format.

* Passwords mismatch notification when two different passwords have been entered.

* Username & email notifications if they are already taken by someone else.

* Able to verify the input location (Nominatim online service).

* Given a verified location, the user can see it on a map (Openlayers online service).

* Automatic fill in of the country, city, address fields (HTML5 geolocation + Nominatim online service).

* Option to associate a username to a face that can be used for recognition during the sign-in process (Face++ online service): The user can select a face photo from the disk drive and upload it to the service. If Face++ recognizes a face, the photo is then stored online and may be used in the sign in form.

### Sign in

* Automatic fill in of the username (Face++ online service): The user has the option to select a face photo from the disk drive. If the face has been associated to his/her username during the sign-up process, Face++ should be able using that photo to identify the username.

* The Face++ service is also used to detect if the face in the photo shows any emotion. In that case it returns an appropriate message.

### Logged in features

* Create posts, this is possible both from the user page and the main page. A post has a location (verified either with HTML geolocation or the Nominatim online service) and a description as the minimum required fields. Optionally it can have a photo that has been selected from the disk or a URL to an online photo, and a URL to an online resource.

* Delete own posts.

* Edit account details. This includes all information entered during sign up except the username.

* Delete account. This also deletes all owned posts.

* Browse a list of all users.

* See the profile of any user. This is possible both from the all users list and from every post.

* See a short list of the 10 latest posts, the posts can either belong to a single user or to the global list of posts. A short post shows the location of the post, a small version the photo, a short description, and the creator of the post.

* See an expanded version of a short post. In addition to the short post it includes a full description, a larger version of the photo, a URL to an online resource, and shows the location of the post on a map (Openlayers online service).

* A top navigation bar that can be used to see own account details, all users, all posts, and log out.

* Sessions do not expire if the browser is closed. They do expire though after 10 mins of inactivity.

## Implementation

### Frontend

* MVC model.

* Single Page Application.

* Responsive.

### Backend

* Java servlets.

* Servlets can also be used as a REST type API.

* MVC model.

* Cookies based session.

* SQL database.

## Run

-- To be updated --
