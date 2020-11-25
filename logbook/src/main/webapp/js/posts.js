'use strict';

/**
 * Functions related to already created posts.
 * @type {{init: init}}
 */
var Posts = (function() {
  var el = {
    postsParent: null,
    mapParent: null,
    confirmDelete: null,
    deleteButton: null,
    deleteMsg: null,
    postButton: null,
    showMapButton: null
  };

  var data = {
    username: null
  };

  var state = {
    clickedFullPost: null,
    locationValid: null,
    mapView: false
  };

  var obj = {
    map: null
  };

  var nominatimAPI = {
    reverseUrl: 'https://nominatim.openstreetmap.org/reverse'
  };

  /**
   * Initializes the posts section (global or user).
   * @param username
   */
  function init(username) {
    data.username = username;
    el.confirmDelete = null;
    state.clickedFullPost = null;
    state.mapView = false;

    var postsSection = createPostsSection(username);
    el.postsParent = postsSection.children[0];
    
    if (username === null) {
      el.postsParent.className = 'parent-in-main';
      Init.nonav.innerHTML = '';
      Init.nonav.appendChild(postsSection);
    }
    else {
      el.postsParent.className = 'parent-in-myaccount';
      var accountSubsection = document.getElementById('account-subsection');
      accountSubsection.innerHTML = '';
      accountSubsection.appendChild(postsSection);
    }

    getPosts(username);
  }

  /**
   * Requests the 10 latest posts from the server.
   * @param username
   */
  function getPosts(username) {
    Requests.cancelExcept(null);

    var loader = document.querySelector('.bar-loader');
    if (!loader) {
      loader = newElements.createSlidingLoader();
      Init.navbarContent.appendChild(loader);
    }

    var formData = new FormData();
    formData.append("action", "GetPosts");
    if (username !== null) {
      formData.append('username', username);
    }
    var ID = Requests.add(ajaxRequest('POST', 'Main', formData, successCallback, failCallback));

    function successCallback() {
      Init.navbarContent.removeChild(loader);
      var response = JSON.parse(Requests.get(ID).responseText);
      if (username === null) {
        var postsButton = document.getElementById('show-posts');
        Homepage.initializeButton(postsButton);
        Homepage.initializeButton(postsButton);
      }

      var shortPost = null;
      if (Object.keys(response).length > 0) {
        el.postsParent.appendChild(document.createElement('hr'));
      }
      Object.keys(response).forEach(function(key,index) {
        shortPost = createShortPost(response[key]);
        el.postsParent.appendChild(shortPost);
        el.postsParent.appendChild(document.createElement('hr'));
      });
      if (Object.keys(response).length === 0) {
        var postsMsg = document.createElement('p');
        postsMsg.innerHTML = 'No posts.';
        el.postsParent.appendChild(postsMsg);
      }
    }

    function failCallback() {
      Init.navbarContent.removeChild(loader);
      if (Requests.get(ID).status === 401) {
        Logout.showExpired();
        return;
      }
      var error = null;
      if (Requests.get(ID).status === 0) {
        error = 'Unable to send request';
      }
      else {
        error = 'Error';
      }
      newElements.showFullWindowMsg('OK', error, Init.clearFullWindowMsg);
    }
  }

  /**
   * Deletes a post. Only owners of posts can delete their posts.
   * @param fullPost (This is no longer necessary)
   * @param username The owner of the post.
   * @param postID The ID of the post.
   */
  function deletePost(fullPost, username, postID) {
    Requests.cancelExcept(null);

    var formData = new FormData();
    formData.append("action", "DeletePost");
    formData.append("postID", postID);
    formData.append("username", username);

    var ID = Requests.add(ajaxRequest('POST', "Main", formData, successCallback, failCallback));

    function successCallback() {
      var confirmDelete = document.getElementById('full-screen');
      document.getElementsByTagName('body')[0].removeChild(confirmDelete);
      Posts.init(data.username);
    }

    function failCallback() {
      var confirmDelete = document.getElementById('full-screen');
      document.getElementsByTagName('body')[0].removeChild(confirmDelete);
      var responseText = null;
      var error = null;
      if (Requests.get(ID).status === 401) {
        responseText = Requests.get(ID).responseText;
        if (!responseText) {
          error = 'Error';
        }
        else {
          if (JSON.parse(responseText).ERROR === 'NO_SESSION') {
            Logout.showExpired();
            return;
          }
          else {
            error = 'Unauthorized';
          }
        }
      }
      else if (Requests.get(ID).status === 500) {
        error = 'Server error';
      }
      else if (Requests.get(ID).status === 400) {
        responseText = Requests.get(ID).responseText;
        if (!responseText) {
          error = 'Error';
        }
        else {
          if (JSON.parse(responseText).ERROR === 'MISSING_USERNAME') {
            error = 'Invalid user';
          }
          else {
            error = 'Invalid post';
          }
        }
      }
      else if (Requests.get(ID).status === 0) {
        error = 'Unable to send request';
      }
      else {
        error = 'Error';
      }
      newElements.showFullWindowMsg('OK', error, Init.clearFullWindowMsg);
    }
  }

  /**
   * Creates the posts section and populates it with the 10 latest posts.
   * @param username
   * @returns {HTMLDivElement}
   */
  function createPostsSection(username) {
    var header = document.createElement('header');
    var headerH2 = document.createElement('h2');
    headerH2.innerHTML = 'Latest posts';
    header.appendChild(headerH2);

    var postsParent = document.createElement('div');
    postsParent.id = 'posts-parent';

    if (username === Init.getUser() || username === null) {
      el.postButton = newElements.createBlueButton('+ New Post', 'new-post-button');
      el.postButton.children[0].addEventListener('click', function() {
        this.blur();
        getPostForm(username);
      });
      postsParent.appendChild(el.postButton);
    }
    postsParent.appendChild(header);

    var postsSection = document.createElement('div');
    postsSection.id = 'posts-section';
    postsSection.appendChild(postsParent);

    return postsSection;
  }

  /**
   * Creates a short version of a post. A short post does not show all information related to the post.
   * @param postJSON
   * @returns {HTMLDivElement}
   */
  function createShortPost(postJSON) {
    var postDiv = null;
    var queryLatLon = null;

    /* create the post description, this is a trimmed version (max 350 chars) of the full description */
    var description = document.createElement('div');
    var descriptionArray = createDescription(postJSON['description'], 350);
    for (var i = 0; i < descriptionArray.length; i++) {
      description.className = 'post-description';
      description.appendChild(descriptionArray[i]);
    }

    /* create the photo of the post */
    var image = document.createElement('img');
    image.className = 'short-post-photo';
    if (postJSON['imageURL']) {
      image.src = postJSON['imageURL'];
    }
    else if (postJSON['imageBase64']) {
      image.src = postJSON['imageBase64'];
    }
    var imageParent = document.createElement('div');
    imageParent.className = 'short-post-photo-parent';
    if (!image.src) {
      image.src = 'images/no-image.jpg';
      imageParent.classList.add('post-no-image');
    }
    imageParent.appendChild(image);

    /* create the button that tells us who created this post */
    var button = document.createElement('button');
    button.className = 'transparent-button post-creator-button';
    button.innerHTML = postJSON['username'];
    button.onclick = function() {
      ShowProfile.init(postJSON['username'], true);
    };

    /* create the element that tells us when the post was created */
    var timestampEl = document.createElement('span');
    var timestamp = postJSON['createdAt'].substring(0, postJSON['createdAt'].lastIndexOf(":")).split(' ');
    var timestampDate = timestamp[0];
    var timestampTime = '[' + timestamp[1] + ']';
    timestampEl.innerHTML = '@ ' + timestampDate + ' ' + timestampTime;

    /* create the element that tells us who created the post and when */
    var username = document.createElement('div');
    username.className = 'posted-by';
    username.appendChild(button);
    username.appendChild(timestampEl);

    /* create all elements related to the rating of the post */
    var ratingValue = document.createElement('span');
    if (postJSON['ratings'].length) {
      var ratingsSum = postJSON['ratings'].reduce(function (a, b) {
        return a + b;
      });
      var rating = (Math.round(10 * (ratingsSum / postJSON['ratings'].length)) / 10).toFixed(1);
      var ratingText = rating + ' / 5 [' + postJSON['ratings'].length;
      if (postJSON['ratings'].length === 1) {
        ratingValue.innerHTML = ratingText + ' rating]';
      }
      else {
        ratingValue.innerHTML = ratingText + ' ratings]';
      }
    }
    else {
      ratingValue.innerHTML = 'No ratings';
    }
    var ratingDiv = document.createElement('div');
    ratingDiv.className = 'ratings';
    ratingDiv.innerHTML = 'Rating:';
    ratingDiv.appendChild(ratingValue);

    /* create the footer element, this currently shows only who created the post and when */
    var footer = document.createElement('div');
    footer.className = 'post-footer';
    footer.appendChild(username);

    /* create the element that shows the location of the place referenced in the post */
    var location = newElements.createKeyValue('Location', 'Querying...');
    location.id = 'post-location';
    var locationContainer = document.createElement('div');
    locationContainer.className = 'location-container';
    locationContainer.appendChild(location);

    /* create the element that has everything in the post */
    postDiv = document.createElement('div');
    postDiv.appendChild(locationContainer);
    postDiv.appendChild(imageParent);
    postDiv.appendChild(description);

    /* create the element that has the read more button (includes the button and the image of the button) */
    var readMoreButton = document.createElement('button');
    readMoreButton.className = 'read-more-button';
    readMoreButton.innerHTML = 'Read more';
    readMoreButton.addEventListener('click', function () {
      data['locationQuery'] = queryLatLon.getLocation();
      data['queryID'] =  queryLatLon.getQueryID();
      turnToFullPost(data);
    });

    var data = {
      description: postJSON['description'],
      resourceURL: postJSON['resourceURL'],
      lat: postJSON['latitude'],
      lon: postJSON['longitude'],
      username: postJSON['username'],
      postID: postJSON['postID'],
      ratingDiv: ratingDiv,
      userRating: postJSON['userRating'],
      descriptionDiv: description,
      readMoreButtonDiv: readMoreButton,
      footerDiv: footer,
      postDiv: postDiv,
      locationDiv: location,
      imageDiv: imageParent
    };

    /* request the name of the location from the nominatim service */
    queryLatLon = new QueryLatLon(data);

    postDiv.appendChild(readMoreButton);
    postDiv.appendChild(footer);
    postDiv.appendChild(ratingDiv);

    return postDiv;
  }

  /**
   * Requests the name of the location of the place referenced in the post and changes the corresponding
   * element of the post to display that name.
   * @param data
   * @returns {{getLocation: (function(): null), getQueryID: (function(): null)}}
   * @constructor
   */
  function QueryLatLon(data) {
    var queryID = null;
    var locationQuery = null;

    (function init() {
      var input = LocationSearch.createLatLonInput(data['lat'], data['lon']);
      if (input) {
        queryID = Requests.add(ajaxRequest('GET', nominatimAPI.reverseUrl + input, null, successCallback, failCallback));
      }
      else {
        failCallback();
      }

      function successCallback() {
        var response = JSON.parse(Requests.get(queryID).responseText);
        locationQuery = LocationSearch.parseReverseSearch(response);
        if (!locationQuery) {
          failCallback();
          return;
        }

        var loc = '';
        if (locationQuery.country) {
          loc += locationQuery.country;
        }
        else if (locationQuery.country_code) {
          loc += locationQuery.country_code;
        }
        if (locationQuery.city) {
          loc += ', ' + locationQuery.city;
        }
        if (locationQuery.address) {
          loc += ', ' + locationQuery.address;
        }
        data['locationDiv'].children[0].innerHTML = loc;
        if (state.clickedFullPost) {
          data['locationQuery'] = locationQuery;
          formButton.enable(el.showMapButton);
        }
        state.locationValid = true;
      }

      function failCallback() {
        if (LocationSearch.isValidLatLon(data['lat'], data['lon'])) {
          data['locationDiv'].children[0].innerHTML = '(' + parseFloat(data['lat']).toFixed(4) + ', ' + parseFloat(data['lon']).toFixed(4) + ') deg';
          if (state.clickedFullPost) {
            formButton.enable(el.showMapButton);
          }
          state.locationValid = true;
        }
        else {
          data['locationDiv'].children[0].innerHTML = 'Not available';
          state.locationValid = false;
        }
      }
    }());

    function getQueryID() {
      return queryID;
    }

    function getLocation() {
      return locationQuery;
    }

    return {
      getQueryID: getQueryID,
      getLocation: getLocation
    };
  }

  /**
   * Turns a short post into a full post. This means all the information related to the post is now visible.
   * We also get to see the location of the place referenced in the post on a map.
   * @param data
   */
  function turnToFullPost(data) {
    Requests.cancelExcept(data['queryID']);

    if (!data['imageDiv'].classList.contains('post-no-image')) {
      data['imageDiv'].children[0].className = 'full-post-photo';
    }
    data['descriptionDiv'].innerHTML = '';
    var descriptionArray = createDescription(data['description']);
    for (var i = 0; i < descriptionArray.length; i++) {
      data['descriptionDiv'].appendChild(descriptionArray[i]);
    }

    data['postDiv'].removeChild(data['readMoreButtonDiv']);

    if (data['resourceURL']) {
      var url = document.createElement('a');
      url.href = data['resourceURL'];
      url.target = 'blank';
      url.textContent = data['resourceURL'].substr(data['resourceURL'].lastIndexOf('//') + 2);
      var onlineURL = newElements.createKeyValue('See also', url, 1);
      data['postDiv'].insertBefore(onlineURL, data['footerDiv']);
    }

    /* show a edit post button when we are the owners of the post */
    if (data['username'] === Init.getUser()) {
      var optionsBar = document.createElement('div');
      optionsBar.id = 'post-options-bar';
      data['optionsBar'] = optionsBar;

      var button = createPostOptionsShowButton(data);
      optionsBar.appendChild(button);

      data['postDiv'].insertBefore(optionsBar, data['locationDiv'].parentElement);
    }

    /* show the switch to map view button */
    el.showMapButton = document.createElement('button');
    el.showMapButton.className = 'sign-internal-button';
    el.showMapButton.innerHTML = 'Map view';
    if (state.locationValid) {
      formButton.enable(el.showMapButton);
      el.showMapButton.addEventListener('click', function() {
          if (state.mapView) {
            el.showMapButton.innerHTML = 'Map view';
            data['imageDiv'].classList.remove('open-photo');
            data['imageDiv'].children[0].classList.remove('closed-photo');
            data['imageDiv'].removeChild(el.mapParent);
            state.mapView = false;
          } else {
            data['imageDiv'].classList.add('open-photo');
            data['imageDiv'].children[0].classList.add('closed-photo');
            el.showMapButton.innerHTML = 'Photo view';
            showMap(data);
            state.mapView = true;
          }
      });
    }
    else {
      formButton.disable(el.showMapButton);
    }
    data['locationDiv'].parentElement.appendChild(el.showMapButton);

    /* select the rating of the logged in user for this post */
    var selectRate = document.createElement('select');
    selectRate.className = 'select-rate';
    var option = document.createElement('option');
    option.value = '';
    option.selected = true;
    option.innerHTML = '-';
    selectRate.appendChild(option);

    for (i = 1; i < 6; i++) {
      option = document.createElement('option');
      option.value = i;
      option.innerHTML = i;
      selectRate.appendChild(option);
    }
    if (data['username'] === Init.getUser()) {
      selectRate.disabled = true;
    }
    else if (data['userRating'] !== 0) {
      selectRate.children[data['userRating']].selected = true;
    }
    selectRate.addEventListener('change', function() {
        ratePost(this, data);
    });
    data['ratingDiv'].appendChild(selectRate);

    el.postsParent.innerHTML = '';
    el.postsParent.appendChild(data['postDiv']);
    window.scrollTo(0, 0);
    state.clickedFullPost = true;
  }

    /**
     * Rates a post (makes request to server)
     * @param selectRateDiv
     * @param data
     */
  function ratePost(selectRateDiv, data) {
      var rating = selectRateDiv.value;

      var formData = new FormData();
      formData.append("action", "RatePost");
      formData.append("postID", data['postID']);
      formData.append("rate", rating);

      var ID = Requests.add(ajaxRequest('POST', "Main", formData, successCallback, failCallback));

      function successCallback() {
          var response = JSON.parse(Requests.get(ID).responseText);
          console.log(response);
      }

      function failCallback() {
          var response = JSON.parse(Requests.get(ID).responseText);
          console.log(response);
      }
  }

  /**
   * Show a map with a mark of the location of the place referenced in the post.
   * @param data
   */
  function showMap(data) {
    var zoom = null;
    if (data['locationQuery']) {
      if (data['locationQuery'].address) {
        zoom = 16;
      }
      else {
        zoom = 12;
      }
    }
    else if (LocationSearch.isValidLatLon(data['lat'], data['lon'])) {
      zoom = 12;
    }
    else {
      return;
    }

    if (!el.mapParent) {
      var mapDiv = document.createElement('div');
      mapDiv.id = 'map-post';
      el.mapParent = document.createElement('div');
      el.mapParent.id = 'post-map-parent';
      el.mapParent.appendChild(mapDiv);
      data['imageDiv'].appendChild(el.mapParent);
      mapDiv.style.height = '20rem';
      obj.map = new OLMap(mapDiv.id);
    }
    else {
      obj.map.resetState();
      data['imageDiv'].appendChild(el.mapParent);
    }

    obj.map.setZoom(zoom);
    obj.map.addLocation({lat: data['lat'], lon: data['lon']});
    obj.map.drawMap();
  }

  /**
   * Creates an array of p elements for the description based on the given description text.
   * @param descriptionText
   * @param maxVisibleLength Drop all description characters after index maxVisibleLength
   * @returns
   */
  function createDescription(descriptionText, maxVisibleLength) {
    var description = descriptionText.trim().replace(/ +/g, ' ').replace(/\n+/g, '\n');
    if (description === '') {
      return 'Missing description';
    }
    if (maxVisibleLength && maxVisibleLength >= 20 && maxVisibleLength < descriptionText.length) {
      var cropped = true;
      description = descriptionText.substring(0, maxVisibleLength);
      var lastSpace = description.lastIndexOf(' ');
      if (lastSpace === -1) {
        var lastNewLine = description.lastIndexOf('\n');
        if (lastNewLine !== -1) {
          description = description.substring(0, lastNewLine);
        }
      }
      else {
        description = description.substring(0, lastSpace);
      }
    }

    var descriptionArray = [];
    var lines = description.split('\n');
    for (var line = 0; line < lines.length; line++) {
      var paragraph = document.createElement('p');
      paragraph.textContent = lines[line];
      descriptionArray.push(paragraph);
    }
    if (cropped) {
      descriptionArray[descriptionArray.length - 1].textContent += ' ...';
    }
    return descriptionArray;
  }

  /**
   * Requests the new post form from the server. Called when the new post button is clicked.
   * @param username
   */
  function getPostForm(username) {
    Requests.cancelExcept(null);

    var loader = document.querySelector('.bar-loader');
    if (!loader) {
      loader = newElements.createSlidingLoader();
      Init.navbarContent.appendChild(loader);
    }

    var formData = new FormData();
    formData.append("action", "GetPostForm");
    var ID = Requests.add(ajaxRequest('POST', 'Main', formData, successCallback, failCallback));

    function successCallback() {
      Init.navbarContent.removeChild(loader);
      var postFormSection = createPostFormSection();
      postFormSection.children[0].innerHTML = Requests.get(ID).responseText;
      if (username === null) {
        postFormSection.children[0].className = 'parent-in-main';
        Init.nonav.innerHTML = '';
        Init.nonav.appendChild(postFormSection);
      }
      else {
        postFormSection.children[0].className = 'parent-in-myaccount';
        var accountSubsection = document.getElementById('account-subsection');
        accountSubsection.innerHTML = '';
        accountSubsection.appendChild(postFormSection);
      }
      PostForm.init(username);
    }

    function failCallback() {
      Init.navbarContent.removeChild(loader);
      var error = null;
      if (Requests.get(ID).status === 401) {
        Logout.showExpired();
        return;
      }
      if (Requests.get(ID).status === 0) {
        error = 'Unable to send request';
      }
      else {
        error = 'Error';
      }
      newElements.showFullWindowMsg('OK', error, Init.clearFullWindowMsg);
    }
  }

  /**
   * Creates the section that will host the new post form.
   * @returns {HTMLDivElement}
   */
  function createPostFormSection() {
    var postFormParent = document.createElement('div');
    postFormParent.id = 'post-form-parent';

    var postFormSection = document.createElement('div');
    postFormSection.id = 'post-form-section';
    postFormSection.appendChild(postFormParent);

    return postFormSection;
  }

  /**
   * Creates an option button that shows a edit post menu once it has been clicked. This button is only visible
   * to the owner of the post. Currently, the edits of the post only include deleting the post.
   * @param data
   * @returns {HTMLButtonElement}
   */
  function createPostOptionsShowButton(data) {
    var button = newElements.createGearButton('show-post-options-button');
    button.addEventListener('click', function() {
      data['optionsBar'].innerHTML = '';
      var menu = createPostOptionsMenu(data);
      var closeButton = createPostOptionsCloseButton(data);
      data['optionsBar'].appendChild(closeButton);
      data['optionsBar'].appendChild(menu);
    });
    return button;
  }

  /**
   * Creates button that closes the edit post menu once it has been opened.
   * @param data
   * @returns {HTMLButtonElement}
   */
  function createPostOptionsCloseButton(data) {
    var button = newElements.createCloseButton('remove-post-options-button');
    button.addEventListener('click', function() {
      el.confirmDelete = null;
      data['optionsBar'].innerHTML = '';
      var openButton = createPostOptionsShowButton(data);
      data['optionsBar'].appendChild(openButton);
    });

    return button;
  }

  /**
   * Creates the edit post menu.
   * @param data
   * @returns {HTMLDivElement}
   */
  function createPostOptionsMenu(data) {
    el.deleteButton = newElements.createBlueButton('Delete post', 'delete-post-button');
    el.deleteButton.children[0].addEventListener('click', function() {
      var self = this;
      self.disabled = true;
      setTimeout(function() {
        newElements.showConfirmDelete('This post will be deleted!', 'post-delete-confirm', function() {
          deletePost(data['postDiv'], data['username'], data['postID']);
        });
        self.disabled = false;
      }, 200);
    });

    data['postDiv'].appendChild(el.deleteButton);

    var div = document.createElement('div');
    div.id = 'post-options-menu';
    div.appendChild(el.deleteButton);

    return div;
  }

  return {
    init: init
  };
}());