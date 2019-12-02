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
    el.signinButton.addEventListener('click', function () {

    });
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