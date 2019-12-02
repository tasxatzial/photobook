var Landing = (function() {

  var el = {
    landingSignupButton: null,
    landingSigninButton: null,
    navbarContent: null,
    nonav: null
  };

  function showSignin() {

  }

  function showSignup() {

  }

  function init() {
    el.navbarContent = document.getElementById('navbar-content');
    el.landingSignupButton = document.querySelector('#landing-signup-button input');
    el.landingSigninButton = document.querySelector('#landing-signin-button input');
    el.nonav = document.getElementById('no-nav');

    el.landingSignupButton.addEventListener('click', showSignup);
    el.landingSigninButton.addEventListener('click', showSignin);
    el.landingSigninButton.disabled = false;
    el.landingSignupButton.disabled = false;
  }

  return {
    init: init
  };
}());