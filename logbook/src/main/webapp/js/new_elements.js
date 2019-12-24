'use strict';

var newElements = (function NewElements() {

  function createMapButton() {
    var button = document.createElement('button');
    button.type = 'button';
    button.id = 'signup-show-map-button';
    button.innerHTML = 'Show map';
    button.className = 'sign-internal-button';

    return button;
  }

  function createBlueButton(value, id) {
    var div = document.createElement('div');
    div.className = 'sign-button';
    div.id = id;

    var input = document.createElement('input');
    input.type = 'button';
    input.value = value;

    div.appendChild(input);

    return div;
  }

  function createSignUpPhotoSection() {
    var selectButton = document.createElement('button');
    selectButton.id = 'signup-pick-photo-button';
    selectButton.disabled = true;
    selectButton.type = 'button';
    selectButton.className = 'sign-internal-button';
    selectButton.innerHTML = 'Choose photo';

    var input = document.createElement('input');
    input.id = 'file-input';
    input.type = 'file';
    input.name = 'name';
    input.style.display = 'none';

    var uploadButton = document.createElement('button');
    uploadButton.id = 'signup-upload-photo-button';
    uploadButton.disabled = true;
    uploadButton.type = 'button';
    uploadButton.innerHTML = 'Upload photo';
    uploadButton.className = 'sign-internal-button';

    var divButtons = document.createElement('div');
    divButtons.id = 'signup-photo-control-buttons';
    divButtons.appendChild(selectButton);
    divButtons.appendChild(input);
    divButtons.appendChild(uploadButton);

    var uploadMsg = document.createElement('div');
    uploadMsg.id = 'signup-upload-photo-msg';
    uploadMsg.className="sign-process-msg";

    var controls = document.createElement('div');
    controls.id = 'signup-photo-controls';
    controls.appendChild(divButtons);
    controls.appendChild(uploadMsg);
  
    var divPhoto = document.createElement('div');
    divPhoto.id = 'signup-photo-parent';

    var divContent = document.createElement('div');
    divContent.id = 'signup-photo-section-hidden';
    divContent.appendChild(controls);
    divContent.appendChild(divPhoto);
    return divContent;
  }

  function createSignInPhotoSection() {
    var photoContainer = document.createElement('div');
    photoContainer.id = 'signin-photo-parent';

    var uploadMsg = document.createElement('div');
    uploadMsg.className = 'sign-process-msg';

    var section = document.createElement('div');
    section.id = 'signin-photo-section';
    section.className = 'sign-child';
    section.appendChild(photoContainer);
    section.appendChild(uploadMsg);

    return section;
  }

  function createLoader(pathToFile) {
    var loader = document.createElement('img');
    loader.src = pathToFile;
    loader.className = 'loader';

    return loader;
  }

  function createSignBarButton(value, id) {
    var button = document.createElement('input');
    button.type = 'button';
    button.className = 'navbar-button';
    button.value = value;
    button.id = id;

    return button;
  }

  function createInvalidValueMsg(text) {
    var msg = document.createElement('div');
    msg.innerHTML = text;
    msg.className = 'invalid-value';

    return msg;
  }

  function createKeyValue(key, value, append) {
    var span = document.createElement('span');
    if (append) {
      span.innerHTML = '';
      span.appendChild(value);
    }
    else {
      span.innerHTML = value;
    }
    span.className = 'normal-font-weight';

    var msg = document.createElement('p');
    msg.innerHTML = key + ': ';
    msg.className = 'bold-font-weight';
    msg.appendChild(span);

    return msg;
  }

  function createSignupSummary(response, dataNames, skipEmpty) {
    var div = document.createElement('div');
    for (var i = 0; i < dataNames.length; i++) {
      if (response[dataNames[i][0]] !== undefined &&
          (skipEmpty === false || response[dataNames[i][0]] !== '' )) {
        var msg = createKeyValue(dataNames[i][1], response[dataNames[i][0]]);
        div.appendChild(msg);
      }
    }
    return div;
  }

  function createPostsSection(username) {
    var header = document.createElement('header');
    var headerH2 = document.createElement('h2');
    headerH2.innerHTML = 'Latest posts';
    header.appendChild(headerH2);

    var loader = document.createElement('div');
    loader.id = 'posts-loader';

    var postsParent = document.createElement('div');
    postsParent.id = 'posts-parent';

    if (username === false || username === null) {
      var postButton = createBlueButton('+ New Post', 'new-post-button');
      postsParent.appendChild(postButton);
    }
    postsParent.appendChild(header);
    postsParent.appendChild(loader);

    var postsSection = document.createElement('div');
    postsSection.id = 'posts-section';
    postsSection.appendChild(postsParent);

    return postsSection;
  }

  function createAccountSection(username, owner) {
    var header = document.createElement('header');
    var headerH2 = document.createElement('h2');
    headerH2.innerHTML = username;
    header.appendChild(headerH2);

    var navTabs = createNavTabs(owner);
    var content = document.createElement('div');
    content.id = 'account-subsection';

    var div = document.createElement('div');
    div.id = 'account-parent';
    div.className = 'parent-in-main';

    div.appendChild(header);
    div.appendChild(navTabs);
    div.appendChild(content);

    var accountSection = document.createElement('div');
    accountSection.id = 'account-section';
    accountSection.appendChild(div);

    return accountSection;
  }

  function createAllUsers(page) {
    var hrBottom = document.createElement('hr');
    hrBottom.className = 'userlist-hr-bottom';

    var div = document.createElement('div');
    div.appendChild(hrBottom);

    Object.keys(page).forEach(function(key, index) {
      var msg = createKeyValue(key, page[key]);

      var img = document.createElement('img');
      img.className = 'user-show-more-arrow';
      img.src = 'images/right.png';

      var user = document.createElement('div');
      user.className = "username-line";
      user.appendChild(msg);
      user.appendChild(img);

      var button = document.createElement('button');
      button.className = 'username-button';
      button.appendChild(user);
      button.onclick = function() {
        ShowProfile.init(page[key], 1);
      };

      var hr = document.createElement('hr');
      hr.className = 'userlist-hr';

      div.appendChild(button);
      div.appendChild(hr);
    });

    return div;
  }

  function createSelectPage(pages) {
    var select = document.createElement('select');
    select.className = "sign-tofill";

    var option = null;
    for (var i = 1; i <= pages; i++) {
      option = document.createElement('option');
      option.value = String(i);
      option.innerHTML = String(i);
      select.appendChild(option);
    }
    select.children[0].selected = true;

    var div = document.createElement('div');
    div.id = 'userlist-select';
    div.appendChild(select);

    return div;
  }

  function createArrowButton(imageUrl) {
    var img = document.createElement('img');
    img.src = imageUrl;
    img.alt = "";

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'transparent-button';
    button.appendChild(img);

    return button;
  }

  function createNavTab(name) {
    var button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = name;
    button.className = 'account-nav-button';
    return button;
  }

  function createNavTabs(owner) {
    var navTabs = document.createElement('div');
    navTabs.id = 'account-nav';

    var showProfileButton = createNavTab('Profile');
    var showPostsButton = createNavTab('Posts');

    navTabs.appendChild(showProfileButton);
    navTabs.appendChild(showPostsButton);

    if (owner) {
      var editAccountButton = createNavTab('Account');
      navTabs.appendChild(editAccountButton);
    }

    return navTabs;
  }

  function createUsersList(pages) {
    if (!pages) {
      pages = 1;
    }

    var headerH2 = document.createElement('h2');
    headerH2.innerHTML = 'Users';

    var header = document.createElement('header');
    header.appendChild(headerH2);

    var prevButton = createArrowButton('images/left.png');
    prevButton.className = 'userlist-arrow-button transparent-button';
    prevButton.id = 'userlist-left-arrow-button';

    var nextButton = createArrowButton('images/right.png');
    nextButton.className = 'userlist-arrow-button transparent-button';
    nextButton.id = 'userlist-right-arrow-button';

    var selectPages = createSelectPage(pages);

    var buttonSection = document.createElement('div');
    buttonSection.id = 'userlist-nav';
    buttonSection.appendChild(prevButton);
    buttonSection.appendChild(selectPages);
    buttonSection.appendChild(nextButton);

    var div = document.createElement('div');
    div.id = 'userlist-parent';
    div.className = 'parent-in-main';

    div.appendChild(header);
    div.appendChild(buttonSection);

    var userlistSection = document.createElement('div');
    userlistSection.id = 'userlist-section';
    userlistSection.appendChild(div);

    return userlistSection;
  }

  function createPostFormSection() {
    var postFormParent = document.createElement('div');
    postFormParent.id = 'post-form-parent';

    var postFormSection = document.createElement('div');
    postFormSection.id = 'post-form-section';
    postFormSection.appendChild(postFormParent);

    return postFormSection;
  }

  function createShortPost(postJSON, callback, mapObj) {
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
      ShowProfile.init(postJSON['userName'], 1);
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

    var location = createKeyValue('Location', 'Querying...');

    var nextButton = createArrowButton('images/right.png');
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
      turnToFullPost(postContainer, data, callback, mapObj);
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


  function turnToFullPost(shortPost, data, callback, mapObj) {
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
      var onlineURL = createKeyValue('See also', url, 1);
      shortPost.insertBefore(onlineURL, postedBy);
    }

    if (data['location']) {

      /* creates a map object only once */
      if (!mapObj) {
        var mapDiv = document.createElement('div');
        mapDiv.id = 'map-post';
        var mapParent = document.createElement('div');
        mapParent.id = 'post-map-parent';
        mapParent.appendChild(mapDiv);
        shortPost.insertBefore(mapParent, postedBy);

        mapDiv.style.height = '20rem';
        mapObj = new OLMap(mapDiv.id);
      }
      else {
        shortPost.insertBefore(mapObj.getDiv().parentElement, postedBy);
        mapObj.resetState();
      }

      mapObj.setZoom(data['zoom']);
      mapObj.addLocation({lat: data['lat'], lon: data['lon']});
      mapObj.drawMap();
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
      var deleteButton = createBlueButton('Delete post', 'delete-post-button');
      shortPost.appendChild(deleteButton);
      var deleteMsg = document.createElement('div');
      deleteMsg.id = 'delete-post-msg';
      deleteButton.appendChild(deleteMsg);
    }

    callback(shortPost, mapObj);
  }

  function createEditAccountSection() {
    var editAccount = createBlueButton('Edit Account', 'edit-account-button');
    var deleteAccount = createBlueButton('Delete Account', 'delete-account-button');
    var deleteAccountMsg = document.createElement('div');
    deleteAccountMsg.id = 'delete-account-msg';
    deleteAccount.appendChild(deleteAccountMsg);

    var div = document.createElement('div');
    div.id = 'edit-account-parent';
    div.className = 'parent-in-myaccount';

    div.appendChild(editAccount);
    div.appendChild(deleteAccount);

    var section = document.createElement('div');
    section.id = 'edit-account-section';
    section.appendChild(div);

    return section;
  }

  function createYesNoButtons(id) {
    var yesButton = document.createElement('button');
    yesButton.innerHTML = 'Yes';
    yesButton.className = 'yes-no-button';
    yesButton.id = id + '-yes-button';

    var noButton = document.createElement('button');
    noButton.innerHTML = 'No';
    noButton.className = 'yes-no-button';
    noButton.id = id + '-no-button';

    var text = document.createElement('div');
    text.innerHTML = 'Please confirm';
    text.id = id + '-text';

    var div = document.createElement('div');
    div.id = id;

    div.appendChild(text);
    div.appendChild(yesButton);
    div.appendChild(noButton);

    return div;
  }

  function createProfileSection(response, dataNames, skipEmpty) {
    var profileParent = createSignupSummary(response, dataNames, skipEmpty);
    profileParent.id = 'profile-parent';
    profileParent.className = 'parent-in-myaccount';

    var profileSection = document.createElement('div');
    profileSection.id = 'profile-section';
    profileSection.appendChild(profileParent);

    return profileSection;
  }
  return {
    createMapButton: createMapButton,
    createSignInPhotoSection: createSignInPhotoSection,
    createSignUpPhotoSection: createSignUpPhotoSection,
    createLoader: createLoader,
    createSignBarButton: createSignBarButton,
    createInvalidValueMsg: createInvalidValueMsg,
    createSignupSummary: createSignupSummary,
    createUsersList: createUsersList,
    createAllUsers: createAllUsers,
    createAccountSection: createAccountSection,
    createPostsSection: createPostsSection,
    createPostFormSection: createPostFormSection,
    createShortPost: createShortPost,
    createYesNoButtons: createYesNoButtons,
    createEditAccountSection: createEditAccountSection,
    createProfileSection: createProfileSection
  };
}());