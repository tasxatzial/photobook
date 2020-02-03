'use strict';

var AllUsers = (function() {
  var state = {
    response: null,
    pages: 0
  };

  var el = {
    userListParent: null,
    navBar: null
  };

  function init() {
    Requests.cancelExcept(null);

    var userlistSection = createAllUsersSection();
    Init.nonav.innerHTML = '';
    Init.nonav.appendChild(userlistSection);

    el.userListParent = userlistSection.children[0];
    var loaderMsg = el.userListParent.children[1];
    formMsg.showElement(loaderMsg, Init.loader);

    var data = new FormData();
    data.append("action", "GetAllUsers");
    var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, failCallback));

    function successCallback() {
      var response = JSON.parse(Requests.get(ID).responseText);
      formMsg.clear(loaderMsg);

      state.response = response;
      state.pages = Object.keys(response).length;
      el.navBar = createNavBar(state.pages);
      addNavBarListeners();
      el.userListParent.appendChild(el.navBar);
      showPage(1);
    }

    function failCallback() {
      formMsg.clear(loaderMsg);
      if (Requests.get(ID).status === 401) {
        Logout.showExpired();
        return;
      }
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

  function addNavBarListeners() {
    var leftButton = el.navBar.children[0];
    var selectButton = el.navBar.children[1].children[0];
    var rightButton = el.navBar.children[2];

    leftButton.disabled = true;
    if (state.pages <= 1) {
      rightButton.disabled = true;
    }
    leftButton.addEventListener('click', function () {
      selectButton.value = Number(selectButton.value) - 1;
      if (selectButton.value === '1') {
        leftButton.disabled = true;
      }
      rightButton.disabled = false;
      showPage(selectButton.value);
    });
    rightButton.addEventListener('click', function () {
      selectButton.value = Number(selectButton.value) + 1;
      if (Number(selectButton.value) === state.pages) {
        rightButton.disabled = true;
      }
      leftButton.disabled = false;
      showPage(selectButton.value);
    });
    selectButton.addEventListener('change', function () {
      showPage(selectButton.value);
      leftButton.disabled = selectButton.value === '1';
      rightButton.disabled = Number(selectButton.value) === state.pages;
    });
  }

  function showPage(pageNo) {
    if (pageNo <= state.pages && pageNo >= 1) {
      if (el.userListParent.children[3]) {
        el.userListParent.removeChild(el.userListParent.children[2]);
      }
      var userPage = createUserPage(state.response[pageNo]);
      el.userListParent.insertBefore(userPage, el.navBar);
    }
  }

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

  function createAllUsersSection() {
    var headerH2 = document.createElement('h2');
    headerH2.innerHTML = 'Users';

    var header = document.createElement('header');
    header.appendChild(headerH2);

    var loaderMsg = document.createElement('div');

    var div = document.createElement('div');
    div.id = 'userlist-parent';
    div.className = 'parent-in-main';
    div.appendChild(header);
    div.appendChild(loaderMsg);

    var userlistSection = document.createElement('div');
    userlistSection.id = 'userlist-section';
    userlistSection.appendChild(div);

    return userlistSection;
  }

  function createUserPage(page) {
    var hrBottom = document.createElement('hr');
    hrBottom.className = 'userlist-hr-bottom';

    var div = document.createElement('div');
    div.id = 'userlist';
    div.appendChild(hrBottom);

    Object.keys(page).forEach(function(key, index) {
      var msg = newElements.createKeyValue(key, page[key]);

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