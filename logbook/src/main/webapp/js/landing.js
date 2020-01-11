'use strict';

var Landing = (function() {

  function init() {
    Init.nonav.innerHTML = '';
    Init.nonav.appendChild(createLanding());

    var landingSignupButton = document.querySelector('#landing-signup-button input');

    landingSignupButton.addEventListener('click', function() {
      Signup.init('GetSignup', 'Landing');
    });
  }

  function showSignin(from) {
    Requests.cancelAll();

    var data = new FormData();
    data.append('action', 'GetSignin');

    var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, failCallback));

    function successCallback() {
      Init.nonav.innerHTML = Requests.get(ID).responseText;

      /* remove the top right signup button (if there is one) */
      if (from === 'Signup') {
        Init.navbarContent.removeChild(Init.navbarContent.children[1]);
      }

      Signin.init();
    }

    function failCallback() {
      console.log(Requests.get(ID).responseText);
    }
  }

  function createLanding() {
    var signupButton = document.createElement('input');
    signupButton.type = 'button';
    signupButton.value = 'Sign up';

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
    signinButton.addEventListener('click', function() {
      Landing.showSignin('Landing');
    });

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
    init: init,
    showSignin: showSignin
  };
}());