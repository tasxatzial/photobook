'use strict';

/**
 * Functions related to the post-signin process.
 * @type {{init: init}}
 */
var Homepage = (function() {

  /**
   * Initializes the view when the homepage (initial screen when a user is logged in) is requested.
   */
  function init() {
    Init.nonav.innerHTML = '';
    Init.nonav.classList.add('no-nav-logged-in');

    var accountButton = newElements.createSignBarButton('My account', 'profile-button', 'images/myaccount.svg');
    accountButton.addEventListener('click', function() {
      this.blur();
      ShowProfile.init(Init.getUser(), true);
    });
    Init.navbarContent.appendChild(accountButton);

    var allUsersButton = newElements.createSignBarButton('Users', 'show-users-button', 'images/users.svg');
    allUsersButton.addEventListener('click', function() {
      this.blur();
      AllUsers.init();
    });
    Init.navbarContent.appendChild(allUsersButton);

    var postsButton = newElements.createSignBarButton('Posts', 'show-posts', 'images/posts.svg');
    postsButton.addEventListener('click', function() {
      this.blur();
      Posts.init(null);
    });
    Init.navbarContent.appendChild(postsButton);

    var logoutButton = newElements.createSignBarButton('Log out', 'logout-button', 'images/logout.svg');
    logoutButton.addEventListener('click', function() {
      this.blur();
      Logout.init(true);
    });
    Init.navbarContent.appendChild(logoutButton);

    allUsersButton.addEventListener('click', underline(allUsersButton, accountButton, postsButton));
    accountButton.addEventListener('click', underline(accountButton, allUsersButton, postsButton));
    postsButton.addEventListener('click', underline(postsButton, allUsersButton, accountButton));

    underline(postsButton, allUsersButton, accountButton)();
    Posts.init(null);
  }

  /**
   * Underlines one of the 'my account', 'all users', 'posts' links in the top navigation menu.
   * @param element1
   * @param element2
   * @param element3
   * @returns {function(...[*]=)}
   */
  function underline(element1, element2, element3) {
    return function() {
      element1.classList.add('navbar-active-button');
      element2.classList.remove('navbar-active-button');
      element3.classList.remove('navbar-active-button');
    };
  }

  return {
    init: init
  };
}());