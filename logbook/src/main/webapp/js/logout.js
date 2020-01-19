'use strict';

var Logout = (function() {
  function init() {
    Requests.cancelExcept(null);

    var data = new FormData();
    data.append("action", "Logout");

    var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, failCallback));

    function successCallback() {
      var body = document.getElementsByTagName('body')[0];
      body.removeAttribute('id');

      var expired = document.getElementById('expired-screen');
      if (expired) {
        body.removeChild(expired);
      }

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
      console.log(Requests.get(ID).responseText);
    }
  }

  function showExpired() {
    var expired = createExpiredMsg();
    var body = document.getElementsByTagName('body')[0];
    body.id = 'expired-body';
    document.getElementsByTagName('body')[0].appendChild(expired);
  }

  function createExpiredMsg() {
    var expired = document.createElement('div');
    expired.id = 'expired-screen';

    var expiredMsg = document.createElement('p');
    expiredMsg.innerHTML = 'Your session has expired';

    var button = document.createElement('button');
    button.innerHTML = 'OK';
    button.id = 'expired-button';
    button.addEventListener('click', init);
    formButton.enable(button);

    var expiredWindow = document.createElement('div');
    expiredWindow.id = 'expired-window';
    expired.appendChild(expiredWindow);

    expiredWindow.appendChild(expiredMsg);
    expiredWindow.appendChild(button);

    return expired;
  }

  return {
    init: init,
    showExpired: showExpired
  };
}());