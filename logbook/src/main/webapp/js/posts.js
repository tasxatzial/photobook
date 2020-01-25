'use strict';

var Posts = (function() {
  var el = {
    postsParent: null,
    mapParent: null
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

  function init(username) {
    data.username = username;
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

  function getPosts(username) {
    Requests.cancelExcept(null);

    var loader = newElements.createLoader("images/loader.gif");
    var loaderMsg = el.postsParent.children[1];
    formMsg.showElement(loaderMsg, loader);

    var formData = new FormData();
    formData.append("action", "GetPosts");
    if (username !== null) {
      formData.append('username', username);
    }
    var ID = Requests.add(ajaxRequest('POST', 'Main', formData, successCallback, failCallback));

    function successCallback() {
      var response = JSON.parse(Requests.get(ID).responseText);
      if (response.ERROR) {
        Logout.showExpired();
        return;
      }

      formMsg.clear(loaderMsg);
      var shortPost = null;
      var numPosts = 0;
      Object.keys(response).forEach(function(key,index) {
        shortPost = createShortPost(response[key]);
        el.postsParent.appendChild(document.createElement('hr'));
        el.postsParent.appendChild(shortPost);
        numPosts++;
      });
      if (numPosts === 0) {
        loaderMsg.innerHTML = 'This user hasn\'t posted anything.';
      }
    }

    function failCallback() {
      formMsg.clear(loaderMsg);
      console.log(Requests.get(ID).responseText);
    }
  }

  function deletePost(fullPost, username, postID) {
    Requests.cancelExcept(null);

    var formData = new FormData();
    formData.append("action", "DeletePost");
    formData.append("postID", postID);
    formData.append("username", username);

    var ID = Requests.add(ajaxRequest('POST', "Main", formData, successCallback, failCallback));

    function successCallback() {
      if (JSON.parse(Requests.get(ID).responseText).ERROR) {
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

  function createPostsSection(username) {
    var header = document.createElement('header');
    var headerH2 = document.createElement('h2');
    headerH2.innerHTML = 'Latest posts';
    header.appendChild(headerH2);

    var loaderMsg = document.createElement('div');
    loaderMsg.id = 'sign-process-msg';

    var postsParent = document.createElement('div');
    postsParent.id = 'posts-parent';

    if (username === Init.getUser() || username === null) {
      var postButton = newElements.createBlueButton('+ New Post', 'new-post-button');
      postButton.addEventListener('click', function() {
        getPostForm(username);
      });
      postsParent.appendChild(postButton);
    }
    postsParent.appendChild(header);
    postsParent.appendChild(loaderMsg);

    var postsSection = document.createElement('div');
    postsSection.id = 'posts-section';
    postsSection.appendChild(postsParent);

    return postsSection;
  }

  function createShortPost(postJSON) {
    var postDiv = null;
    var queryLatLon = null;

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
    readMoreButton.addEventListener('click', function () {
      var fullPostData = {
        description: postJSON['description'],
        resourceURL: postJSON['resourceURL'],
        lat: postJSON['latitude'],
        lon: postJSON['longitude'],
        username: postJSON['username'],
        postID: postJSON['postID'],
        locationQuery: queryLatLon.getLocation(),
        descriptionDiv: description,
        readMoreButtonDiv: readMoreButton,
        footerDiv: footer,
        queryID: queryLatLon.getQueryID(),
        postDiv: postDiv,
        locationDiv: location
      };
      turnToFullPost(fullPostData);
    });

    var button = document.createElement('button');
    button.className = 'transparent-button';
    button.innerHTML = postJSON['username'];
    button.style.textDecoration = 'underline';
    button.onclick = function() {
      ShowProfile.init(postJSON['username'], true);
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

    /* var rating = document.createElement('div');
    rating.innerHTML = "Rating: ";
    rating.className = 'post-rating';*/

    var footer = document.createElement('div');
    footer.className = 'post-footer';
    footer.appendChild(username);
    /* footer.appendChild(rating); */

    var location = newElements.createKeyValue('Location', 'Querying...');
    location.id = 'post-location';

    var nextButton = newElements.createArrowButton('images/right.png');
    nextButton.className = 'transparent-button';

    postDiv = document.createElement('div');
    postDiv.appendChild(location);
    if (image.src) {
      postDiv.appendChild(imageParent);
    }
    postDiv.appendChild(description);
    postDiv.appendChild(footer);

    var queryLatLonData = {
      lat: postJSON['latitude'],
      lon: postJSON['longitude'],
      postDiv: postDiv,
      footerDiv: footer,
      locationDiv: location
    };
    queryLatLon = new QueryLatLon(queryLatLonData);

    postDiv.appendChild(readMoreButton);

    return postDiv;
  }

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
          var mapData = {
            locationQuery: locationQuery,
            lat: data['lat'],
            lon: data['lon'],
            postDiv: data['postDiv'],
            footerDiv: data['footerDiv']
          };
          showMap(mapData);
        }
      }

      function failCallback() {
        data['locationDiv'].children[0].innerHTML = 'Not available';
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

  function turnToFullPost(data) {
    state.clickedFullPost = true;
    Requests.cancelExcept(data['queryID']);

    if (data['postDiv'].children[1].className === 'short-post-photo-parent') {
      data['postDiv'].children[1].children[0].className = 'full-post-photo';
    }
    data['descriptionDiv'].innerHTML = data['description'].trim().replace('\n', '<br><br>');
    data['postDiv'].removeChild(data['readMoreButtonDiv']);

    /*var rating = postedBy.children[1];
      if (data['username'] !== Init.getUser()) {
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
    } */

    if (data['resourceURL']) {
      var url = document.createElement('a');
      url.href = data['resourceURL'];
      url.target = 'blank';
      url.innerHTML = data['resourceURL'];
      var onlineURL = newElements.createKeyValue('See also', url, 1);
      data['postDiv'].insertBefore(onlineURL, data['postedBy']);
    }

    if (data['username'] === Init.getUser()) {
      var optionsData = {
        locationDiv: data['locationDiv'],
        postDiv: data['postDiv'],
        username: data['username'],
        postID: data['postID']
      };
      var optionsBar = createPostOptionsBar(optionsData);
      data['postDiv'].insertBefore(optionsBar, data['locationDiv']);
    }

    if (data['locationQuery']) {
      var mapData = {
        locationQuery: data['locationQuery'],
        lat: data['lat'],
        lon: data['lon'],
        postDiv: data['postDiv'],
        footerDiv: data['footerDiv']
      };
      showMap(mapData);
    }

    el.postsParent.innerHTML = '';
    el.postsParent.appendChild(data['postDiv']);
    window.scrollTo(0, 0);
  }

  function showMap(data) {
    if (!data['locationQuery']) {
      return;
    }
    var zoom = null;
    if (data['locationQuery'].address) {
      zoom = 16;
    }
    else {
      zoom = 12;
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

  function getPostForm(username) {
    Requests.cancelExcept(null);

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
      console.log(Requests.get(ID).responseText);
    }
  }

  function createPostFormSection() {
    var postFormParent = document.createElement('div');
    postFormParent.id = 'post-form-parent';

    var postFormSection = document.createElement('div');
    postFormSection.id = 'post-form-section';
    postFormSection.appendChild(postFormParent);

    return postFormSection;
  }

  function createPostOptionsBar(data) {
    var div = document.createElement('div');
    div.id = 'post-options-bar';

    var button = createPostOptionsShowButton(data, div);
    div.appendChild(button);

    return div;
  }

  function createPostOptionsShowButton(data, div) {
    var img = document.createElement('img');
    img.src = "images/settings.png";
    img.alt = "Show Post options";

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'transparent-button';
    button.id = 'post-options-button';
    button.appendChild(img);
    button.addEventListener('click', function() {
      showPostOptionsMenu(data, div);
    });
    return button;
  }

  function createPostOptionsCloseButton(data, menu, div) {
    var img = document.createElement('img');
    img.src = "images/x.png";
    img.alt = "Hide Post options";

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'transparent-button';
    button.id = 'post-options-button';
    button.appendChild(img);
    button.addEventListener('click', function() {
      closePostOptionsMenu(data, menu, div);
    });

    return button;
  }

  function closePostOptionsMenu(data, menu, div) {
    div.innerHTML = '';
    data['postDiv'].removeChild(menu);

    var openButton = createPostOptionsShowButton(data, div);
    div.appendChild(openButton);
  }

  function showPostOptionsMenu(data, div) {
    div.innerHTML = '';
    var menu = createPostOptionsMenu(data);
    var closeButton = createPostOptionsCloseButton(data, menu, div);
    div.appendChild(closeButton);


    data['postDiv'].insertBefore(menu, data['locationDiv']);
  }

  function createPostOptionsMenu(data) {
    var deleteButton = newElements.createBlueButton('Delete post', 'delete-post-button');
    deleteButton.children[0].addEventListener('click', function () {
      deletePost(data['postDiv'], data['username'], data['postID']);
    });
    data['postDiv'].appendChild(deleteButton);
    var deleteMsg = document.createElement('div');
    deleteMsg.id = 'delete-post-msg';
    deleteButton.appendChild(deleteMsg);

    var div = document.createElement('div');
    div.id = 'post-options-menu';
    div.appendChild(deleteButton);

    return div;
  }

  return {
    init: init
  };
}());