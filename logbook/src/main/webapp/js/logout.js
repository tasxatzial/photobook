'use strict';

var Logout = (function() {
  function init() {
    Requests.cancelExcept(null);

    var data = new FormData();
    data.append("action", "Logout");

    var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, failCallback));

    function successCallback() {
      clearFullWindowMsg();

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
      if (Requests.get(ID).status === 0) {
        newElements.showFullWindowMsg(-1, 'Unable to send request', clearFullWindowMsg);
      }
      else {
        newElements.showFullWindowMsg(-1, 'Error', clearFullWindowMsg);
      }
    }
  }

  function showExpired() {
    newElements.showFullWindowMsg(0, '', init);
  }

  function clearFullWindowMsg() {
    var body = document.getElementsByTagName('body')[0];
    body.removeAttribute('id');

    var msg = document.getElementById('full-screen');
    if (msg) {
      body.removeChild(msg);
    }
  }

  return {
    init: init,
    showExpired: showExpired
  };
}());