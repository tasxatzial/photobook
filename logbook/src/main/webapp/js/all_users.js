'use strict';

var ShowAllUsers = (function() {
  var state = {
    xhr: null,
    xhrResponse: null,
    pages: 1
  };

  var el = {
    userListParent: null,
    userListNav: null
  };

  function init() {
    var nonav = document.getElementById('no-nav');

    state.pages = 1;
    state.xhrResponse = null;

    var data = new FormData();
    data.append("action", "GetAllUsers");
    state.xhr = ajaxRequest('POST', 'Main', data, successCallback, failCallback);

    function successCallback() {
      state.xhrResponse = JSON.parse(state.xhr.responseText);
      if (state.xhrResponse.ERROR) {
        logout();
        return;
      }

      state.pages = Object.keys(state.xhrResponse).length;
      var userlistSection = createUsersList(state.pages);
      el.userListParent = userlistSection.children[0];
      el.userListNav = el.userListParent.children[1];
      addListeners();
      showPage(1);
      nonav.innerHTML = '';
      nonav.appendChild(userlistSection);
    }

    function failCallback() {
      console.log(state.xhr.responseText);
    }
  }

  function addListeners() {
    var navButtons = el.userListParent.children[1];
    var leftButton = navButtons.children[0];
    var selectButton = navButtons.children[1].children[0];
    var rightButton = navButtons.children[2];

    leftButton.disabled = true;
    if (state.pages <= 1) {
      rightButton.disabled = true;
    }
    leftButton.addEventListener('click', function () {
      selectButton.value = Number(selectButton.value) - 1;
      if (selectButton.value == 1) {
        leftButton.disabled = true;
      }
      rightButton.disabled = false;
      showPage(selectButton.value);
    });
    rightButton.addEventListener('click', function () {
      selectButton.value = Number(selectButton.value) + 1;
      if (selectButton.value == state.pages) {
        rightButton.disabled = true;
      }
      leftButton.disabled = false;
      showPage(selectButton.value);
    });
    selectButton.addEventListener('change', function () {
      showPage(selectButton.value);
      leftButton.disabled = selectButton.value == 1;
      rightButton.disabled = selectButton.value == state.pages;
    });
  }

  function showPage(pageNo) {
    if (pageNo <= state.pages && pageNo >= 1) {
      if (el.userListParent.children[2]) {
        el.userListParent.removeChild(el.userListParent.children[1]);
      }
      var userPage = createAllUsers(state.xhrResponse[pageNo]);
      el.userListParent.insertBefore(userPage, el.userListNav);
    }
  }

  function createUsersList(pages) {
    if (!pages) {
      pages = 1;
    }

    var headerH2 = document.createElement('h2');
    headerH2.innerHTML = 'Users';

    var header = document.createElement('header');
    header.appendChild(headerH2);

    var prevButton = newElements.createArrowButton('images/left.png');
    prevButton.className = 'userlist-arrow-button transparent-button';
    prevButton.id = 'userlist-left-arrow-button';

    var nextButton = newElements.createArrowButton('images/right.png');
    nextButton.className = 'userlist-arrow-button transparent-button';
    nextButton.id = 'userlist-right-arrow-button';

    var selectPages = newElements.createSelectPage(pages, 'userlist-select');

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

  function createAllUsers(page) {
    var hrBottom = document.createElement('hr');
    hrBottom.className = 'userlist-hr-bottom';

    var div = document.createElement('div');
    div.appendChild(hrBottom);

    Object.keys(page).forEach(function(key, index) {
      var msg = newElements.createKeyValue(key, page[key]);

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

  return {
    init: init
  };
}());