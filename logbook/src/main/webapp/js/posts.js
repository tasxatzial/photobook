'use strict';

var Posts = (function() {
  var obj = {
    mapObj: null
  };

  var el = {
    postsSection: null,
    loader: null
  };

  var data = {
    username: null
  };

  function init(username, owner) {
    data.username = username;

    el.postsSection = createPostsSection(username, owner);

    if (username === false) {
      el.postsSection.children[0].className = 'parent-in-main';
      Init.nonav.innerHTML = '';
      Init.nonav.appendChild(el.postsSection);
    }
    else {
      el.postsSection.children[0].className = 'parent-in-myaccount';
      var accountSubsection = document.getElementById('account-subsection');
      accountSubsection.innerHTML = '';
      accountSubsection.appendChild(el.postsSection);
    }

    if (username === false || username === null || owner === true) {
      var newPostButton = el.postsSection.children[0].children[0];
      newPostButton.addEventListener('click', function() {
        PostForm.init(username);
      });
    }

    getPosts(username);
  }

  function getPosts(username) {
    var state = {
      xhr: null,
      xhrResponse: null
    };

    var formData = new FormData();
    formData.append("action", "GetPosts");
    if (username === null) {
      formData.append('owner', '1');
    }
    else if (username !== false) {
      formData.append('username', username);
    }

    var loaderParent = document.getElementById('posts-loader');
    var loader = newElements.createLoader("images/loader.gif");
    loaderParent.appendChild(loader);

    state.xhr = ajaxRequest('POST', 'Main', formData, successCallback, failCallback);
    function successCallback() {
      state.xhrResponse = JSON.parse(state.xhr.responseText);
      if (state.xhrResponse.ERROR) {
        Logout.showExpired();
        return;
      }

      loaderParent.removeChild(loader);
      var shortPost = null;
      Object.keys(state.xhrResponse).forEach(function(key,index) {
        shortPost = createShortPost(state.xhrResponse[key]);
        el.postsSection.children[0].appendChild(document.createElement('hr'));
        el.postsSection.children[0].appendChild(shortPost);
      });
    }

    function failCallback() {
      loaderParent.removeChild(loader);
      console.log(state.xhr.responseText);
    }
  }

  function deletePost(fullPost) {
    var state = {
      xhr: null
    };

    var formData = new FormData();
    formData.append("action", "DeletePost");
    formData.append("postID", fullPost.id.substring(6));
    formData.append("username", fullPost.username);

    state.xhr = ajaxRequest('POST', "Main", formData, successCallback, failCallback);

    function successCallback() {
      if (JSON.parse(state.xhr.responseText).ERROR) {
        Logout.showExpired();
        return;
      }

      Posts.init(data.username);
    }

    function failCallback() {
      var deleteMsg = document.getElementById('delete-post-msg');
      formMsg.showError(deleteMsg, 'Error');
    }
  }

  function createPostsSection(username, owner) {
    var header = document.createElement('header');
    var headerH2 = document.createElement('h2');
    headerH2.innerHTML = 'Latest posts';
    header.appendChild(headerH2);

    var loader = document.createElement('div');
    loader.id = 'posts-loader';

    var postsParent = document.createElement('div');
    postsParent.id = 'posts-parent';

    if (username === false || username === null || owner === true) {
      var postButton = newElements.createBlueButton('+ New Post', 'new-post-button');
      postsParent.appendChild(postButton);
    }
    postsParent.appendChild(header);
    postsParent.appendChild(loader);

    var postsSection = document.createElement('div');
    postsSection.id = 'posts-section';
    postsSection.appendChild(postsParent);

    return postsSection;
  }

  function createShortPost(postJSON) {
    var state = {
      xhr: null,
      xhrResponse: null,
      responseLocation: null
    };

    var nominatimAPI = {
      reverseUrl: 'https://nominatim.openstreetmap.org/reverse'
    };

    var description = document.createElement('p');
    description.className = 'post-description';
    if (postJSON['description'].length > 350) {
      description.innerHTML = postJSON['description'].trim().replace('\n', '<br><br>').substring(0, 350) + ' ...';
    }
    else {
      description.innerHTML = postJSON['description'].trim().replace('\n', '<br><br>');
    }

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

    var readMore = document.createElement('p');
    readMore.className = 'read-more';
    readMore.innerHTML = 'Read the full post';

    var img = document.createElement('img');
    img.className = 'post-show-more-arrow';
    img.src = 'images/right.png';

    var readMoreButton = document.createElement('button');
    readMoreButton.className = 'read-more-button';
    readMoreButton.appendChild(readMore);
    readMoreButton.appendChild(img);
    readMoreButton.disabled = true;

    var button = document.createElement('button');
    button.className = 'transparent-button';
    button.innerHTML = postJSON['userName'];
    button.style.textDecoration = 'underline';
    button.onclick = function() {
      ShowProfile.init(postJSON['userName'], true);
    };

    var at = document.createElement('span');
    at.innerHTML = ' at ';
    at.style.fontWeight = 'bold';

    var postedBy = document.createElement('div');
    postedBy.innerHTML = 'Posted by:';
    postedBy.style.fontWeight = 'bold';

    var timestamp = document.createElement('span');
    timestamp.innerHTML = postJSON['createdAt'].substring(0, postJSON['createdAt'].lastIndexOf(":"));

    var username = document.createElement('div');
    username.className = 'posted-by';
    username.appendChild(postedBy);
    username.appendChild(button);
    username.appendChild(at);
    username.appendChild(timestamp);

    var rating = document.createElement('div');
    rating.innerHTML = "Rating: ";
    rating.className = 'post-rating';

    var footer = document.createElement('div');
    footer.className = 'post-footer';
    footer.appendChild(username);
    footer.appendChild(rating);

    var location = newElements.createKeyValue('Location', 'Querying...');

    var nextButton = newElements.createArrowButton('images/right.png');
    nextButton.className = 'transparent-button';

    var postContainer = document.createElement('div');
    postContainer.id = 'postID' + postJSON['postID'];
    postContainer.username = postJSON['userName'];
    postContainer.appendChild(location);
    if (image.src) {
      postContainer.appendChild(imageParent);
    }
    postContainer.appendChild(description);
    postContainer.appendChild(footer);
    postContainer.appendChild(readMoreButton);

    readMoreButton.addEventListener('click', function () {
      var data = {
        description: postJSON['description'],
        resourceURL: postJSON['resourceURL'],
        location: state.responseLocation,
        lat: postJSON['latitude'],
        lon: postJSON['longitude'],
        owner: postJSON['owner']
      };
      if (state.responseLocation && state.responseLocation.address) {
        data.zoom = 15;
      }
      else {
        data.zoom = 11;
      }
      turnToFullPost(postContainer, data);
    });

    var input = LocationSearch.createLatLonInput(postJSON['latitude'], postJSON['longitude']);
    if (input) {
      state.xhr = ajaxRequest('GET', nominatimAPI.reverseUrl + input, null, successCallback, failCallback);
    }
    else {
      failCallback();
    }
    function successCallback() {
      state.xhrResponse = JSON.parse(state.xhr.responseText);
      state.responseLocation = LocationSearch.parseReverseSearch(state.xhrResponse);
      if (!state.responseLocation) {
        failCallback();
        return;
      }

      var loc = '';
      if (state.responseLocation.country) {
        loc += state.responseLocation.country;
      }
      else if (state.responseLocation.country_code) {
        loc += state.responseLocation.country_code;
      }
      if (state.responseLocation.city) {
        loc += ', ' + state.responseLocation.city;
      }
      if (state.responseLocation.address) {
        loc += ', ' + state.responseLocation.address;
      }
      location.children[0].innerHTML = loc;
      readMoreButton.disabled = false;
    }

    function failCallback() {
      location.children[0].innerHTML = 'Not available';
      readMoreButton.disabled = false;
    }

    return postContainer;
  }

  function turnToFullPost(shortPost, data) {
    var photoParent = null;
    var description = null;
    var postedBy = null;
    var readMore = null;
    if (shortPost.children[1].className === 'short-post-photo-parent') {
      photoParent = shortPost.children[1];
      photoParent.children[0].className = 'full-post-photo';
      description = shortPost.children[2];
      postedBy = shortPost.children[3];
      readMore = shortPost.children[4];
    }
    else {
      description = shortPost.children[1];
      postedBy = shortPost.children[2];
      readMore = shortPost.children[3];
    }

    var rating = postedBy.children[1];

    description.innerHTML = data['description'].trim().replace('\n', '<br><br>');
    shortPost.removeChild(readMore);

    if (!data['owner']) {
      rating.innerHTML = 'Rate';
      var select = document.createElement('select');
      select.id = 'rating-select';

      var defaultSelect = document.createElement('option');
      defaultSelect.selected = true;
      defaultSelect.value = '0';
      defaultSelect.innerHTML = '-';

      select.appendChild(defaultSelect);
      for (var i = 1; i <= 5; i++) {
        var option = document.createElement('option');
        option.value = String(i);
        option.innerHTML = String(i);
        select.appendChild(option);
      }

      rating.appendChild(select);
    }

    if (data['resourceURL']) {
      var url = document.createElement('a');
      url.href = data['resourceURL'];
      url.target = 'blank';
      url.innerHTML = data['resourceURL'];
      var onlineURL = newElements.createKeyValue('See also', url, 1);
      shortPost.insertBefore(onlineURL, postedBy);
    }

    if (data['location']) {

      /* creates a map object only once */
      if (!obj.mapObj) {
        var mapDiv = document.createElement('div');
        mapDiv.id = 'map-post';
        var mapParent = document.createElement('div');
        mapParent.id = 'post-map-parent';
        mapParent.appendChild(mapDiv);
        shortPost.insertBefore(mapParent, postedBy);

        mapDiv.style.height = '20rem';
        obj.mapObj = new OLMap(mapDiv.id);
      }
      else {
        shortPost.insertBefore(obj.mapObj.getDiv().parentElement, postedBy);
        obj.mapObj.resetState();
      }

      obj.mapObj.setZoom(data['zoom']);
      obj.mapObj.addLocation({lat: data['lat'], lon: data['lon']});
      obj.mapObj.drawMap();
      /* creates a new map object every time a full post is shown */
      /*var mapDiv = document.createElement('div');
      mapDiv.id = 'map-post';
      var mapParent = document.createElement('div');
      mapParent.id = 'post-map-parent';
      mapParent.appendChild(mapDiv);
      shortPost.insertBefore(mapParent, postedBy);

      mapDiv.style.height = '20rem';
      var map = new OLMap(mapDiv.id);
      map.setZoom(data['zoom']);
      map.addLocation({lat: data['lat'], lon: data['lon']});
      map.drawMap();*/
    }

    if (data['owner']) {
      var deleteButton = newElements.createBlueButton('Delete post', 'delete-post-button');
      shortPost.appendChild(deleteButton);
      var deleteMsg = document.createElement('div');
      deleteMsg.id = 'delete-post-msg';
      deleteButton.appendChild(deleteMsg);
      deleteButton.children[0].addEventListener('click', function () {
        deletePost(shortPost);
      });
    }

    el.postsSection.children[0].innerHTML = '';
    el.postsSection.children[0].appendChild(shortPost);
    window.scrollTo(0, 0);
  }

  return {
    init: init
  };
}());