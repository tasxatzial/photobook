var Signin = (function() {
  var el = {
    signinButton: null,
    username: null,
    password: null,
    signinContent: null,
    navbarContent: null,
    signinMsg: null,
    nonav: null
  };

  function disableInputs(value) {
    el.signinButton.disabled = value;
    if (value === true) {
      formInput.disable(el.username);
      formInput.disable(el.password);
    }
    else {
      formInput.enable(el.username);
      formInput.enable(el.password);
    }
  }

  function doSignin() {
    var state = {
      xhr: null
    };

    disableInputs(true);

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
        el.signinMsg.innerHTML = 'Invalid ' + invalid;
        el.signinMsg.style.color = 'red';
        disableInputs(false);
      }
      else {
        el.nonav.innerHTML = state.xhr.responseText;
        el.navbarContent.removeChild(el.signupButton);
        /* Homepage.init(); */
      }
    }

    function failCallback() {
      disableInputs(false);
      console.log(state.xhr.responseText);
    }
  }

  function init() {
    el.signinButton = document.querySelector('#signin-button input');
    el.username = document.getElementById('signin-username');
    el.password = document.getElementById('signin-password');
    el.signinContent = document.getElementById('signin-content');
    el.navbarContent = document.getElementById('navbar-content');
    el.signinMsg = document.getElementById('signupin-msg');
    el.nonav = document.getElementById('no-nav');
    el.signupButton = newElements.createSignBarButton('Sign up', 'signup-nav-button');

    el.username.addEventListener('input', function() {el.signinMsg.innerHTML = '';});
    el.password.addEventListener('input', function() {el.signinMsg.innerHTML = '';});
    el.signinButton.addEventListener('click', function() {el.signinMsg.innerHTML = '';});
    el.signinButton.addEventListener('click', doSignin);
    el.signupButton.addEventListener('click', function () {
      el.signupButton.disabled = true;
      Landing.showSignup();
    });
    el.signupButton.style.marginLeft = 'auto';
    el.signinButton.disabled = false;
    el.navbarContent.appendChild(el.signupButton);
  }

  return {
    init: init
  };
}());