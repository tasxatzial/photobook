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

  function clickSignup(action) {
    var invalidElement = checkInvalidElements();
    if (invalidElement) {
      ValidChecker.scrollToParent(invalidElement);
    }
    else if (el.username.isTaken === 1) {
      console.log('taken');
      ValidChecker.scrollToParent(el.username);
    }
    else if (el.email.isTaken === 1) {
      ValidChecker.scrollToParent(el.email);
    }
    else {
      doSignup(action);
    }
  }

  function gatherData() {
    var data = new FormData();
    var inputs = ValidChecker.getInputs();
    for (var i = 0; i < inputs.length; i++) {
      data.append(inputs[i].name.split('-')[1], inputs[i].value);
    }

    for (var j = 0; j < el.gender.length; j++) {
      if (el.gender[j].checked) {
        data.append(el.gender[j].name.split('-')[1], el.gender[j].value);
      }
    }

    data.append(el.address.name.split('-')[1], el.address.value);
    return data;
  }

  function disableInputs(value, action) {
    var inputs = ValidChecker.getInputs();
    for (var i = 0; i < inputs.length; i++) {
      if (value === true) {
        formInput.disable(inputs[i]);
      }
      else if (action === 'Signup' || inputs[i].name !== "signup-username") {
        formInput.enable(inputs[i]);
      }
    }
    if (value === true) {
      formInput.disable(el.gender[0]);
      formInput.disable(el.gender[1]);
      formInput.disable(el.gender[2]);
      formInput.disable(el.address);
    }
    else {
      formInput.enable(el.gender[0]);
      formInput.enable(el.gender[1]);
      formInput.enable(el.gender[2]);
      formInput.enable(el.address);
    }
    el.signupButton.disabled = value;
  }

  function doSignup(action) {

  }

  function checkInvalidElements() {
    var inputs = ValidChecker.getInputs();
    var topElement = null;
    for (var j = 0; j < inputs.length; j++) {
      ValidChecker.checkValid(inputs[j]);
      if (!inputs[j].isValid) {
        ValidChecker.showInvalidMsg(inputs[j], inputs[j].invalidMsg);
        if (!topElement) {
          topElement = inputs[j].scrollElem;
        }
      }
    }
    return topElement;
  }

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

    ValidChecker.init();

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