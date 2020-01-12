'use strict';

var Signin = (function() {
  var el = {
    username: null,
    password: null,
    signinMsg: null,
    signinButton: null
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
    var loader = newElements.createLoader("images/loader.gif");
    formMsg.showElement(el.signinMsg, loader);
    el.signinButton.scrollIntoView();
    
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
        var signupButton = document.getElementById('signup-nav-button');
        Init.navbarContent.removeChild(signupButton);
        Init.setUser(response.USER);
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

  function init() {
    el.signinButton = document.querySelector('#signin-button input');
    el.username = document.getElementById('signin-username');
    el.password = document.getElementById('signin-password');
    el.signinMsg = document.getElementById('sign-process-msg');

    el.username.addEventListener('input', function() {
      formMsg.clear(el.signinMsg);
    });
    el.password.addEventListener('input', function() {
      formMsg.clear(el.signinMsg);
    });
    el.signinButton.addEventListener('click', function() {
      formMsg.clear(el.signinMsg);
      doSignin();
    });
    el.signinButton.disabled = false;

    SignInFace.init();
  }

  return {
    init: init
  };
}());