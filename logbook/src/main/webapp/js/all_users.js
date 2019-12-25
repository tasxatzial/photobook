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
      var userlistSection = newElements.createUsersList(state.pages);
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
      var userPage = newElements.createAllUsers(state.xhrResponse[pageNo]);
      el.userListParent.insertBefore(userPage, el.userListNav);
    }
  }

  return {
    init: init
  };
}());