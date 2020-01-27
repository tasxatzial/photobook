'use strict';

var Homepage = (function() {
  function init() {
    Init.nonav.innerHTML = '';

    var accountButton = newElements.createSignBarButton('My account', 'profile-button', 'images/myaccount.svg');
    accountButton.addEventListener('click', function() {
      ShowProfile.init(Init.getUser(), true);
    });
    Init.navbarContent.appendChild(accountButton);

    var allUsersButton = newElements.createSignBarButton('Users', 'show-users-button', 'images/users.svg');
    allUsersButton.addEventListener('click', AllUsers.init);
    Init.navbarContent.appendChild(allUsersButton);

    var postsButton = newElements.createSignBarButton('Posts', 'show-posts', 'images/posts.svg');
    postsButton.addEventListener('click', function() {
      Posts.init(null);
    });
    Init.navbarContent.appendChild(postsButton);

    var logoutButton = newElements.createSignBarButton('Log out', 'logout-button', 'images/logout.svg');
    logoutButton.addEventListener('click', Logout.init);
    Init.navbarContent.appendChild(logoutButton);

    allUsersButton.addEventListener('click', underline(allUsersButton, accountButton, postsButton));
    accountButton.addEventListener('click', underline(accountButton, allUsersButton, postsButton));
    postsButton.addEventListener('click', underline(postsButton, allUsersButton, accountButton));

    underline(postsButton, allUsersButton, accountButton)();
    Posts.init(null);
  }

  function underline(element1, element2, element3) {
    return function() {
      element1.style.borderBottom = '3px solid #324a69';
      element2.style.borderBottom = '0';
      element3.style.borderBottom = '0';
    };
  }

  return {
    init: init
  };
}());