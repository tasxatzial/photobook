'use strict';

/**
 * Functions related to the page shown when the a user account page is requested, usually
 * by clicking on a username that appears in a post or the all users page.
 * @type {{init: init}}
 */
var ShowProfile = (function() {
  var el = {
    accountSubsection: null,
    showProfileButton: null,
    showPostsButton: null,
    editAccountButton: null
  };

  /**
   * Initializations when the user account page is requested.
   * @param username
   * @param firstTime
   */
  function init(username, firstTime) {
    Requests.cancelExcept(null);
    var loader = newElements.createSlidingLoader();

    if (firstTime === true) {
      Init.nonav.innerHTML = '';
      Init.nonav.appendChild(createAccountSection(username));
      el.accountSubsection = document.getElementById('account-subsection');
    }

    if (username === Init.getUser()) {
      var accountButton = document.getElementById('profile-button');
      Homepage.initializeButton(accountButton);
    }
    else {
      var allUsersButton = document.getElementById('show-users-button');
      Homepage.initializeButton(allUsersButton);
    }

    var data = new FormData();
    data.append("action", "GetProfile");
    if (username !== null) {
      data.append("username", username);
    }
    var ID = Requests.add(ajaxRequest("POST", "Main", data, successCallback, failCallback));

    function successCallback() {
      showBorders(el.showProfileButton, el.showPostsButton, el.editAccountButton);
      Init.navbarContent.removeChild(loader);
      var profileSection = createProfileSection();
      var profileParent = profileSection.children[0];
      if (firstTime === false) {
        el.accountSubsection.innerHTML = '';
      }
      el.accountSubsection.appendChild(profileSection);

      var navTabs = document.getElementById('account-nav');
      showBorders(navTabs.children[0], navTabs.children[1], navTabs.children[2]);

      var response = JSON.parse(Requests.get(ID).responseText);
      var profile = newElements.createSignupSummary(response,  Init.dataNames);
      profileParent.appendChild(profile);
    }

    function failCallback() {
      Init.navbarContent.removeChild(loader);
      if (Requests.get(ID).status === 401) {
        Logout.showExpired();
        return;
      }
      if (Requests.get(ID).status === 400) {
        newElements.showFullWindowMsg('OK', 'Invalid user', Init.clearFullWindowMsg);
      }
      else if (Requests.get(ID).status === 0) {
        newElements.showFullWindowMsg('OK', 'Unable to send request', Init.clearFullWindowMsg);
      }
      else {
        newElements.showFullWindowMsg('OK', 'Error', Init.clearFullWindowMsg);
      }
    }
  }

  /**
   * Changes the appearance of all navigation tabs when a tab is made active.
   * @param buttonActive
   * @param button2
   * @param button3
   */
  function showBorders(buttonActive, button2, button3) {
    buttonActive.className = 'account-nav-button active-tab';
    button2.className = 'account-nav-button inactive-tab';
    if (button3) {
      button3.className = 'account-nav-button inactive-tab';
    }
  }

  /**
   * Creates the initial elements in the user account section.
   * @param username
   * @returns {HTMLDivElement}
   */
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

  /**
   * Creates the user profile section, this is the content of the left-most tab on the user account page.
   * @returns {HTMLDivElement}
   */
  function createProfileSection() {
    var profileParent = document.createElement('div');
    profileParent.id = 'profile-parent';
    profileParent.className = 'parent-in-myaccount';

    var profileSection = document.createElement('div');
    profileSection.id = 'profile-section';
    profileSection.appendChild(profileParent);

    return profileSection;
  }

  /**
   * Creates a navigation tab that has the specified name.
   * @param name
   * @returns {HTMLButtonElement}
   */
  function createNavTab(name) {
    var button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = name;
    button.className = 'account-nav-button';
    return button;
  }

  /**
   * Creates the navigation tabs on the user account page. We should have 3 tabs if we have opened
   * our account page, 2 tabs in all other cases.
   * @param username
   * @returns
   */
  function createNavTabs(username) {
    var navTabs = document.createElement('div');
    navTabs.id = 'account-nav';

    el.showProfileButton = createNavTab('Profile');
    el.showPostsButton = createNavTab('Posts');
    el.editAccountButton = null;
    if (username === Init.getUser()) {
      el.editAccountButton = createNavTab('Account');
    }

    el.showProfileButton.addEventListener('click', function () {
      ShowProfile.init(username, false);
      el.showProfileButton.blur();
    });
    el.showPostsButton.addEventListener('click', function () {
      Posts.init(username);
      showBorders(el.showPostsButton, el.showProfileButton, el.editAccountButton);
      this.blur();
    });
    if (el.editAccountButton) {
      el.editAccountButton.addEventListener('click', function () {
        AccountInfo.init();
        showBorders(el.editAccountButton, el.showProfileButton, el.showPostsButton);
        this.blur();
      });
    }

    navTabs.appendChild(el.showProfileButton);
    navTabs.appendChild(el.showPostsButton);
    if (username === Init.getUser()) {
      navTabs.appendChild(el.editAccountButton);
    }

    return navTabs;
  }

  return {
    init: init
  };
}());