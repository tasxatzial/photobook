'use strict';

/**
 * Functions related to the logout process.
 * @type {{init: init, showExpired: showExpired}}
 */
var Logout = (function() {

  /**
   * Initializes the view when the user logs out.
   */
  function init() {
    Requests.cancelExcept(null);
    Init.clearFullWindowMsg();
    newElements.showFullWindowMsg('Cancel', 'Please wait...', function () {
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
      Init.nonav.classList.remove('no-nav-logged-in');
      Landing.init();
    }

    function failCallback() {
      Init.clearFullWindowMsg();
      if (Requests.get(ID).status === 0) {
        newElements.showFullWindowMsg('OK', 'Unable to send request', Init.clearFullWindowMsg);
      }
      else {
        newElements.showFullWindowMsg('OK', 'Error', Init.clearFullWindowMsg);
      }
    }
  }

  /**
   * Shows a expired session message.
   */
  function showExpired() {
    newElements.showFullWindowMsg('OK', 'Your session has expired', init);
  }

  return {
    init: init,
    showExpired: showExpired
  };
}());