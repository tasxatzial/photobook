'use strict';

var Landing = (function() {

  function init() {
    var landingSignupButton = document.querySelector('#landing-signup-button input');
    var landingSigninButton = document.querySelector('#landing-signin-button input');

    landingSignupButton.addEventListener('click', function() {
      Signup.init('GetSignup');
    });
    landingSigninButton.addEventListener('click', Signin.init);
    landingSigninButton.disabled = false;
    landingSignupButton.disabled = false;
  }

  return {
    init: init
  };
}());