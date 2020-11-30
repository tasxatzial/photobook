'use strict';

/**
 * Functions related to the all users section.
 * @type {{init: init}}
 */
var AllUsers = (function() {
  var state = {
    response: null,
    pages: 0,
    timeout: null
  };

  var el = {
    userListParent: null,
    navBar: null,
    lastUpdatedTextContainer: null
  };

  /**
   * Initializes the view when the all users button is clicked.
   */
  function init() {
    Requests.cancelExcept(null);
    var loader = newElements.createSlidingLoader();

    var data = new FormData();
    data.append("action", "GetAllUsers");
    var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, failCallback));

    function successCallback() {
      Init.navbarContent.removeChild(loader);

      var allUsersButton = document.getElementById('show-users-button');
      Homepage.initializeButton(allUsersButton);

      var userlistSection = createAllUsersSection();
      el.userListParent = userlistSection.children[0];

      Init.nonav.innerHTML = '';
      Init.nonav.appendChild(userlistSection);

      clearTimeout(state.timeout);
      state.timeout = setTimeout(function () {
        var refreshButton = document.createElement('button');
        refreshButton.innerHTML = 'Refresh';
        refreshButton.className = 'userlist-refresh-button';
        refreshButton.addEventListener('click', AllUsers.init);
        el.lastUpdatedTextContainer.appendChild(refreshButton);
      }, 60000);

      var response = JSON.parse(Requests.get(ID).responseText);
      state.response = response;

      state.pages = Object.keys(response).length - 1;
      el.navBar = createNavBar(state.pages);
      addNavBarListeners();

      el.userListParent.appendChild(el.navBar);
      showPage(1);
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
   * Adds listeners to the navigation bar of the user list (left button, right button, page selector).
   */
  function addNavBarListeners() {
    var leftButton = el.navBar.children[0];
    var selectButton = el.navBar.children[1].children[0];
    var rightButton = el.navBar.children[2];

    leftButton.disabled = true;
    leftButton.classList.remove('userlist-enabled-arrow-button');
    leftButton.children[0].src = 'images/left_disabled.svg';
    if (state.pages <= 1) {
      rightButton.disabled = true;
      rightButton.classList.remove('userlist-enabled-arrow-button');
      rightButton.children[0].src = 'images/right_disabled.svg';
    } else {
      rightButton.classList.add('userlist-enabled-arrow-button');
    }
    leftButton.addEventListener('click', function () {
      selectButton.value = Number(selectButton.value) - 1;
      if (Number(selectButton.value) === 1) {
        leftButton.disabled = true;
        leftButton.classList.remove('userlist-enabled-arrow-button');
        leftButton.children[0].src = 'images/left_disabled.svg';
      }
      if (Number(selectButton.value) === state.pages - 1) {
        rightButton.disabled = false;
        rightButton.classList.add('userlist-enabled-arrow-button');
        rightButton.children[0].src = 'images/right.svg';
      }
      showPage(selectButton.value);
    });
    rightButton.addEventListener('click', function () {
      selectButton.value = Number(selectButton.value) + 1;
      if (Number(selectButton.value) === state.pages) {
        rightButton.disabled = true;
        rightButton.classList.remove('userlist-enabled-arrow-button');
        rightButton.children[0].src = 'images/right_disabled.svg';
      }
      if (Number(selectButton.value) === 2) {
        leftButton.disabled = false;
        leftButton.classList.add('userlist-enabled-arrow-button');
        leftButton.children[0].src = 'images/left.svg';
      }
      showPage(selectButton.value);
    });
    selectButton.addEventListener('change', function () {
      showPage(selectButton.value);
      leftButton.disabled = selectButton.value === '1';
      rightButton.disabled = Number(selectButton.value) === state.pages;
      if (leftButton.disabled) {
        leftButton.classList.remove('userlist-enabled-arrow-button');
        leftButton.children[0].src = 'images/left_disabled.svg';
      } else {
        leftButton.classList.add('userlist-enabled-arrow-button');
        leftButton.children[0].src = 'images/left.svg';
      }
      if (rightButton.disabled) {
        rightButton.classList.remove('userlist-enabled-arrow-button');
        rightButton.children[0].src = 'images/right_disabled.svg';
      } else {
        rightButton.classList.add('userlist-enabled-arrow-button');
        rightButton.children[0].src = 'images/right.svg';
      }
    });
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

    var circle = newElements.createGreenCircle('images/green_circle.svg');

    var lastUpdatedText = document.createElement('span');
    lastUpdatedText.id = 'legend-text';
    lastUpdatedText.innerText = 'Online';

    el.lastUpdatedTextContainer = document.createElement('div');
    el.lastUpdatedTextContainer.appendChild(circle);
    el.lastUpdatedTextContainer.appendChild(lastUpdatedText);

    var registedSince = document.createElement('div');
    registedSince.innerHTML = 'Registered';

    var lastUpdatedContainer = document.createElement('div');
    lastUpdatedContainer.id = 'legend';
    lastUpdatedContainer.appendChild(el.lastUpdatedTextContainer);
    lastUpdatedContainer.appendChild(registedSince);

    var activeUsers = document.createElement('p');
    activeUsers.innerText = 'Online users are those who have been active < 1 min ago.';
    activeUsers.className = 'online-users-text';

    var updatePromptText = document.createElement('p');
    updatePromptText.innerText = 'Refresh when prompted to see the updated list.';
    updatePromptText.className = 'online-users-text';

    var div = document.createElement('div');
    div.id = 'userlist-parent';
    div.className = 'parent-in-main';
    div.appendChild(header);
    div.appendChild(activeUsers);
    div.appendChild(updatePromptText);
    div.appendChild(lastUpdatedContainer);

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

    var sortedIndexes = [];
    Object.keys(page).forEach(function(key, index) {
      sortedIndexes.push(key);
    });
    sortedIndexes.sort(function (a, b) {
      return a - b;
    });
    sortedIndexes.forEach(function(key, index) {
      var username = page[key]['n'];
      var registered = page[key]['r'].substring(0, 10);
      var userText = newElements.createKeyValue(key, username);
      userText.classList.add('allusers-name');

      var registeredDate = document.createElement('div');
      registeredDate.innerHTML = registered;
      registeredDate.className = 'registered-since';

      var user = document.createElement('div');
      user.className = "username-line";
      user.appendChild(userText);
      user.appendChild(registeredDate);

      var button = document.createElement('button');
      button.className = 'username-button';
      button.appendChild(user);
      button.onclick = function() {
        ShowProfile.init(username, true);
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