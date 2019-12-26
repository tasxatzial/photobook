'use strict';

var Signin = (function() {
  var state = {
    xhr: null
  };

  var el = {
    signinButton: null,
    username: null,
    password: null,
    signinContent: null,
    navbarContent: null,
    signinMsg: null,
    nonav: null
  };

  function disableInputs() {
    formSubmit.disable(el.signinButton);
    formInput.disable(el.username);
    formInput.disable(el.password);
  }

  function enableInputs() {
    formSubmit.enable(el.signinButton);
    formInput.enable(el.username);
    formInput.enable(el.password);
  }

  function doSignin() {
    var state = {
      xhr: null
    };

    disableInputs();

    /* prepare data */
    var data = new FormData();
    data.append(el.username.name.split('-')[1], el.username.value);
    data.append(el.password.name.split('-')[1], el.password.value);
    data.append('action', 'Signin');

    /* make the call */
    state.xhr = ajaxRequest('POST', 'Main', data, successCallback, failCallback);

    function successCallback() {
      if (state.xhr.getResponseHeader("content-type").split(';')[0] === 'application/json') {
        var response = JSON.parse(state.xhr.responseText);
        var invalid = null;
        if (response['username'] === '0') {
          invalid = 'username';
        }
        else {
          invalid = 'password';
        }
        formMsg.showError(el.signinMsg, 'Invalid ' + invalid);
        enableInputs();
      }
      else {
        el.nonav.innerHTML = state.xhr.responseText;
        el.navbarContent.removeChild(el.signupButton);
        Homepage.init();
      }
    }

    function failCallback() {
      enableInputs();
      console.log(state.xhr.responseText);
    }
  }

  function init(from) {
    el.navbarContent = document.getElementById('navbar-content');
    el.nonav = document.getElementById('no-nav');

    /* prepare the data */
    var data = new FormData();
    data.append('action', 'GetSignin');

    /* make the call to the main servlet */
    state.xhr = ajaxRequest('POST', 'Main', data, function() {
      if (from === 'Signup') {
        Signup.clear();
      }
      successCallback();
    }, failCallback);

    function successCallback() {
      el.nonav.innerHTML = state.xhr.responseText;

      el.signinButton = document.querySelector('#signin-button input');
      el.username = document.getElementById('signin-username');
      el.password = document.getElementById('signin-password');
      el.signinContent = document.getElementById('signin-content');
      el.signinMsg = document.getElementById('signupin-msg');

      el.signupButton = newElements.createSignBarButton('Sign up', 'signup-nav-button');

      el.username.addEventListener('input', function() {
        el.signinMsg.innerHTML = '';
      });
      el.password.addEventListener('input', function() {
        el.signinMsg.innerHTML = '';
      });
      el.signinButton.addEventListener('click', function() {
        el.signinMsg.innerHTML = '';
      });
      el.signinButton.addEventListener('click', doSignin);
      el.signupButton.addEventListener('click', function() {
        Signup.init('GetSignup', 'Signin');
      });
      el.signupButton.style.marginLeft = 'auto';
      el.signinButton.disabled = false;
      el.navbarContent.appendChild(el.signupButton);

      SignInFace.init();
    }

    function failCallback() {
      console.log(state.xhr.responseText);
    }
  }

  function clear() {
    /* remove the top right button */
    var navbarContent = document.getElementById('navbar-content');
    navbarContent.removeChild(navbarContent.children[1]);
  }

  return {
    init: init,
    clear: clear
  };
}());