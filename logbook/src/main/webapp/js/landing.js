'use strict';

var Landing = (function() {

  function init() {
    var landingSignupButton = document.querySelector('#landing-signup-button input');
    var landingSigninButton = document.querySelector('#landing-signin-button input');

    landingSignupButton.addEventListener('click', function() {
      Signup.init('GetSignup', 'Landing');
    });
    landingSigninButton.addEventListener('click', function() {
      Signin.init('Landing');
    });
    landingSigninButton.disabled = false;
    landingSignupButton.disabled = false;
  }

  return {
    init: init
  };
}());