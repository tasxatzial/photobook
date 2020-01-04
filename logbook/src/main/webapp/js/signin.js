'use strict';

var Signin = (function() {
  var el = {
    signinButton: null,
    username: null,
    password: null,
    signinContent: null,
    signinMsg: null
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
    Requests.cancelAll();

    disableInputs();

    /* prepare data */
    var data = new FormData();
    data.append(el.username.name.split('-')[1], el.username.value);
    data.append(el.password.name.split('-')[1], el.password.value);
    data.append('action', 'Signin');

    /* make the call */
    var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, failCallback));

    function successCallback() {
      var response = JSON.parse(Requests.get(ID).responseText);
      if (response.HOMEPAGE) {
        Init.navbarContent.removeChild(el.signupButton);
        Homepage.init();
      }
      else {
        if (response['username'] === '0') {
          formMsg.showError(el.signinMsg, 'Invalid username');
        }
        else {
          formMsg.showError(el.signinMsg, 'Invalid password');
        }
        enableInputs();
      }
    }

    function failCallback() {
      enableInputs();
      console.log(Requests.get(ID).responseText);
    }
  }

  function init(from) {
    Requests.cancelAll();

    /* prepare the data */
    var data = new FormData();
    data.append('action', 'GetSignin');

    /* make the call to the main servlet */
    var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, failCallback));

    function successCallback() {
      if (from === 'Signup') {
        Init.navbarContent.removeChild(Init.navbarContent.children[1]);
      }
      Init.nonav.innerHTML = Requests.get(ID).responseText;

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
      Init.navbarContent.appendChild(el.signupButton);

      SignInFace.init();
    }

    function failCallback() {
      console.log(Requests.get(ID).responseText);
    }
  }

  return {
    init: init
  };
}());