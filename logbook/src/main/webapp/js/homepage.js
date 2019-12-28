'use strict';

function homepage() {
  var accountButton = newElements.createSignBarButton('My account', 'profile-button');
  accountButton.addEventListener('click', function() {
    ShowProfile.init(null, true);
  });
  Init.navbarContent.appendChild(accountButton);

  var allUsersButton = newElements.createSignBarButton('Users', 'show-users-button');
  allUsersButton.addEventListener('click', AllUsers.init);
  Init.navbarContent.appendChild(allUsersButton);

  var postsButton = newElements.createSignBarButton('Posts', 'show-posts');
  postsButton.addEventListener('click', function() {
    Posts.init(false, false);
  });
  Init.navbarContent.appendChild(postsButton);

  var logoutButton = newElements.createSignBarButton('Log out', 'logout-button');
  logoutButton.addEventListener('click', Logout);
  Init.navbarContent.appendChild(logoutButton);
  logoutButton.style.marginLeft = 'auto';

  allUsersButton.addEventListener('click', underline(allUsersButton, accountButton, postsButton));
  accountButton.addEventListener('click', underline(accountButton, allUsersButton, postsButton));
  postsButton.addEventListener('click', underline(postsButton, allUsersButton, accountButton));

  underline(postsButton, allUsersButton, accountButton)();
  Posts.init(false, false);

  function underline(element1, element2, element3) {
    return function() {
      element1.style.borderBottom = '3px solid #DCF4F4';
      element2.style.borderBottom = '0';
      element3.style.borderBottom = '0';
    };
  }
}