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

      var expired = document.getElementById('full-screen');
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
    var button = newElements.createFullWindowButton();
    button.addEventListener('click', init);

    var expired = newElements.createFullWindow('Your session has expired');
    expired.children[0].appendChild(button);

    var body = document.getElementsByTagName('body')[0];
    body.id = 'full-body';
    document.getElementsByTagName('body')[0].appendChild(expired);
  }

  return {
    init: init,
    showExpired: showExpired
  };
}());