'use strict';

var ShowProfile = (function() {
  var el = {
    accountSubsection: null
  };

  function init(username, firstTime) {
    Requests.cancelExcept(null);

    if (firstTime === true) {
      Init.nonav.innerHTML = '';
      Init.nonav.appendChild(createAccountSection(username));
      el.accountSubsection = document.getElementById('account-subsection');
    }
    else {
      el.accountSubsection.innerHTML = '';
    }

    var profileSection = createProfileSection();
    var profileParent = profileSection.children[0];
    var loaderMsg = profileParent.children[0];
    var loader = newElements.createLoader("images/loader.gif");
    formMsg.showElement(loaderMsg, loader);

    el.accountSubsection.appendChild(profileSection);

    var navTabs = document.getElementById('account-nav');
    showBorders(navTabs.children[0], navTabs.children[1], navTabs.children[2]);

    var data = new FormData();
    data.append("action", "GetProfile");
    if (username !== null) {
      data.append("username", username);
    }
    var ID = Requests.add(ajaxRequest("POST", "Main", data, successCallback, failCallback));

    function successCallback() {
      var response = JSON.parse(Requests.get(ID).responseText);
      if (response.ERROR) {
        Logout.showExpired();
        return;
      }

      formMsg.clear(loaderMsg);
      var profile = newElements.createSignupSummary(response,  Init.dataNames);
      profileParent.appendChild(profile);
    }

    function failCallback() {
      formMsg.clear(loaderMsg);
      console.log(Requests.get(ID).responseText);
    }
  }

  function showBorders(buttonActive, button2, button3) {
    buttonActive.className = 'account-nav-button active-tab';
    button2.className = 'account-nav-button inactive-tab';
    if (button3) {
      button3.className = 'account-nav-button inactive-tab';
    }
  }

  function createAccountSection(username) {
    var header = document.createElement('header');
    var headerH2 = document.createElement('h2');
    headerH2.innerHTML = username;
    header.appendChild(headerH2);

    var navTabs = createNavTabs(username);

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

  function createProfileSection() {
    var loaderMsg = document.createElement('div');
    loaderMsg.id = 'sign-process-msg';

    var profileParent = document.createElement('div');
    profileParent.id = 'profile-parent';
    profileParent.className = 'parent-in-myaccount';
    profileParent.appendChild(loaderMsg);

    var profileSection = document.createElement('div');
    profileSection.id = 'profile-section';
    profileSection.appendChild(profileParent);

    return profileSection;
  }

  function createNavTab(name) {
    var button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = name;
    button.className = 'account-nav-button';
    return button;
  }

  function createNavTabs(username) {
    var navTabs = document.createElement('div');
    navTabs.id = 'account-nav';

    var showProfileButton = createNavTab('Profile');
    var showPostsButton = createNavTab('Posts');
    var editAccountButton = null;
    if (username === Init.getUser()) {
      editAccountButton = createNavTab('Account');
    }

    showProfileButton.addEventListener('click', function () {
      ShowProfile.init(username, false);
      showBorders(showProfileButton, showPostsButton, editAccountButton);
    });
    showPostsButton.addEventListener('click', function () {
      Posts.init(username);
      showBorders(showPostsButton, showProfileButton, editAccountButton);
    });
    if (editAccountButton) {
      editAccountButton.addEventListener('click', function () {
        AccountInfo.init();
        showBorders(editAccountButton, showProfileButton, showPostsButton);
      });
    }

    navTabs.appendChild(showProfileButton);
    navTabs.appendChild(showPostsButton);
    if (username === Init.getUser()) {
      navTabs.appendChild(editAccountButton);
    }

    return navTabs;
  }

  return {
    init: init
  };
}());