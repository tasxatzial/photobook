var Signup = (function() {

  var el = {
    navbarContent: null,
    username: null,
    email: null,
    signupSection: null,
    header: null,
    signupContent: null,
    address: null,
    gender: null,
    signupButton: null,
    dataNames: null,
    signinMsg: null,
    signinButton: null
  };

  function init(action) {
    el.navbarContent = document.getElementById('navbar-content');
    el.username = document.getElementById('signup-username');
    el.email = document.getElementById('signup-email');
    el.signupSection = document.getElementById('signup-section');
    el.header = el.signupSection.children[0].children[0].children[0];
    el.signupContent = el.signupSection.children[0].children[1];
    el.address = document.getElementById('signup-address');
    el.gender = document.querySelectorAll('input[type="radio"]');
    el.signupButton = document.querySelector('#signup-button input');
    el.signinMsg = document.getElementById('signupin-msg');

    el.signupButton.addEventListener('click', function () {

    });

    if (action === 'Signup') {
      el.signinButton = newElements.createSignBarButton('Sign in', 'signin-nav-button');
      el.signinButton.addEventListener('click', function () {
        el.signinButton.disabled = true;
        Landing.showSignin();
      });
      el.signinButton.style.marginLeft = 'auto';
      el.navbarContent.appendChild(el.signinButton);
    }
    el.signupButton.disabled = false;
  }

  return {
    init: init
  };
}());