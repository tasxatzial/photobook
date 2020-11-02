'use strict';

/**
 * Functions related to the post-signin process.
 *
 * @type {{init: init, removeActive: removeActive, setActive: setActive}}
 */
var Homepage = (function() {
  var activeButton = null;

  /**
   * Initializes the view when the homepage (initial screen when a user is logged in) is requested.
   */
  function init() {
    Init.nonav.innerHTML = '';
    Init.nonav.classList.add('no-nav-logged-in');
    var navbarList = document.createElement('div');
    navbarList.className = 'navbar-list';

    var accountButton = newElements.createSignBarButton('My account', 'profile-button', 'images/myaccount.svg');
    accountButton.addEventListener('click', function() {
      initializeButton(this, burgerButton, navbarList);
      ShowProfile.init(Init.getUser(), true);
    });
    navbarList.appendChild(accountButton);

    var allUsersButton = newElements.createSignBarButton('Users', 'show-users-button', 'images/users.svg');
    allUsersButton.addEventListener('click', function() {
      initializeButton(this, burgerButton, navbarList);
      AllUsers.init();
    });
    navbarList.appendChild(allUsersButton);

    var postsButton = newElements.createSignBarButton('Posts', 'show-posts', 'images/posts.svg');
    postsButton.addEventListener('click', function() {
      initializeButton(this, burgerButton, navbarList);
      Posts.init(null);
    });
    navbarList.appendChild(postsButton);

    var logoutButton = newElements.createSignBarButton('Log out', 'logout-button', 'images/logout.svg');
    logoutButton.addEventListener('click', function() {
      initializeButton(this, burgerButton, navbarList);
      Logout.init(true);
    });
    navbarList.appendChild(logoutButton);
    Init.navbarContent.appendChild(navbarList);

    var burgerButton = document.createElement('button');
    burgerButton.innerHTML = '&#9776;';
    burgerButton.className = 'initial-burger-button';
    Init.navbarContent.appendChild(burgerButton);

    burgerButton.addEventListener('click', function() {
      if (burgerButton.innerHTML === '☰') {
        burgerButton.innerHTML = '&times;';
        burgerButton.classList.add('opened-burger-button');
        navbarList.classList.add('navigation-open');
      }
      else {
        burgerButton.innerHTML = '&#9776;';
        burgerButton.classList.remove('opened-burger-button');
        navbarList.classList.remove('navigation-open');
      }
    });

    var query = window.matchMedia("(max-width: 45rem)");
    query.addEventListener('change', function() {
      if (!query.matches) {
        burgerButton.classList.remove('opened-burger-button');
        navbarList.classList.remove('navigation-open');
        burgerButton.innerHTML = '&#9776;';
      }
    });
    setActive(postsButton);
    Posts.init(null);

    function initializeButton(button) {
      button.blur();
      removeActive();
      setActive(button);
      burgerButton.innerHTML = '&#9776;';
      burgerButton.classList.remove('opened-burger-button');
      navbarList.classList.remove('navigation-open');
    }
  }

  function setActive(button) {
    activeButton = button;
    button.classList.add('navbar-active-button');
  }

  function removeActive() {
    if (activeButton) {
      activeButton.classList.remove('navbar-active-button');
      activeButton = null;
    }
  }

  return {
    init: init,
    setActive: setActive,
    removeActive: removeActive
  };
}());