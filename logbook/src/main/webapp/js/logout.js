'use strict';

var Logout = (function() {
  function init() {
    Requests.cancelExcept(null);
    Init.clearFullWindowMsg();
    newElements.showFullWindowMsg(1, 'Please wait...', function () {
      Requests.cancelExcept(null);
      Init.clearFullWindowMsg();
    });

    var data = new FormData();
    data.append("action", "Logout");
    var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, failCallback));

    function successCallback() {
      Init.clearFullWindowMsg();
      var navbarContent = document.getElementById('navbar-content');
      var accountButton = document.getElementById('profile-button');
      var allUsersButton = document.getElementById('show-users-button');
      var logoutButton = document.getElementById('logout-button');
      var postsButton = document.getElementById('show-posts');
      navbarContent.removeChild(accountButton);
      navbarContent.removeChild(allUsersButton);
      navbarContent.removeChild(logoutButton);
      navbarContent.removeChild(postsButton);
      Landing.init();
    }

    function failCallback() {
      Init.clearFullWindowMsg();
      if (Requests.get(ID).status === 0) {
        newElements.showFullWindowMsg(-1, 'Unable to send request', Init.clearFullWindowMsg);
      }
      else {
        newElements.showFullWindowMsg(-1, 'Error', Init.clearFullWindowMsg);
      }
    }
  }

  function showExpired() {
    newElements.showFullWindowMsg(0, '', init);
  }

  return {
    init: init,
    showExpired: showExpired
  };
}());