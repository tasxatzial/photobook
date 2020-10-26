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
    loaderMsg: null,
    postFormLoadMsg: null,
    postButton: null
  };

  var data = {
    username: null
  };

  var state = {
    clickedFullPost: null
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

    var oldError = document.getElementById('get-posts-error-msg');
    if (oldError) {
      el.postsParent.removeChild(oldError);
    }
    formMsg.showElement(el.loaderMsg, Init.loader);

    var formData = new FormData();
    formData.append("action", "GetPosts");
    if (username !== null) {
      formData.append('username', username);
    }
    var ID = Requests.add(ajaxRequest('POST', 'Main', formData, successCallback, failCallback));

    function successCallback() {
      var response = JSON.parse(Requests.get(ID).responseText);
      formMsg.clear(el.loaderMsg);
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
        el.loaderMsg.innerHTML = 'No posts.';
      }
    }

    function failCallback() {
      if (Requests.get(ID).status === 401) {
        Logout.showExpired();
        return;
      }
      formMsg.clear(el.loaderMsg);
      var error = null;
      if (Requests.get(ID).status === 0) {
        error = newElements.createKeyValue('Error', 'Unable to send request');
      }
      else {
        error = newElements.createKeyValue('Error', 'Unknown');
      }
      error.id = 'get-posts-error-msg';
      el.postsParent.appendChild(error);
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

    formMsg.showElement(el.deleteMsg, Init.loader);

    var formData = new FormData();
    formData.append("action", "DeletePost");
    formData.append("postID", postID);
    formData.append("username", username);

    var ID = Requests.add(ajaxRequest('POST', "Main", formData, successCallback, failCallback));

    function successCallback() {
      Posts.init(data.username);
    }

    function failCallback() {
      var responseText = null;
      if (Requests.get(ID).status === 401) {
        responseText = Requests.get(ID).responseText;
        if (!responseText) {
          formMsg.showError(el.deleteMsg, 'Error');
        }
        else {
          if (JSON.parse(responseText).ERROR === 'NO_SESSION') {
            Logout.showExpired();
          }
          else {
            formMsg.showError(el.deleteMsg, 'Unauthorized');
          }
        }
      }
      else if (Requests.get(ID).status === 500) {
        formMsg.showError(el.deleteMsg, 'Server error');
      }
      else if (Requests.get(ID).status === 400) {
        responseText = Requests.get(ID).responseText;
        if (!responseText) {
          formMsg.showError(el.deleteMsg, 'Error');
        }
        else {
          if (JSON.parse(responseText).ERROR === 'MISSING_USERNAME') {
            formMsg.showError(el.deleteMsg, 'Invalid user');
          }
          else {
            formMsg.showError(el.deleteMsg, 'Invalid post');
          }
        }
      }
      else if (Requests.get(ID).status === 0) {
        formMsg.showError(el.deleteMsg, 'Unable to send request');
      }
      else {
        formMsg.showError(el.deleteMsg, 'Error');
      }
      Init.scrollTo(el.deleteButton);
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

    el.loaderMsg = document.createElement('div');
    el.loaderMsg.className = 'sign-process-msg';

    var postsParent = document.createElement('div');
    postsParent.id = 'posts-parent';

    if (username === Init.getUser() || username === null) {
      el.postFormLoadMsg = document.createElement('div');
      el.postFormLoadMsg.className = 'sign-process-msg';
      el.postFormLoadMsg.id = 'post-form-load-msg';

      el.postButton = newElements.createBlueButton('+ New Post', 'new-post-button');
      el.postButton.addEventListener('click', function() {
        getPostForm(username);
      });
      postsParent.appendChild(el.postButton);
      postsParent.appendChild(el.postFormLoadMsg)
    }
    postsParent.appendChild(header);
    postsParent.appendChild(el.loaderMsg);

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
    var description = document.createElement('p');
    description.className = 'post-description';
    if (postJSON['description'].length > 350) {
      description.innerHTML = postJSON['description'].trim().replace('\n', '<br><br>').substring(0, 350) + ' ...';
    }
    else {
      description.innerHTML = postJSON['description'].trim().replace('\n', '<br><br>');
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
    if (image.src) {
      var imageParent = document.createElement('div');
      imageParent.className = 'short-post-photo-parent';
      imageParent.appendChild(image);
    }

    /* create the read more button */
    var readMore = document.createElement('p');
    readMore.className = 'read-more';
    readMore.innerHTML = 'Continue reading...';

    /* create the button that tells us who created this post */
    var button = document.createElement('button');
    button.className = 'transparent-button post-creator-button';
    button.innerHTML = postJSON['username'];
    button.onclick = function() {
      ShowProfile.init(postJSON['username'], true);
    };

    /* create the element that tells us when the post was created */
    var at = document.createElement('span');
    at.innerHTML = ' @ ';
    var timestamp = document.createElement('span');
    timestamp.innerHTML = postJSON['createdAt'].substring(0, postJSON['createdAt'].lastIndexOf(":"));

    /* create the element that tells us who created the post and when */
    var username = document.createElement('div');
    username.className = 'posted-by';
    username.appendChild(button);
    username.appendChild(at);
    username.appendChild(timestamp);

    /* create the footer element, this currently shows only who created the post and when */
    var footer = document.createElement('div');
    footer.className = 'post-footer';
    footer.appendChild(username);

    /* create the element that shows the location of the place referenced in the post */
    var location = newElements.createKeyValue('Location', 'Querying...');
    location.id = 'post-location';

    /* create the element that has the main content of the post, this includes:
    the location of the post
    the image of the post
    the description of the post
    the footer of the post */
    postDiv = document.createElement('div');
    postDiv.appendChild(location);
    if (image.src) {
      postDiv.appendChild(imageParent);
    }
    postDiv.appendChild(description);


    /* create the element that has the read more button (includes the button and the image of the button) */
    var readMoreButton = document.createElement('button');
    readMoreButton.className = 'read-more-button';
    readMoreButton.appendChild(readMore);
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
      descriptionDiv: description,
      readMoreButtonDiv: readMoreButton,
      footerDiv: footer,
      postDiv: postDiv,
      locationDiv: location
    };

    /* request the name of the location from the nominatim service */
    queryLatLon = new QueryLatLon(data);

    postDiv.appendChild(readMoreButton);
    postDiv.appendChild(footer);

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
          showMap(data);
        }
      }

      function failCallback() {
        if (LocationSearch.isValidLatLon(data['lat'], data['lon'])) {
          data['locationDiv'].children[0].innerHTML = '(' + Init.fourDecimal(data['lat']) + ', ' + Init.fourDecimal(data['lon']) + ') deg';
          if (state.clickedFullPost) {
            showMap(data);
          }
        }
        else {
          data['locationDiv'].children[0].innerHTML = 'Not available';
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
    state.clickedFullPost = true;
    Requests.cancelExcept(data['queryID']);

    if (data['postDiv'].children[1].className === 'short-post-photo-parent') {
      data['postDiv'].children[1].children[0].className = 'full-post-photo';
    }
    data['descriptionDiv'].innerHTML = data['description'].trim().replace('\n', '<br><br>');
    data['postDiv'].removeChild(data['readMoreButtonDiv']);

    if (data['resourceURL']) {
      var url = document.createElement('a');
      url.href = data['resourceURL'];
      url.target = 'blank';
      url.innerHTML = data['resourceURL'].substr(data['resourceURL'].lastIndexOf('//') + 2);
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

      data['postDiv'].insertBefore(optionsBar, data['locationDiv']);
    }

    showMap(data);

    el.postsParent.innerHTML = '';
    el.postsParent.appendChild(data['postDiv']);
    window.scrollTo(0, 0);
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
      data['postDiv'].insertBefore(el.mapParent, data['footerDiv']);
      mapDiv.style.height = '20rem';
      obj.map = new OLMap(mapDiv.id);
    }
    else {
      obj.map.resetState();
      data['postDiv'].insertBefore(el.mapParent, data['footerDiv']);
    }

    obj.map.setZoom(zoom);
    obj.map.addLocation({lat: data['lat'], lon: data['lon']});
    obj.map.drawMap();
  }

  /**
   * Requests the new post form from the server. Called when the new post button is clicked.
   * @param username
   */
  function getPostForm(username) {
    Requests.cancelExcept(null);
    Init.scrollTo(el.postButton);
    formMsg.showElement(el.postFormLoadMsg, Init.loader);

    var formData = new FormData();
    formData.append("action", "GetPostForm");
    var ID = Requests.add(ajaxRequest('POST', 'Main', formData, successCallback, failCallback));

    function successCallback() {
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
      if (Requests.get(ID).status === 401) {
        Logout.showExpired();
      }
      else if (Requests.get(ID).status === 0) {
        formMsg.showError(el.postFormLoadMsg,'Unable to send request');
      }
      else {
        formMsg.showError(el.postFormLoadMsg,'Error');
      }
      Init.scrollTo(el.postButton);
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
      confirmDelete(data);
    });

    data['postDiv'].appendChild(el.deleteButton);
    el.deleteMsg = document.createElement('div');
    el.deleteMsg.id = 'delete-post-msg';
    el.deleteButton.appendChild(el.deleteMsg);

    var div = document.createElement('div');
    div.id = 'post-options-menu';
    div.appendChild(el.deleteButton);

    return div;
  }

  /**
   * Creates yes/no post delete confirmation buttons.
   * @param data
   */
  function confirmDelete(data) {
    if (!el.confirmDelete) {
      el.confirmDelete = newElements.createYesNoButtons('post-delete-confirm');

      //listener for the yes button
      el.confirmDelete.children[1].addEventListener('click', function() {
        el.confirmDelete = null;
        deletePost(data['postDiv'], data['username'], data['postID']);
      });

      //listener for the no button
      el.confirmDelete.children[2].addEventListener('click', function() {
        formMsg.clear(el.deleteMsg);
        el.confirmDelete = null;
      });
      formMsg.showElement(el.deleteMsg, el.confirmDelete);
    }
    Init.scrollTo(el.deleteButton);
  }

  return {
    init: init
  };
}());