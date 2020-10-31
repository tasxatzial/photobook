'use strict';

/**
 * Functions related to the signup process and the edit account info process.
 * These do not include the loading of the signup form (loaded in landing.js/account_form.js)
 * @type {{init: init}}
 */
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

  /**
   * The first function that is called when the signup button is clicked.
   * @param action
   * @param checkedInputs
   */
  function clickSignup(action) {
    formMsg.clear(el.signupMsg);
    if (action === 'Signup') {
      var invalidElement = ValidChecker.checkInvalidElements(ValidChecker.getCheckedInputsStep1());
    }
    else {
      invalidElement = ValidChecker.checkInvalidElements(ValidChecker.getCheckedInputs());
    }
    if (invalidElement) {
      Init.scrollTo(invalidElement.parentNode);
    }
    else {
      checkUsernameEmailDB(action);
    }
  }

  /**
   * Returns a formData object that contains all the info that will be submitted.
   * @returns {FormData}
   */
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
    console.log(el.address.value);
    data.append(el.address.name.split('-')[1], el.address.value);
    return data;
  }

  /**
   * Enables all form inputs.
   * @param action
   */
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

  /**
   * Disables all form inputs.
   */
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

  /**
   * Performs signup using the specified action. If action='Signup' it will perform signup.
   * If action='UpdateAccount', it will update the user account info.
   * @param action
   */
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
        el.signupSection.classList = 'post-signup-section';
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
            el.signupSection.classList = 'post-signup-section';
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

  /**
   * Checks whether the username and email are taken by other user.
   * @param action
   */
  function checkUsernameEmailDB(action) {
    Init.scrollTo(el.signupButton);

    /* if we just want to update account info (that means the username field is already disabled)
    and the email has not changed, there is no need to send a request */
    if (action === 'UpdateAccount' && el.email.value === data.oldEmail) {
      doSignup(action);
      return;
    }
    Requests.cancelExcept(null);

    /* disable both username and email fields during this process */
    formInput.disable(el.username);
    formInput.disable(el.email);

    /* also disable signup button */
    if (action === 'UpdateAccount') {
      formSubmit.disable(el.signupButton);
    }
    else {
      formSubmit.disable(el.step1ButtonContainer.children[0]);
    }

    formMsg.showElement(el.signupMsg, Init.loader);
    
    var formData = new FormData();
    formData.append('action', 'CheckUsernameEmailDB');

    /* only check for duplicate email if we are requesting to update the account info */
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
        if (response === 'UpdateAccount') {
          doSignup(action);
        }
        else {
          el.step1Content.classList.add('signup-hidden');
          el.step2Content.classList.remove('signup-hidden');
          el.step2ButtonContainer.children[0].disabled = false;
        }
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
      if (action === 'UpdateAccount') {
        formSubmit.enable(el.signupButton);
      }
      else {
        formSubmit.enable(el.step1ButtonContainer.children[0]);
        formInput.enable(el.username);
      }
      formInput.enable(el.email);
    }

    function failCallback() {
      if (action === 'UpdateAccount') {
        formSubmit.enable(el.signupButton);
      }
      else {
        formSubmit.enable(el.step1ButtonContainer.children[0]);
      }
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
      if (action === 'UpdateAccount') {
        Init.scrollTo(el.signupButton);
      }
      else {
        Init.scrollTo(el.step1ButtonContainer);
      }
    }
  }

  /**
   * Initializations after the signup form has loaded.
   * @param action
   */
  function init(action) {
    el.username = document.getElementById('signup-username');
    el.email = document.getElementById('signup-email');
    el.signupSection = document.getElementById('signup-section');
    el.signupParent = document.getElementById('signup-parent');
    el.header = el.signupParent.children[0].children[0];
    el.signupContent = el.signupParent.children[1];
    el.address = document.getElementById('signup-address');
    el.gender = document.querySelectorAll('input[type="radio"]');
    el.signupMsg = document.getElementById('signup-process-msg');
    el.step1Msg = document.querySelector('.signup-process-msg1');
    el.geolocMsg = document.querySelector('.sign-process-msg2');
    el.nominatimMsg = document.querySelector('.sign-process-msg3');
    el.signupButton = document.querySelector('#signup-button input');
    el.geolocSearchButton = document.getElementsByClassName('signup-geolocation-search-button')[0];
    el.nominatimSearchButton = document.getElementsByClassName('signup-location-search-button')[0];
    el.step1Content = document.getElementById('signup-step1');
    el.step2Content = document.getElementById('signup-step2');
    el.step3Content = document.getElementById('signup-step3');
    el.step4Content = document.getElementById('signup-step4');
    el.step1ButtonContainer = document.getElementById('signup-step1-button-container');
    el.step2ButtonContainer = document.getElementById('signup-step2-button-container');
    el.step3ButtonContainer = document.getElementById('signup-step3-button-container');
    el.step1Label = document.getElementById('step1-label');
    el.step2Label = document.getElementById('step2-label');
    el.step3Label = document.getElementById('step3-label');
    el.step4Label = document.getElementById('step4-label');

    if (action === 'GetSignup') {
      el.step1ButtonContainer.children[0].addEventListener('click', function() {
        clickSignup('Signup');
      });
      el.step2ButtonContainer.children[0].addEventListener('click', function() {
        var invalidEvent = ValidChecker.checkInvalidElements(ValidChecker.getCheckedInputsStep2());
        if (invalidEvent) {
          Init.scrollTo(invalidEvent.parentNode);
        }
        else {
          el.step2Content.classList.add('signup-hidden');
          el.step3Content.classList.remove('signup-hidden');
          el.step3ButtonContainer.children[0].disabled = false;
        }
      });
      el.step3ButtonContainer.children[0].addEventListener('click', function() {
        var invalidEvent = ValidChecker.checkInvalidElements(ValidChecker.getCheckedInputsStep3());
        if (invalidEvent) {
          Init.scrollTo(invalidEvent.parentNode);
        }
        else {
          el.step3Content.classList.add('signup-hidden');
          el.step4Content.classList.remove('signup-hidden');
          el.signupButton.disabled = false;
        }
      });
      el.signupButton.addEventListener('click', function() {
        doSignup('Signup');
      });
      el.step1ButtonContainer.children[0].disabled = false;
    }

    /* disable the username if we are editing the account info instead of performing signup */
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

      el.signupButton.disabled = false;
      el.step1ButtonContainer.classList.add('signup-hidden');
      el.step2ButtonContainer.classList.add('signup-hidden');
      el.step3ButtonContainer.classList.add('signup-hidden');
      el.step1Label.classList.add('signup-hidden');
      el.step2Label.classList.add('signup-hidden');
      el.step3Label.classList.add('signup-hidden');
      el.step4Label.classList.add('signup-hidden');
      el.step2Content.classList.remove('signup-hidden');
      el.step3Content.classList.remove('signup-hidden');
      el.step4Content.classList.remove('signup-hidden');
    }

    ValidChecker.init();
    SignUpLocation.init();
    SignUpFace.init();
    data.oldEmail = el.email.value;
    el.email.disabled = false;
  }

  return {
    init: init
  };
}());