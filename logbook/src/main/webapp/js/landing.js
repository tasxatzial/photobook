'use strict';

/**
 * Initializations when the landing page is requested and the user is not logged in.
 * @type {{init: init}}
 */
var Landing = (function() {

  /**
   * Initializes the view when the landing page is requested.
   */
  function init() {
    Init.nonav.innerHTML = '';
    Init.nonav.appendChild(createLanding());
  }

  /**
   * Loads the signin form.
   */
  function showSignin() {
    Requests.cancelExcept(null);
    var signinButton = document.getElementById('signin-nav-button');
    var data = new FormData();
    data.append('action', 'GetSignin');
    var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, function () {
      failCallback(ID, signinButton);
    }));

    if (signinButton) {
      signinButton.blur();
    }
    var loader = newElements.createSlidingLoader();

    function successCallback() {
      Init.navbarContent.removeChild(loader);
      Init.nonav.innerHTML = Requests.get(ID).responseText;
      if (signinButton) {
        Init.navbarContent.removeChild(signinButton);
      }
      var signupButton = newElements.createSignBarButton('Sign up', 'signup-nav-button', "images/signup.svg");
      signupButton.addEventListener('click', showSignup);
      signupButton.style.marginLeft = 'auto';
      Init.navbarContent.appendChild(signupButton);

      Signin.init();
    }
  }

  /**
   * Loads the signup form.
   */
  function showSignup() {
    Requests.cancelExcept(null);
    var signupButton = document.getElementById('signup-nav-button');
    var data = new FormData();
    data.append('action', 'GetSignup');
    var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, function () {
      failCallback(ID, signupButton);
    }));

    if (signupButton) {
      signupButton.blur();
    }
    var loader = newElements.createSlidingLoader();

    function successCallback() {
      Init.navbarContent.removeChild(loader);
      Init.nonav.innerHTML = Requests.get(ID).responseText;
      document.getElementById('signup-parent').classList.add('parent-in-main');

      if (signupButton) {
        Init.navbarContent.removeChild(signupButton);
      }
      var signinButton = newElements.createSignBarButton('Sign in', 'signin-nav-button', "images/login.svg");
      signinButton.addEventListener('click', showSignin);
      signinButton.style.marginLeft = 'auto';
      Init.navbarContent.appendChild(signinButton);

      Signup.init();
    }
  }

  /**
   * Called when the signup/signin form fails to load.
   * @param ID
   * @param button
   */
  function failCallback(ID, button) {
    var loader = document.querySelector('.bar-loader');
    Init.navbarContent.removeChild(loader);
    if (Requests.get(ID).status === 0) {
      newElements.showFullWindowMsg('OK', 'Unable to send request', Init.clearFullWindowMsg);
    }
    else {
      newElements.showFullWindowMsg('OK', 'Error', Init.clearFullWindowMsg);
    }
  }

  /**
   * Creates the landing page element.
   * @returns {HTMLDivElement}
   */
  function createLanding() {
    var signupButton = document.createElement('button');
    signupButton.id = 'landing-signup-button';
    signupButton.innerHTML = 'Sign up';
    signupButton.addEventListener('click', showSignup);

    var signinTitle = document.createElement('p');
    signinTitle.id = 'landing-signin-msg';
    signinTitle.innerHTML = 'Connect with people and share your travels.';

    var signinButtonContainer = newElements.createBlueButton('Sign in', 'landing-signin-button')
    signinButtonContainer.children[0].addEventListener('click', showSignin);

    var signupContainer = document.createElement('div');
    signupContainer.id = 'landing-signup-container';

    var signupTitle = document.createElement('p');
    signupTitle.id = 'landing-signup-msg';
    signupTitle.innerHTML = 'Don\'t have an account?';
    signupContainer.appendChild(signupTitle);
    signupContainer.appendChild(signupButton);

    var hr = document.createElement('div');
    hr.id = 'landing-divider';
    var hrLoader = document.createElement('div');
    hrLoader.id = 'landing-loader';
    hr.appendChild(hrLoader);

    var page = document.createElement('div');
    page.className = 'parent-in-main';
    page.id = 'landing-page';
    page.appendChild(signinTitle);
    page.appendChild(signinButtonContainer);

    page.appendChild(hr);
    page.appendChild(signupContainer);

    var section = document.createElement('div');
    section.id = 'landing-section';
    section.appendChild(page);

    return section;
  }

  return {
    init: init
  };
}());
