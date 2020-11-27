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

    var navbarContent = document.getElementById('navbar-content');

    var data = new FormData();
    data.append("action", "Logout");
    var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, failCallback));

    if (clickedLogout) {
      var loader = newElements.createSlidingLoader();
    }

    function successCallback() {
      Init.nonav.classList.remove('no-nav-logged-in');
      document.getElementsByTagName('html')[0].classList.remove('html-logged-in');
      var navbarList = document.querySelector('.navbar-list');
      var burgerButton = document.querySelector('.initial-burger-button');
      navbarContent.removeChild(navbarList);
      if (loader) {
        navbarContent.removeChild(loader);
      }
      if (burgerButton) {
        navbarContent.removeChild(burgerButton);
      }
      Landing.init();
    }

    function failCallback() {
      if (loader) {
        navbarContent.removeChild(loader);
      }
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