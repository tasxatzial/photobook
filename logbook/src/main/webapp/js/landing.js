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
    Init.clearFullWindowMsg();
    newElements.showFullWindowMsg('Cancel', 'Please wait...', function () {
      Requests.cancelExcept(null);
      Init.clearFullWindowMsg();
    });
    Requests.cancelExcept(null);

    var data = new FormData();
    data.append('action', 'GetSignin');

    var ID = null;
    ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, function () {
      failCallback(ID);
    }));

    function successCallback() {
      Init.clearFullWindowMsg();
      Init.nonav.innerHTML = Requests.get(ID).responseText;

      var signinButton = document.getElementById('signin-nav-button');
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
    Init.clearFullWindowMsg();
    newElements.showFullWindowMsg('Cancel', 'Please wait...', function () {
      Requests.cancelExcept(null);
      Init.clearFullWindowMsg();
    });
    Requests.cancelExcept(null);

    var data = new FormData();
    data.append('action', 'GetSignup');
    var ID = null;
    ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, function () {
      failCallback(ID);
    }));

    function successCallback() {
      Init.clearFullWindowMsg();
      Init.nonav.innerHTML = Requests.get(ID).responseText;
      document.getElementById('signup-parent').classList.add('parent-in-main');

      var signupButton = document.getElementById('signup-nav-button');
      if (signupButton) {
        Init.navbarContent.removeChild(signupButton);
      }
      var signinButton = newElements.createSignBarButton('Sign in', 'signin-nav-button', "images/login.svg");
      signinButton.addEventListener('click', showSignin);
      signinButton.style.marginLeft = 'auto';
      Init.navbarContent.appendChild(signinButton);

      Signup.init('GetSignup');
    }
  }

  /**
   * Called when the signup/signin form fails to load.
   * @param ID
   */
  function failCallback(ID) {
    Init.clearFullWindowMsg();
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
    var signupButton = document.createElement('input');
    signupButton.type = 'button';
    signupButton.value = 'Sign up';
    signupButton.addEventListener('click', showSignup);

    var signupButtonContainer = document.createElement('div');
    signupButtonContainer.id = 'landing-signup-button';
    signupButtonContainer.className = 'sign-button';
    signupButtonContainer.appendChild(signupButton);

    var signupTitle = document.createElement('p');
    signupTitle.id = 'landing-signup-msg';
    signupTitle.innerHTML = 'Connect with people and share your travels.';

    var signinButton = document.createElement('input');
    signinButton.type = 'button';
    signinButton.value = 'Sign in';
    signinButton.addEventListener('click', showSignin);

    var signinButtonContainer = document.createElement('div');
    signinButtonContainer.id = 'landing-signin-button';
    signinButtonContainer.className = 'sign-button';
    signinButtonContainer.appendChild(signinButton);

    var signinTitle = document.createElement('p');
    signinTitle.id = 'landing-signin-msg';
    signinTitle.innerHTML = 'Already have an account?';

    var hr = document.createElement('hr');

    var page = document.createElement('div');
    page.className = 'parent-in-main';
    page.id = 'landing-page';
    page.appendChild(signupTitle);
    page.appendChild(signupButtonContainer);
    page.appendChild(hr);
    page.appendChild(signinTitle);
    page.appendChild(signinButtonContainer);

    var section = document.createElement('div');
    section.id = 'landing-section';
    section.appendChild(page);

    return section;
  }

  return {
    init: init
  };
}());