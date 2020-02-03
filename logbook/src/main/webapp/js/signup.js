'use strict';

var Signup = (function() {
  var data = {
    oldEmail: null
  };

  var el = {
    username: null,
    email: null,
    signupSection: null,
    header: null,
    signupContent: null,
    address: null,
    gender: null,
    signupButton: null,
    signupMsg: null,
    geolocSearchButton: null,
    nominatimSearchButton: null
  };

  function clickSignup(action) {
    formMsg.clear(el.signupMsg);
    var invalidElement = ValidChecker.checkInvalidElements();
    if (invalidElement) {
      Init.scrollTo(invalidElement.parentNode);
    }
    else {
      checkUsernameEmailDB(action);
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
    formButton.enable(el.geolocSearchButton);
    formButton.enable(el.nominatimSearchButton);
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
    formButton.disable(el.geolocSearchButton);
    formButton.disable(el.nominatimSearchButton);
  }

  function doSignup(action) {
    Requests.cancelExcept(null);
    disableInputs();
    formMsg.showElement(el.signupMsg, Init.loader);

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
        var accountInfo = newElements.createSignupSummary(response, Init.dataNames);
        el.header.innerHTML = 'Sign up completed';
        accountInfoTitle.innerHTML = 'You provided the following information: ';
        el.signupContent.innerHTML = '';
        el.signupParent.classList.remove('signup-parent-initial');
        el.signupContent.appendChild(accountInfoTitle);
        el.signupContent.appendChild(accountInfo);
      }
      else {
        formMsg.showOK(el.signupMsg, 'Success');
        Init.scrollTo(el.signupButton);
      }
      enableInputs(action);
    }

    function failCallback(action) {
      if (Requests.get(ID).status === 401) {
        Logout.showExpired();
        return;
      }

      if (Requests.get(ID).status === 500) {
        formMsg.showError(el.signupMsg, 'Server error');
        Init.scrollTo(el.signupButton);
      }
      else if (Requests.get(ID).status === 0) {
        formMsg.showError(el.signupMsg, 'Unable to send request');
        Init.scrollTo(el.signupButton);
      }
      else if (Requests.get(ID).status === 400) {
        var responseText = Requests.get(ID).responseText;
        if (!responseText) {
          formMsg.showError(el.signupMsg, 'Error');
          Init.scrollTo(el.signupButton);
        }
        else {
          var response = JSON.parse(responseText);
          if (response.ERROR === 'INVALID_PARAMETERS') {
            el.signupParent.classList.remove('signup-parent-initial');
            var info = newElements.createSignupSummary(response, Init.dataNames);
            el.header.innerHTML = '400 - Bad Request';
            el.signupContent.innerHTML = '';
            el.signupContent.appendChild(info);
          }
          else {
            formMsg.showError(el.signupMsg, 'Invalid action');
            Init.scrollTo(el.signupButton);
          }
        }
      }
      else {
        formMsg.showError(el.signupMsg, 'Error');
        Init.scrollTo(el.signupButton);
      }
      enableInputs(action);
    }
  }

  function checkUsernameEmailDB(action) {
    Init.scrollTo(el.signupButton);
    if (action === 'UpdateAccount' && el.email.value === data.oldEmail) {
      doSignup(action);
      return;
    }
    Requests.cancelExcept(null);
    formInput.disable(el.username);
    formInput.disable(el.email);
    formSubmit.disable(el.signupButton);
    formMsg.showElement(el.signupMsg, Init.loader);
    
    var formData = new FormData();
    formData.append('action', 'CheckUsernameEmailDB');
    if (action !== 'UpdateAccount') {
      formData.append('username', el.username.value);
    }
    formData.append('email', el.email.value);

    var ID = Requests.add(ajaxRequest('POST', 'Main', formData, successCallback, failCallback));

    function successCallback() {
      var response = JSON.parse(Requests.get(ID).responseText);
      formMsg.clear(el.signupMsg);
      if ((action === 'UpdateAccount' || response.username === 'unused') &&
          response.email === 'unused') {
        doSignup(action);
      }
      else {
        if (action === 'Signup' && response.username !== 'unused') {
          ValidChecker.showInvalidMsg(el.username, response.username);
        }
        if (response.email !== 'unused') {
          ValidChecker.showInvalidMsg(el.email, response.email);
        }
        if (action === 'Signup' && response.username !== 'unused') {
          Init.scrollTo(el.username.parentNode);
        }
        else if (response.email !== 'unused') {
          Init.scrollTo(el.email.parentNode);
        }
      }
      formSubmit.enable(el.signupButton);
      if (action === 'Signup') {
        formInput.enable(el.username);
      }
      formInput.enable(el.email);
    }

    function failCallback() {
      formSubmit.enable(el.signupButton);
      if (action === 'Signup') {
        formInput.enable(el.username);
      }
      formInput.enable(el.email);
      if (Requests.get(ID).status === 0) {
        formMsg.showError(el.signupMsg, 'Unable to send request');
      }
      else {
        formMsg.showError(el.signupMsg, 'Error');
      }
      Init.scrollTo(el.signupButton);
    }
  }

  function init(action) {
    el.username = document.getElementById('signup-username');
    el.email = document.getElementById('signup-email');
    el.signupParent = document.getElementById('signup-parent');
    el.header = el.signupParent.children[0].children[0];
    el.signupContent = el.signupParent.children[1];
    el.address = document.getElementById('signup-address');
    el.gender = document.querySelectorAll('input[type="radio"]');
    el.signupMsg = document.getElementById('sign-process-msg');
    el.signupButton = document.querySelector('#signup-button input');
    el.geolocSearchButton = document.getElementsByClassName('signup-geolocation-search-button')[0];
    el.nominatimSearchButton = document.getElementsByClassName('signup-location-search-button')[0];

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

    ValidChecker.init();
    SignUpLocation.init();
    SignUpFace.init();
    data.oldEmail = el.email.value;
    el.signupButton.disabled = false;
  }

  return {
    init: init
  };
}());