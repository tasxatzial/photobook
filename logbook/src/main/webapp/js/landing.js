'use strict';

var Landing = (function() {

  var el = {
    landingSignupButton: null,
    landingSigninButton: null,
    navbarContent: null,
    nonav: null
  };

  function showSignin() {
    var state = {
      xhr: null
    };

    /* disable signin button to avoid clicking it again */
    el.landingSigninButton.disabled =  true;

    /* get the signin page, prepare the data */
    var data = new FormData();
    data.append('action', 'GetSignin');

    /* make the call to the main servlet */
    state.xhr = ajaxRequest('POST', 'Main', data, successCallback, failCallback);

    function successCallback() {

      /* replace the content of index with the signin page */
      el.nonav.innerHTML = state.xhr.responseText;

      /* remove the top right signup button (if there is one) */
      if (el.navbarContent.children[1]) {
        el.navbarContent.removeChild(el.navbarContent.children[1]);
      }

      Signin.init();
    }

    function failCallback() {

      /* getting the signin page was a fail, so we need to re-enable the signin button */
      el.landingSigninButton.disabled =  false;

      /* enable the top right signin button (if there is one) */
      if (el.navbarContent.children[1]) {
        el.navbarContent.children[1].disabled = false;
      }

      console.log(state.xhr.responseText);
    }
  }

  function showSignup() {
    var state = {
      xhr: null
    };

    /* disable signup button to avoid clicking it again */
    el.landingSignupButton.disabled = true;

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

      /* getting the signup page was a fail, so we need to re-enable the signup button */
      el.landingSignupButton.disabled = false;

      /* enable the top right signup button (if there is one) */
      if (el.navbarContent.children[1]) {
        el.navbarContent.children[1].disabled = false;
      }

      console.log(state.xhr.responseText);
    }
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
    init: init,
    showSignin: showSignin,
    showSignup: showSignup
  };
}());