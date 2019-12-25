'use strict';

var Landing = (function() {

  var el = {
    landingSignupButton: null,
    landingSigninButton: null,
    navbarContent: null,
    nonav: null
  };

  function showSignup() {
    var state = {
      xhr: null
    };

    /* get the signup page, prepare the data */
    var data = new FormData();
    data.append('action', 'GetSignup');

    /* make the call to the main servlet */
    state.xhr = ajaxRequest('POST', 'Main', data, successCallback, failCallback);

    function successCallback() {

      /* replace the content of index with the signup page */
      el.nonav.innerHTML = state.xhr.responseText;

      /* remove the top right signin button (if there is one) */
      if (el.navbarContent.children[1]) {
        el.navbarContent.removeChild(el.navbarContent.children[1]);
      }

      Signup.init('Signup');
    }

    function failCallback() {
      console.log(state.xhr.responseText);
    }
  }

  function init() {
    el.navbarContent = document.getElementById('navbar-content');
    el.landingSignupButton = document.querySelector('#landing-signup-button input');
    el.landingSigninButton = document.querySelector('#landing-signin-button input');
    el.nonav = document.getElementById('no-nav');

    el.landingSignupButton.addEventListener('click', showSignup);
    el.landingSigninButton.addEventListener('click', Signin.init);
    el.landingSigninButton.disabled = false;
    el.landingSignupButton.disabled = false;
  }

  return {
    init: init,
    showSignup: showSignup
  };
}());