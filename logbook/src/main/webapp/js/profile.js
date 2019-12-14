'user strict';

var ShowProfile = (function() {
  var state = {
    xhr: null,
    xhrResponse: null,
    username: null,
    owner: false
  };

  var el = {
    showProfileButton: null,
    showPostsButton: null,
    editAccountButton: null
  };

  function init(username, firstTime) {
    var nonav = document.getElementById('no-nav');
    state.username = username;
    state.xhrResponse = null;

    var data = new FormData();
    data.append("action", "GetProfile");
    data.append("username", state.username);
    state.xhr = ajaxRequest("POST", "Main", data, successCallback, failCallback);

    function successCallback() {
      state.xhrResponse = JSON.parse(state.xhr.responseText);
      if (state.xhrResponse.ERROR) {
        logout();
        return;
      }

      if (firstTime) {
        state.owner = state.xhrResponse["owner"] === "1";
        el.accountSection = newElements.createAccountSection(state.xhrResponse[Init.dataNames[0][0]], state.owner);
        nonav.innerHTML = '';
        nonav.appendChild(el.accountSection);

        var navTabs = document.getElementById('account-nav');
        el.showProfileButton = navTabs.children[0];
        el.showPostsButton = navTabs.children[1];
        el.editAccountButton = navTabs.children[2];

        addListeners();
      }

      showBorders(el.showProfileButton, el.showPostsButton, el.editAccountButton);
      var profile = newElements.createSignupSummary(state.xhrResponse, Init.dataNames, false);
      var accountSubsection = document.getElementById('account-subsection');
      accountSubsection.innerHTML = '';
      accountSubsection.appendChild(profile);
    }

    function failCallback() {
      console.log(state.xhr.responseText);
    }
  }

  function addListeners() {
    el.showProfileButton.addEventListener('click', function () {
      ShowProfile.init(state.username, false);
      showBorders(el.showProfileButton, el.showPostsButton, el.editAccountButton);
    });
    el.showPostsButton.addEventListener('click', function () {
      ShowPosts.init(state.username, state.owner);
      showBorders(el.showPostsButton, el.showProfileButton, el.editAccountButton);
    });

    if (el.editAccountButton) {
      el.editAccountButton.addEventListener('click', function () {
        EditAccount.init();
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

  return {
    init: init
  };
}());