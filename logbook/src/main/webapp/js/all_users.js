'use strict';

var AllUsers = (function() {
  var state = {
    response: null,
    pages: 0
  };

  var el = {
    userlistSection: null,
    userListParent: null,
    navBar: null
  };

  function init() {
    Requests.cancelAll();

    var userlistSection = createAllUsersSection();
    Init.nonav.innerHTML = '';
    Init.nonav.appendChild(userlistSection);

    var data = new FormData();
    data.append("action", "GetAllUsers");
    var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, failCallback));

    function successCallback() {
      var response = JSON.parse(Requests.get(ID).responseText);
      if (response.ERROR) {
        Logout.showExpired();
        return;
      }

      state.response = response;
      state.pages = Object.keys(response).length;
      el.userlistSection = document.getElementById('userlist-section');
      el.userListParent = el.userlistSection.children[0];
      el.navBar = createNavBar(state.pages);
      addNavBarListeners();
      el.userListParent.appendChild(el.navBar);
      showPage(1);
    }

    function failCallback() {
      console.log(Requests.get(ID).responseText);
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
      var userPage = createUserPage(state.response[pageNo]);
      el.userListParent.insertBefore(userPage, el.navBar);
    }
  }

  function createNavBar(pages) {
    if (!pages) {
      pages = 1;
    }

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

    return buttonSection;
  }

  function createAllUsersSection() {
    var headerH2 = document.createElement('h2');
    headerH2.innerHTML = 'Users';

    var header = document.createElement('header');
    header.appendChild(headerH2);

    var div = document.createElement('div');
    div.id = 'userlist-parent';
    div.className = 'parent-in-main';
    div.appendChild(header);

    var userlistSection = document.createElement('div');
    userlistSection.id = 'userlist-section';
    userlistSection.appendChild(div);

    return userlistSection;
  }

  function createUserPage(page) {
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