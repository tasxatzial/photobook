'use strict';

var Homepage = (function() {

  function init() {
    var navbarContent = document.getElementById('navbar-content');

    var accountButton = newElements.createSignBarButton('My account', 'profile-button');
    accountButton.addEventListener('click', function() {
      ShowProfile.init("");
    });
    navbarContent.appendChild(accountButton);

    var allUsersButton = newElements.createSignBarButton('Users', 'show-users-button');
    allUsersButton.addEventListener('click', ShowAllUsers.init);
    navbarContent.appendChild(allUsersButton);

    var logoutButton = newElements.createSignBarButton('Log out', 'logout-button');
    logoutButton.addEventListener('click', logout);
    navbarContent.appendChild(logoutButton);
    logoutButton.style.marginLeft = 'auto';

    allUsersButton.addEventListener('click', underline(allUsersButton, accountButton));
    accountButton.addEventListener('click', underline(accountButton, allUsersButton));
  }

  function underline(element1, element2) {
    return function() {
      element1.style.borderBottom = '3px solid #DCF4F4';
      element2.style.borderBottom = '0';
    };
  }

  return {
    init: init
  };
}());