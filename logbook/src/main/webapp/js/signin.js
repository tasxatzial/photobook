'use strict';

/**
 * Functions related to the signin process. These do not include the loading of the signin form (loaded in landing.js)
 * @type {{init: init}}
 */
var Signin = (function() {
  var el = {
    username: null,
    password: null,
    signinMsg: null,
    signinButton: null,
    signinPhotoButton:null
  };

  /**
   * Disables all form inputs.
   */
  function disableInputs() {
    formSubmit.disable(el.signinButton);
    formInput.disable(el.username);
    formInput.disable(el.password);
    formButton.disable(el.signinPhotoButton);
  }

  /**
   * Enables all form inputs.
   */
  function enableInputs() {
    formSubmit.enable(el.signinButton);
    formInput.enable(el.username);
    formInput.enable(el.password);
    formButton.enable(el.signinPhotoButton);
  }

  /**
   * Performs sign in.
   */
  function doSignin() {
    Requests.cancelExcept(null);

    formMsg.clear(el.signinMsg);
    var loader = document.querySelector('.bar-loader');
    if (!loader) {
      loader = newElements.createSlidingLoader();
      Init.navbarContent.appendChild(loader);
    }

    disableInputs();

    /* prepare data */
    var data = new FormData();
    data.append(el.username.name.split('-')[1], el.username.value.toLowerCase());
    data.append(el.password.name.split('-')[1], el.password.value);
    data.append('action', 'Signin');

    /* make the call */
    var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, failCallback));

    function successCallback() {
      Init.navbarContent.removeChild(loader);
      var response = JSON.parse(Requests.get(ID).responseText);
      if (response.HOMEPAGE) {
        var signupButton = document.getElementById('signup-nav-button');
        Init.navbarContent.removeChild(signupButton);
        Init.setUser(response.USER);
        Homepage.init();
      }
      else {
        el.signinMsg.classList.add('msg-open');
        setTimeout(function() {
          if (response['username'] === '0') {
            formMsg.showError(el.signinMsg, 'Invalid username');
          }
          else {
            formMsg.showError(el.signinMsg, 'Invalid password');
          }
        }, 150);
        Init.scrollTo(el.signinButton);
        enableInputs();
      }
    }

    function failCallback() {
      Init.navbarContent.removeChild(loader);
      enableInputs();
      var error = null;
      if (Requests.get(ID).status === 0) {
        error = 'Unable to send request';
      }
      else {
        error = 'Error';
      }
      newElements.showFullWindowMsg('OK', error, Init.clearFullWindowMsg);
    }
  }

  /**
   * Initializations after the signin form has loaded.
   */
  function init() {
    el.signinButton = document.querySelector('#signin-button button');
    el.username = document.getElementById('signin-username');
    el.password = document.getElementById('signin-password');
    el.signinMsg = document.getElementById('signin-process-msg');
    el.signinPhotoButton = document.querySelector('.signin-photo-button');

    el.username.addEventListener('input', function() {
      formMsg.clear(el.signinMsg);
      el.signinMsg.classList.remove('msg-open');
    });
    el.password.addEventListener('input', function() {
      formMsg.clear(el.signinMsg);
      el.signinMsg.classList.remove('msg-open');
    });
    el.signinButton.addEventListener('click', doSignin);
    el.signinButton.disabled = false;

    SignInFace.init();
  }

  return {
    init: init
  };
}());