'use strict';

/**
 * Functions related to the edit account info process.
 * These do not include the loading of the signup form (loaded in landing.js/account_form.js)
 * @type {{init: init}}
 */
var EditAccount = (function() {
  var data = {
    oldEmail: null
  };

  var el = {
    signupSection: null,
    signupParent: null,
    signupButton: null,
    signupMsg: null,
    signupContent: null,
    header: null,
    username: null,
    email: null,
    address: null,
    gender: null,
    interests: null,
    about: null,
    geolocSearchButton: null,
    nominatimSearchButton: null
  };

  /**
   * The first function that is called when the update account button is clicked.
   */
  function clickSignup() {
    formMsg.clear(el.signupMsg);
    var invalidElement = ValidChecker.checkInvalidElements(ValidChecker.getCheckedInputs());
    if (invalidElement) {
      Init.scrollTo(invalidElement.parentNode);
    }
    else {
      checkUsernameEmailDB();
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
      var name = inputs[i].name.split('-')[1];
      if (name === 'username' || name === 'email') {
        data.append(name, inputs[i].value.toLowerCase());
      } else {
        data.append(name, inputs[i].value);
      }
    }

    for (var j = 0; j < el.gender.length; j++) {
      if (el.gender[j].checked) {
        data.append(el.gender[j].name.split('-')[1], el.gender[j].value);
      }
    }
    data.append(el.interests.name.split('-')[1], el.interests.value);
    data.append(el.about.name.split('-')[1], el.about.value);
    data.append(el.address.name.split('-')[1], el.address.value);
    return data;
  }

  /**
   * Enables all form inputs.
   */
  function enableInputs() {
    var inputs = ValidChecker.getCheckedInputs();
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].name !== "signup-username") {
        formInput.enable(inputs[i]);
      }
    }
    formInput.enable(el.gender[0]);
    formInput.enable(el.gender[1]);
    formInput.enable(el.gender[2]);
    formInput.enable(el.address);
    formInput.enable(el.interests);
    formInput.enable(el.about);
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
    formInput.disable(el.interests);
    formInput.disable(el.about);
    formSubmit.disable(el.signupButton);
    formButton.disable(el.geolocSearchButton);
    formButton.disable(el.nominatimSearchButton);
  }

  /**
   * Updates the account (sends the data to the server)
   */
  function updateAccount() {
    Requests.cancelExcept(null);
    disableInputs();
    Init.scrollTo(el.signupButton);
    el.signupMsg.classList.add('msg-open');
    formMsg.showElement(el.signupMsg, Init.loader);

    var data = gatherData();
    data.append('action', 'UpdateAccount');
    var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, failCallback));

    function successCallback() {
      formMsg.showOK(el.signupMsg, 'Success');
      Init.scrollTo(el.signupButton);
      enableInputs();
    }

    function failCallback() {
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
      enableInputs();
    }
  }

  /**
   * Checks whether the username and email are taken by other user.
   */
  function checkUsernameEmailDB() {
    Init.scrollTo(el.signupButton);

    /* if we just want to update account info (that means the username field is already disabled)
    and the email has not changed, there is no need to send a request */
    if (el.email.value === data.oldEmail) {
      updateAccount();
      return;
    }
    Requests.cancelExcept(null);

    /* disable both username and email fields during this process */
    formInput.disable(el.username);
    formInput.disable(el.email);

    /* also disable signup button */
    formSubmit.disable(el.signupButton);
    formMsg.showElement(el.signupMsg, Init.loader);

    var formData = new FormData();
    formData.append('action', 'CheckUsernameEmailDB');

    /* only check for duplicate email if we are requesting to update the account info */
    formData.append('email', el.email.value.toLowerCase());

    var ID = Requests.add(ajaxRequest('POST', 'Main', formData, successCallback, failCallback));

    function successCallback() {
      var response = JSON.parse(Requests.get(ID).responseText);
      formMsg.clear(el.signupMsg);
      if (response.email === 'unused') {
        updateAccount();
      }
      else {
        ValidChecker.showInvalidMsg(el.email, response.email);
        Init.scrollTo(el.email.parentNode);
      }
      formSubmit.enable(el.signupButton);
      formInput.enable(el.email);
    }

    function failCallback() {
      formSubmit.enable(el.signupButton);
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

  /**
   * Initializations after the signup form has loaded.
   */
  function init() {
    el.username = document.getElementById('signup-username');
    el.email = document.getElementById('signup-email');
    el.signupSection = document.getElementById('signup-section');
    el.signupParent = document.getElementById('signup-parent');
    el.header = el.signupParent.children[0].children[0];
    el.signupContent = el.signupParent.children[1];
    el.address = document.getElementById('signup-address');
    el.gender = document.querySelectorAll('input[type="radio"]');
    el.interests = document.querySelector('#signup-interests-parent textarea');
    el.aboutRemaining = document.getElementById('about-remaining-chars');
    el.interestsRemaining = document.getElementById('interests-remaining-chars');
    el.about = document.querySelector('#signup-about-parent textarea');
    el.signupMsg = document.getElementById('signup-process-msg');
    el.signupButtonContainer = document.querySelector('#signup-button');
    el.signupButton = el.signupButtonContainer.children[1];
    el.geolocSearchButton = document.getElementsByClassName('signup-geolocation-search-button')[0];
    el.nominatimSearchButton = document.getElementsByClassName('signup-location-search-button')[0];
    el.step2Content = document.getElementById('signup-step2');
    el.step3Content = document.getElementById('signup-step3');
    el.step4Content = document.getElementById('signup-step4');
    el.step1ButtonContainer = document.getElementById('signup-step1-button-container');
    el.step2ButtonContainer = document.getElementById('signup-step2-button-container');
    el.step3ButtonContainer = document.getElementById('signup-step3-button-container');
    el.step4BackButton = el.signupButtonContainer.children[0];
    el.step1Label = document.getElementById('step1-label');
    el.step2Label = document.getElementById('step2-label');
    el.step3Label = document.getElementById('step3-label');
    el.step4Label = document.getElementById('step4-label');
    el.step2asterisk = document.getElementById('step2-required-asterisk');
    el.step3asterisk = document.getElementById('step3-required-asterisk');

    /* disable the username since it cannot change */
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

    el.signupButton.addEventListener('click', clickSignup);
    el.signupButton.classList.add('center-button');
    el.signupButton.disabled = false;
    el.step4BackButton.classList.add('signup-hidden');
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
    el.step2asterisk.classList.add('signup-hidden');
    el.step3asterisk.classList.add('signup-hidden');

    el.interestsRemaining.innerHTML = (el.interests.maxLength - el.interests.value.length) + " characters remaining";
    el.aboutRemaining.innerHTML = (el.about.maxLength - el.about.value.length) + " characters remaining";
    el.interests.addEventListener('input', function() {
      el.interestsRemaining.innerHTML = (el.interests.maxLength - el.interests.value.length) + " characters remaining";
    });
    el.about.addEventListener('input', function() {
      el.aboutRemaining.innerHTML = (el.about.maxLength - el.about.value.length) + " characters remaining";
    });

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