'use strict';

var ShowProfile = (function() {
  var el = {
    showProfileButton: null,
    showPostsButton: null,
    editAccountButton: null
  };

  function init(username, firstTime) {
    Requests.cancelAll();

    /* var loaderParent = newElements.createLoaderParent("images/loader.gif"); */
    if (firstTime === true) {
      Init.nonav.innerHTML = '';
      /* Init.nonav.appendChild(loaderParent); */
    }

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

      if (firstTime === true) {
        /* Init.nonav.removeChild(loaderParent); */
        var accountSection = createAccountSection(username);
        Init.nonav.appendChild(accountSection);

        var navTabs = document.getElementById('account-nav');
        el.showProfileButton = navTabs.children[0];
        el.showPostsButton = navTabs.children[1];
        el.editAccountButton = navTabs.children[2];

        addListeners(username);
      }

      showBorders(el.showProfileButton, el.showPostsButton, el.editAccountButton);
      var profileSection = createProfileSection(response, Init.dataNames, false);
      var accountSubsection = document.getElementById('account-subsection');
      accountSubsection.innerHTML = '';
      accountSubsection.appendChild(profileSection);
    }

    function failCallback() {
      /* Init.nonav.removeChild(loaderParent); */
      console.log(Requests.get(ID).responseText);
    }
  }

  function addListeners(username) {
    el.showProfileButton.addEventListener('click', function () {
      ShowProfile.init(username, false);
      showBorders(el.showProfileButton, el.showPostsButton, el.editAccountButton);
    });
    el.showPostsButton.addEventListener('click', function () {
      Posts.init(username);
      showBorders(el.showPostsButton, el.showProfileButton, el.editAccountButton);
    });

    if (el.editAccountButton) {
      el.editAccountButton.addEventListener('click', function () {
        AccountInfo.init();
        showBorders(el.editAccountButton, el.showProfileButton, el.showPostsButton);
      });
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

  function createProfileSection(response, dataNames, skipEmpty) {
    var profileParent = newElements.createSignupSummary(response, dataNames, skipEmpty);
    profileParent.id = 'profile-parent';
    profileParent.className = 'parent-in-myaccount';

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

    navTabs.appendChild(showProfileButton);
    navTabs.appendChild(showPostsButton);

    if (username === Init.getUser()) {
      var editAccountButton = createNavTab('Account');
      navTabs.appendChild(editAccountButton);
    }

    return navTabs;
  }

  return {
    init: init
  };
}());