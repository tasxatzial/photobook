'use strict';

/**
 * Functions related to the logout process.
 * @type {{init: init, showExpired: showExpired}}
 */
var Logout = (function() {

  /**
   * Initializes the view when the user logs out.
   */
  function init(clickedLogout) {
    Init.clearFullWindowMsg();
    Requests.cancelExcept(null);

    var data = new FormData();
    data.append("action", "Logout");
    var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, failCallback));

    var logoutButton = document.getElementById('logout-button');
    if (clickedLogout) {
      logoutButton.classList.remove('navbar-notloading-button');
      var underline = document.querySelector('.navbar-underline');
      underline.style.display = 'none';
      var loader = document.createElement('div');
      loader.className = 'navbar-loader';
      logoutButton.appendChild(loader);
    }

    function successCallback() {
      var navbarContent = document.getElementById('navbar-content');
      var accountButton = document.getElementById('profile-button');
      var allUsersButton = document.getElementById('show-users-button');

      var postsButton = document.getElementById('show-posts');
      navbarContent.removeChild(accountButton);
      navbarContent.removeChild(allUsersButton);
      navbarContent.removeChild(logoutButton);
      navbarContent.removeChild(postsButton);
      Init.nonav.classList.remove('no-nav-logged-in');
      Landing.init();
    }

    function failCallback() {
      var loader = document.querySelector('.navbar-loader');
      logoutButton.classList.add('navbar-notloading-button');
      logoutButton.removeChild(loader);

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
    newElements.showFullWindowMsg('OK', 'Your session has expired', function() {
      init(false);
    });
  }

  return {
    init: init,
    showExpired: showExpired
  };
}());