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

  function createKeyValue(key, value) {
    var span = document.createElement('span');
    span.innerHTML = value;
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

  function createAccountSection(username, owner) {
    var header = document.createElement('header');
    var headerH2 = document.createElement('h2');
    headerH2.innerHTML = username;
    header.appendChild(headerH2);

    var navTabs = createNavTabs(username, owner);

    var div = document.createElement('div');
    div.id = 'account-parent';
    div.appendChild(header);
    div.appendChild(navTabs);

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
      img.src = 'images/right.png';
      img.className = 'username-arrow';

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
    button.className = 'arrow-button';
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

  function createNavTabs(username, owner) {
    var navTabs = document.createElement('div');
    navTabs.id = 'account-nav';

    var showProfileButton = createNavTab('Profile');
    var showPostsButton = createNavTab('Posts');

    navTabs.appendChild(showProfileButton);
    navTabs.appendChild(showPostsButton);

    if (owner) {
      var editAccountButton = createNavTab('Edit Account');
      navTabs.appendChild(editAccountButton);
    }

    return navTabs;
  }

  function createUsersList(pages) {
    if (!pages) {
      pages = 1;
    }
    var div = document.createElement('div');
    div.id = 'userlist-parent';

    var header = document.createElement('header');
    var headerH2 = document.createElement('h2');
    headerH2.innerHTML = 'Users';
    header.appendChild(headerH2);

    var prevButton = createArrowButton('images/left.png');
    var nextButton = createArrowButton('images/right.png');
    var selectPages = createSelectPage(pages);
    var buttonSection = document.createElement('div');
    buttonSection.id = 'userlist-nav';
    buttonSection.appendChild(prevButton);
    buttonSection.appendChild(selectPages);
    buttonSection.appendChild(nextButton);

    div.appendChild(header);
    div.appendChild(buttonSection);

    var userlistSection = document.createElement('div');
    userlistSection.id = 'userlist-section';
    userlistSection.appendChild(div);
    return userlistSection;
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
    createAccountSection: createAccountSection
  };
}());