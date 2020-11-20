'use strict';

/**
 * Functions related to the all users section.
 * @type {{init: init}}
 */
var AllUsers = (function() {
  var state = {
    response: null,
    pages: 0,
    lastUpdateTime: null
  };

  var el = {
    userListParent: null,
    navBar: null,
    lastUpdatedText: null,
    refreshButton: null,
    lastUpdateContainer: null
  };

  /**
   * Initializes the view when the all users button is clicked.
   */
  function init() {
    Requests.cancelExcept(null);

    var userlistSection = createAllUsersSection();
    Init.nonav.innerHTML = '';
    Init.nonav.appendChild(userlistSection);

    el.userListParent = userlistSection.children[0];
    var loaderMsg = el.userListParent.children[3];
    formMsg.showElement(loaderMsg, Init.loader);

    var data = new FormData();
    data.append("action", "GetAllUsers");
    var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, failCallback));

    function successCallback() {
      var response = JSON.parse(Requests.get(ID).responseText);
      formMsg.clear(loaderMsg);

      state.lastUpdateTime = Date.now();
      setLastUpdateContainer();

      state.response = response;
      state.pages = Object.keys(response).length;
      el.navBar = createNavBar(state.pages);
      addNavBarListeners();
      el.userListParent.appendChild(el.navBar);
      showPage(1);
    }

    function failCallback() {
      if (Requests.get(ID).status === 401) {
        Logout.showExpired();
        return;
      }
      formMsg.clear(loaderMsg);
      var error = null;
      if (Requests.get(ID).status === 0) {
        error = newElements.createKeyValue('Error', 'Unable to send request');
      }
      else {
        error = newElements.createKeyValue('Error', 'Unknown');
      }
      el.userListParent.appendChild(error);
    }
  }

  /**
   * Adds listeners to the navigation bar of the user list (left button, right button, page selector).
   */
  function addNavBarListeners() {
    var leftButton = el.navBar.children[0];
    var selectButton = el.navBar.children[1].children[0];
    var rightButton = el.navBar.children[2];

    leftButton.disabled = true;
    leftButton.classList.remove('userlist-enabled-arrow-button');
    if (state.pages <= 1) {
      rightButton.disabled = true;
      rightButton.classList.remove('userlist-enabled-arrow-button');
    } else {
      rightButton.classList.add('userlist-enabled-arrow-button');
    }
    leftButton.addEventListener('click', function () {
      selectButton.value = Number(selectButton.value) - 1;
      if (selectButton.value === '1') {
        leftButton.disabled = true;
        leftButton.classList.remove('userlist-enabled-arrow-button');
      }
      rightButton.disabled = false;
      rightButton.classList.add('userlist-enabled-arrow-button');
      showPage(selectButton.value);
      setLastUpdateContainer();
    });
    rightButton.addEventListener('click', function () {
      selectButton.value = Number(selectButton.value) + 1;
      if (Number(selectButton.value) === state.pages) {
        rightButton.disabled = true;
        rightButton.classList.remove('userlist-enabled-arrow-button');
      }
      leftButton.disabled = false;
      leftButton.classList.add('userlist-enabled-arrow-button');
      showPage(selectButton.value);
      setLastUpdateContainer();
    });
    selectButton.addEventListener('change', function () {
      showPage(selectButton.value);
      setLastUpdateContainer();
      leftButton.disabled = selectButton.value === '1';
      rightButton.disabled = Number(selectButton.value) === state.pages;
      if (leftButton.disabled) {
        leftButton.classList.remove('userlist-enabled-arrow-button');
      } else {
        leftButton.classList.add('userlist-enabled-arrow-button');
      }
      if (rightButton.disabled) {
        rightButton.classList.remove('userlist-enabled-arrow-button');
      } else {
        rightButton.classList.add('userlist-enabled-arrow-button');
      }
    });
  }

  /**
   * Sets the content of the element that shows when the online status was last updated.
   */
  function setLastUpdateContainer() {
    var t = Math.floor((Date.now() - state.lastUpdateTime) / 60000);
    if (t > 0) {
      if (!el.refreshButton) {
        el.refreshButton = document.createElement('button');
        el.refreshButton.innerHTML = 'Refresh';
        el.refreshButton.className = 'userlist-refresh-button';
        el.refreshButton.addEventListener('click', function() {
          AllUsers.init();
        });
        el.lastUpdateContainer.appendChild(el.refreshButton);
      }
      el.lastUpdatedText.innerHTML = 'Online (updated > ' + t + ' min ago)';
    }
    else {
      el.refreshButton = null;
      el.lastUpdatedText.innerHTML = 'Online';
    }
  }

  /**
   * Shows the list of users in the specified pageNo.
   * @param pageNo
   */
  function showPage(pageNo) {
    if (pageNo <= state.pages && pageNo >= 1) {
      if (el.userListParent.children[5]) {
        el.userListParent.removeChild(el.userListParent.children[4]);
      }
      var userPage = createUserPage(state.response[pageNo]);
      el.userListParent.insertBefore(userPage, el.navBar);
    }
  }

  /**
   * Creates the navigation bar of the user list (left button, right button, page selector).
   * @param pages The total number of pages in the user list
   * @returns {HTMLDivElement}
   */
  function createNavBar(pages) {
    if (!pages) {
      pages = 1;
    }

    var prevButton = newElements.createArrowButton('images/left.svg');
    prevButton.className = 'userlist-arrow-button transparent-button';
    prevButton.id = 'userlist-left-arrow-button';

    var nextButton = newElements.createArrowButton('images/right.svg');
    nextButton.className = 'userlist-arrow-button transparent-button';
    nextButton.id = 'userlist-right-arrow-button';

    var selectPages = newElements.createSelectPage(pages, 'userlist-select');

    var buttonSection = document.createElement('div');
    buttonSection.id = 'userlist-nav';
    buttonSection.appendChild(prevButton);
    buttonSection.appendChild(selectPages);
    buttonSection.appendChild(nextButton);

    return buttonSection;
  }

  /**
   * Creates the initial elements in the all users section.
   * @returns {HTMLDivElement}
   */
  function createAllUsersSection() {
    var headerH2 = document.createElement('h2');
    headerH2.innerHTML = 'Users';

    var header = document.createElement('header');
    header.appendChild(headerH2);

    var loaderMsg = document.createElement('div');

    el.lastUpdateContainer = document.createElement('div');
    el.lastUpdateContainer.id = 'legend';
    var circle = newElements.createGreenCircle('images/green_circle.svg');
    el.lastUpdatedText = document.createElement('span');
    el.lastUpdatedText.id = 'legend-text';
    el.lastUpdatedText.innerText = 'Online';
    el.lastUpdateContainer.appendChild(circle);
    el.lastUpdateContainer.appendChild(el.lastUpdatedText);

    var activeUsers = document.createElement('p');
    activeUsers.innerText = 'Online users are those who have been active < 1 min ago.';

    var div = document.createElement('div');
    div.id = 'userlist-parent';
    div.className = 'parent-in-main';
    div.appendChild(header);
    div.appendChild(activeUsers);
    div.appendChild(el.lastUpdateContainer);
    div.appendChild(loaderMsg);

    var userlistSection = document.createElement('div');
    userlistSection.id = 'userlist-section';
    userlistSection.appendChild(div);

    return userlistSection;
  }

  /**
   * Creates the list of users for the specified page.
   * @param page
   * @returns {HTMLDivElement}
   */
  function createUserPage(page) {
    var hrBottom = document.createElement('hr');
    hrBottom.className = 'userlist-hr-bottom';

    var div = document.createElement('div');
    div.id = 'userlist';
    div.appendChild(hrBottom);

    Object.keys(page).forEach(function(key, index) {
      var msg = newElements.createKeyValue(key, page[key]);
      msg.classList.add('allusers-name');

      var img = document.createElement('img');
      img.className = 'user-show-more-arrow';
      img.src = 'images/showmore.svg';

      var user = document.createElement('div');
      user.className = "username-line";
      user.appendChild(msg);
      user.appendChild(img);

      var button = document.createElement('button');
      button.className = 'username-button';
      button.appendChild(user);
      button.onclick = function() {
        ShowProfile.init(page[key], true);
      };

      var hr = document.createElement('hr');
      hr.className = 'userlist-hr';

      div.appendChild(button);
      div.appendChild(hr);
    });

    return div;
  }

  return {
    init: init
  };
}());