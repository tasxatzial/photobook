var ShowAllUsers = (function() {
  var state = {
    xhr: null,
    xhrResponse: null,
    pages: 1
  };

  var el = {
    userListParent: null,
    nonav: null
  };

  function init() {
    el.nonav = document.getElementById('no-nav');
    var allUsersButton = document.getElementById('show-users-button');

    allUsersButton.disabled = true;

    state.pages = 1;
    state.xhrResponse = null;

    var data = new FormData();
    data.append("action", "ShowAllUsers");
    state.xhr = ajaxRequest('POST', 'Main', data, successCallback, failCallback);

    function successCallback() {
      state.xhrResponse = JSON.parse(state.xhr.responseText);

      state.pages = Object.keys(state.xhrResponse).length;
      el.userListParent = newElements.createUserListContainer(state.pages);
      addListeners();
      showPage(1);
      var userlistSection = document.createElement('div');
      userlistSection.id = 'userlist-section';
      userlistSection.appendChild(el.userListParent);
      userlistSection.style.minHeight = '53rem';
      var max = 0;
      var userlistContainer = el.userListParent.children[0].children[1];
      for (var i = 0; i < userlistContainer.childNodes.length; i++) {
        if (userlistContainer.children[i].innerHTML.length > max) {
          max = userlistContainer.children[i].innerHTML.length;
        }
      }
      el.userListParent.style.width = max*0.45 + 'rem';
      el.userListParent.style.width = max*0.45 + 'rem';
      el.nonav.innerHTML = '';
      el.nonav.style.height = 'auto';
      el.nonav.appendChild(userlistSection);
      allUsersButton.disabled = false;
    }

    function failCallback() {
      allUsersButton.disabled = false;
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
      if (el.userListParent.children[0].children[1]) {
        el.userListParent.children[0].removeChild(el.userListParent.children[0].children[1]);
      }
      var userPage = newElements.createAccountDetails(state.xhrResponse[pageNo], null, false);
      el.userListParent.children[0].appendChild(userPage);
    }
  }

  return {
    init: init
  };
}());