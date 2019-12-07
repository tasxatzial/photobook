'user strict';

var ShowProfile = (function() {
  var state = {
    xhr: null,
    xhrResponse: null
  };

  function init(username) {
    var nonav = document.getElementById('no-nav');

    state.xhrResponse = null;

    var data = new FormData();
    data.append("action", "GetProfile");
    data.append("username", username);
    state.xhr = ajaxRequest("POST", "Main", data, successCallback, failCallback);

    function successCallback() {
      state.xhrResponse = JSON.parse(state.xhr.responseText);
      if (state.xhrResponse.ERROR) {
        logout();
        return;
      }

      var profileSection = newElements.createProfile(state.xhrResponse, Init.dataNames);
      nonav.innerHTML = '';
      nonav.appendChild(profileSection);

      var showProfileButton = newElements.createNavTab('Profile');
      showProfileButton.addEventListener('click', function() {
        ShowProfile.init(username);
      });
      var showPostsButton = newElements.createNavTab('Posts');

      var navTab = newElements.createUserNav();
      navTab.addTab(showProfileButton);
      navTab.addTab(showPostsButton);

      var editAccountButton = null;
      if (username === '') {
        editAccountButton = newElements.createNavTab('Edit Account');
        navTab.addTab(editAccountButton);
        editAccountButton.addEventListener('click', function() {
          showBorders(editAccountButton, showProfileButton,showPostsButton)
        });
      }
      else {
        editAccountButton = null;
      }

      showProfileButton.addEventListener('click', function() {
        showBorders(showProfileButton, showPostsButton, editAccountButton)
      });
      showPostsButton.addEventListener('click', function() {
        showBorders(showPostsButton, showProfileButton, editAccountButton)
      });

      var profileParent = document.getElementById('profile-parent');
      var profile = profileParent.children[1];
      profileParent.insertBefore(navTab.getDiv(), profile);
      showBorders(showProfileButton, showPostsButton, editAccountButton);
    }

    function failCallback() {
      console.log(state.xhr.responseText);
    }
  }

  function showBorders(buttonActive, button2, button3) {
      buttonActive.className = 'myaccount-nav-button active-tab';
      button2.className = 'myaccount-nav-button inactive-tab';
      if (button3) {
        button3.className = 'myaccount-nav-button inactive-tab';
      }
  }

  return {
    init: init
  };
}());