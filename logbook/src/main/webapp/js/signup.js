'use strict';

var Signup = (function() {

  var el = {
    username: null,
    email: null,
    signupSection: null,
    header: null,
    signupContent: null,
    address: null,
    gender: null,
    signupButton: null,
    signinMsg: null
  };

  function clickSignup(action) {
    el.signinMsg.innerHTML = '';
    var invalidElement = checkInvalidElements();
    if (invalidElement) {
      ValidChecker.scrollToParent(invalidElement);
    }
    else if (el.username.isTaken === 1) {
      ValidChecker.scrollToParent(el.username);
    }
    else if (el.email.isTaken === 1) {
      ValidChecker.scrollToParent(el.email);
    }
    else if (!el.signupButton.disabled) {
      doSignup(action);
    }
  }

  function gatherData() {
    var data = new FormData();
    var inputs = ValidChecker.getCheckedInputs();
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

  function enableInputs(action) {
    var inputs = ValidChecker.getCheckedInputs();
    for (var i = 0; i < inputs.length; i++) {
      if (action === 'Signup' || inputs[i].name !== "signup-username") {
        formInput.enable(inputs[i]);
      }
    }
    formInput.enable(el.gender[0]);
    formInput.enable(el.gender[1]);
    formInput.enable(el.gender[2]);
    formInput.enable(el.address);
    formSubmit.enable(el.signupButton);
  }

  function disableInputs() {
    var inputs = ValidChecker.getCheckedInputs();
    for (var i = 0; i < inputs.length; i++) {
      formInput.disable(inputs[i]);
    }
    formInput.disable(el.gender[0]);
    formInput.disable(el.gender[1]);
    formInput.disable(el.gender[2]);
    formInput.disable(el.address);
    formSubmit.disable(el.signupButton);
  }

  function doSignup(action) {
    Requests.cancelAll();
    disableInputs();

    var data = gatherData();
    data.append('action', action);
    var ID = Requests.add(ajaxRequest('POST', 'Main', data,
        function() {return successCallback(action);},
        function() {return failCallback(action);}
    ));

    function successCallback(action) {
      if (action === 'Signup') {
        var response = JSON.parse(Requests.get(ID).responseText);
        var accountInfoTitle = document.createElement('p');
        var accountInfo = newElements.createSignupSummary(response, Init.dataNames, false);
        el.header.innerHTML = 'Sign up completed';
        accountInfoTitle.innerHTML = 'You provided the following information: ';
        el.signupContent.innerHTML = '';
        el.signupMiddle.style.maxWidth = '65rem';
        el.signupContent.appendChild(accountInfoTitle);
        el.signupContent.appendChild(accountInfo);
      }
      else {
        formMsg.showOK(el.signinMsg, 'Success');
      }
      enableInputs(action);
    }

    function failCallback(action) {
      el.signupContent.innerHTML = '';
      el.signupMiddle.style.maxWidth = '65rem';
      if (Requests.get(ID).status >= 500) {
        var errorMsg = document.createElement('p');
        errorMsg.innerHTML = 'Oops, something went wrong. Please try again in a while';
        el.header.innerHTML = Requests.get(ID).status + ' - Server Error';
        el.signupContent.appendChild(errorMsg);
      } else {
        var response = JSON.parse(Requests.get(ID).responseText);
        var accountInfo = newElements.createSignupSummary(response, Init.dataNames, true);
        el.header.innerHTML = Requests.get(ID).status + ' - Bad Request';
        el.signupContent.appendChild(accountInfo);
      }
      enableInputs(action);
    }
  }

  function checkInvalidElements() {
    var inputs = ValidChecker.getCheckedInputs();
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
    el.username = document.getElementById('signup-username');
    el.email = document.getElementById('signup-email');
    el.signupMiddle = document.getElementById('signup-middle');
    el.header = el.signupMiddle.children[0].children[0];
    el.signupContent = el.signupMiddle.children[1];
    el.address = document.getElementById('signup-address');
    el.gender = document.querySelectorAll('input[type="radio"]');
    el.signinMsg = document.getElementById('signupin-msg');
    el.signupButton = document.querySelector('#signup-button input');

    if (action === 'GetSignup') {
      el.signupButton.addEventListener('click', function() {
        clickSignup('Signup');
      });
    }
    else if (action === 'AccountInfo') {
      formInput.disable(document.getElementById('signup-username'));

      var countryHidden = document.getElementById('country-hidden');
      var country = document.getElementById('signup-country');
      country.children[0].selected = 'false';
      for (var j = 0; j < country.children.length; j++) {
        if (country.children[j].value === countryHidden.innerHTML ||
            country.children[j].name === countryHidden.innerHTML) {
          country.children[j].selected = 'true';
          break;
        }
      }

      el.signupButton.addEventListener('click', function() {
        clickSignup('UpdateAccount');
      });
    }

    ValidChecker.init(action);
    SignUpLocation.init();
    SignUpFace.init();

    el.signupButton.disabled = false;
  }

  return {
    init: init
  };
}());