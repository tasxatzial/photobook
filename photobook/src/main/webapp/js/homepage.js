'use strict';

/**
 * Functions related to the post-signin process.
 *
 * @type {{init: init, removeActive: removeActive, setActive: setActive}}
 */
var Homepage = (function() {
  var activeButton = null;
  var el = null;

  function runInit() {
    activeButton = null;
    el = {
      burgerButton: null,
      navbarList: null,
      activeButton: null
    };
  }

  /**
   * Initializes the view when the homepage (initial screen when a user is logged in) is requested.
   */
  function init() {
    Init.nonav.innerHTML = '';
    Init.nonav.classList.add('no-nav-logged-in');
    document.getElementsByTagName('html')[0].classList.add('html-logged-in');
    el.navbarList = document.createElement('div');
    el.navbarList.className = 'navbar-list';

    var accountButton = newElements.createSignBarButton('My account', 'profile-button', 'images/myaccount.svg');
    accountButton.addEventListener('click', function() {
      initializeButton(accountButton);
      closeBurgerButton();
      ShowProfile.init(Init.getUser(), true);
    });
    el.navbarList.appendChild(accountButton);

    var allUsersButton = newElements.createSignBarButton('Users', 'show-users-button', 'images/users.svg');
    allUsersButton.addEventListener('click', function () {
      closeBurgerButton();
      this.blur();
      AllUsers.init();
    });
    el.navbarList.appendChild(allUsersButton);

    var postsButton = newElements.createSignBarButton('Posts', 'show-posts', 'images/posts.svg');
    postsButton.addEventListener('click', function() {
      initializeButton(postsButton);
      closeBurgerButton();
      Posts.init(null);
    });
    el.navbarList.appendChild(postsButton);

    var logoutButton = newElements.createSignBarButton('Log out', 'logout-button', 'images/logout.svg');
    logoutButton.addEventListener('click', function() {
      Logout.init(true);
      closeBurgerButton();
    });
    el.navbarList.appendChild(logoutButton);
    Init.navbarContent.appendChild(el.navbarList);

    el.burgerButton = document.createElement('button');
    el.burgerButton.innerHTML = '&#9776;';
    el.burgerButton.className = 'initial-burger-button';
    Init.navbarContent.appendChild(el.burgerButton);

    el.burgerButton.addEventListener('click', function() {
      this.blur();
      if (el.burgerButton.innerHTML === '☰') {
        el.burgerButton.innerHTML = '&times;';
        el.burgerButton.classList.add('opened-burger-button');
        el.navbarList.classList.add('navigation-open');
      }
      else {
        el.burgerButton.innerHTML = '&#9776;';
        el.burgerButton.classList.remove('opened-burger-button');
        el.navbarList.classList.remove('navigation-open');
      }
    });

    var query = window.matchMedia("(max-width: 45rem)");
    query.addEventListener('change', function() {
      if (!query.matches) {
        el.burgerButton.classList.remove('opened-burger-button');
        el.navbarList.classList.remove('navigation-open');
        el.burgerButton.innerHTML = '&#9776;';
      }
    });
    initializeButton(postsButton);
    closeBurgerButton();
    Posts.init(null);
  }

  function initializeButton(button) {
    if (el.activeButton) {
      el.activeButton.classList.remove('navbar-active-button');
    }
    if (button) {
      button.blur();
      el.activeButton = button;
      button.classList.add('navbar-active-button');
    }
    else {
      el.activeButton = null;
    }
  }

  function closeBurgerButton() {
    el.burgerButton.innerHTML = '&#9776;';
    el.burgerButton.classList.remove('opened-burger-button');
    el.navbarList.classList.remove('navigation-open');
  }

  return {
    init: init,
    initializeButton: initializeButton,
    runInit: runInit
  };
}());