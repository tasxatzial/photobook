'use strict';

/**
 * Functions related to the edit account info process.
 * These do not include the loading of the signup form (loaded in landing.js/account_form.js)
 * @type {{init: init}}
 */
var EditAccount = (function() {
  var stateData = {
    oldEmail: null
  };

  var el = {
    signupSection: null,
    signupParent: null,
    updateButton: null,
    signupContent: null,
    header: null,
    username: null,
    email: null,
    address: null,
    gender: null,
    interests: null,
    about: null,
    geolocSearchButton: null,
    nominatimSearchButton: null,
    faceAssosiate: null
  };

  /**
   * The first function that is called when the update account button is clicked.
   */
  function clickSignup() {
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
    formSubmit.enable(el.updateButton);
    formButton.enable(el.geolocSearchButton);
    formButton.enable(el.nominatimSearchButton);
    el.faceAssosiate.disabled = false;
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
    formSubmit.disable(el.updateButton);
    formButton.disable(el.geolocSearchButton);
    formButton.disable(el.nominatimSearchButton);
    el.faceAssosiate.disabled = true;
  }

  /**
   * Updates the account (sends the data to the server)
   */
  function updateAccount() {
    Requests.cancelExcept(null);
    disableInputs();
    var loader = newElements.createSlidingLoader();

    var data = gatherData();
    data.append('action', 'UpdateAccount');
    var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, failCallback));

    function successCallback() {
      Init.navbarContent.removeChild(loader);
      stateData.oldEmail = el.email.value;
      var editSection = document.querySelector('#account-subsection #signup-section');
      if (editSection) {
        newElements.showFullWindowMsg('OK', 'Account updated!', Init.clearFullWindowMsg);
      }
      enableInputs();
    }

    function failCallback() {
      Init.navbarContent.removeChild(loader);
      if (Requests.get(ID).status === 401) {
        Logout.showExpired();
        return;
      }
      if (Requests.get(ID).status === 500) {
        newElements.showFullWindowMsg('OK', 'Server error', Init.clearFullWindowMsg);
        Init.scrollTo(el.updateButton);
      }
      else if (Requests.get(ID).status === 0) {
        newElements.showFullWindowMsg('OK', 'Unable to send request', Init.clearFullWindowMsg);
        Init.scrollTo(el.updateButton);
      }
      else if (Requests.get(ID).status === 400) {
        var responseText = Requests.get(ID).responseText;
        if (!responseText) {
          newElements.showFullWindowMsg('OK', 'Error', Init.clearFullWindowMsg);
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
            newElements.showFullWindowMsg('OK', 'Invalid action', Init.clearFullWindowMsg);
          }
        }
      }
      else {
        newElements.showFullWindowMsg('OK', 'Error', Init.clearFullWindowMsg);
      }
      enableInputs();
    }
  }

  /**
   * Checks whether the username and email are taken by other user.
   */
  function checkUsernameEmailDB() {

    /* if we just want to update account info (that means the username field is already disabled)
    and the email has not changed, there is no need to send a request */
    if (el.email.value === stateData.oldEmail) {
      updateAccount();
      return;
    }
    Requests.cancelExcept(null);

    var loader = newElements.createSlidingLoader();

    /* disable email field & update account button during this process */
    formInput.disable(el.email);
    formSubmit.disable(el.updateButton);

    var formData = new FormData();
    formData.append('action', 'CheckUsernameEmailDB');

    /* only check for duplicate email if we are requesting to update the account info */
    formData.append('email', el.email.value.toLowerCase());

    var ID = Requests.add(ajaxRequest('POST', 'Main', formData, successCallback, failCallback));

    function successCallback() {
      Init.navbarContent.removeChild(loader);
      var response = JSON.parse(Requests.get(ID).responseText);
      if (response.email === 'unused') {
        updateAccount();
      }
      else {
        ValidChecker.showInvalidMsg(el.email, response.email);
        Init.scrollTo(el.email.parentNode);
      }
      formSubmit.enable(el.updateButton);
      formInput.enable(el.email);
    }

    function failCallback() {
      Init.navbarContent.removeChild(loader);
      formSubmit.enable(el.updateButton);
      formInput.enable(el.email);
      if (Requests.get(ID).status === 0) {
        newElements.showFullWindowMsg('OK', 'Unable to send request', Init.clearFullWindowMsg);
      }
      else {
        newElements.showFullWindowMsg('OK', 'Error', Init.clearFullWindowMsg);
      }
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
    el.step1Content = el.signupContent.children[0];
    el.step2Content = el.signupContent.children[1];
    el.step3Content = el.signupContent.children[2];
    el.step4Content = el.signupContent.children[3];
    el.address = document.getElementById('signup-address');
    el.gender = document.querySelectorAll('input[type="radio"]');
    el.interests = document.querySelector('#signup-interests-parent textarea');
    el.aboutRemaining = document.getElementById('about-remaining-chars');
    el.interestsRemaining = document.getElementById('interests-remaining-chars');
    el.about = document.querySelector('#signup-about-parent textarea');
    el.signupButtonContainer = document.querySelector('#signup-button');
    el.updateButton = el.signupButtonContainer.children[1];
    el.geolocSearchButton = document.getElementsByClassName('signup-geolocation-search-button')[0];
    el.nominatimSearchButton = document.getElementsByClassName('signup-location-search-button')[0];
    el.step1ButtonContainer = document.getElementById('signup-step1-button-container');
    el.step2ButtonContainer = document.getElementById('signup-step2-button-container');
    el.step3ButtonContainer = document.getElementById('signup-step3-button-container');
    el.step1Label = document.getElementById('step1-label');
    el.step2Label = document.getElementById('step2-label');
    el.step3Label = document.getElementById('step3-label');
    el.step4Label = document.getElementById('step4-label');
    el.step2asterisk = document.getElementById('step2-required-asterisk');
    el.step3asterisk = document.getElementById('step3-required-asterisk');
    el.faceAssosiate = document.querySelector("input[type=checkbox]");

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

    el.updateButton.addEventListener('click', function() {
      this.blur();
      clickSignup();
    });

    el.updateButton.classList.add('center-button');
    el.updateButton.disabled = false;
    el.signupButtonContainer.removeChild(el.signupButtonContainer.children[0]);
    el.step1Content.removeChild(el.step1ButtonContainer);
    el.step2Content.removeChild(el.step2ButtonContainer);
    el.step3Content.removeChild(el.step3ButtonContainer);
    el.step1Content.removeChild(el.step1Label);
    el.step2Content.removeChild(el.step2Label);
    el.step3Content.removeChild(el.step3Label);
    el.step4Content.removeChild(el.step4Label);
    el.step2Content.removeChild(el.step2asterisk);
    el.step3Content.removeChild(el.step3asterisk);
    el.step2Content.classList.remove('signup-hidden');
    el.step3Content.classList.remove('signup-hidden');
    el.step4Content.classList.remove('signup-hidden');

    el.interestsRemaining.innerHTML = (el.interests.maxLength - el.interests.value.length) + " characters remaining";
    el.aboutRemaining.innerHTML = (el.about.maxLength - el.about.value.length) + " characters remaining";
    el.interests.addEventListener('input', function() {
      el.interestsRemaining.innerHTML = (el.interests.maxLength - el.interests.value.length) + " characters remaining";
    });
    el.about.addEventListener('input', function() {
      el.aboutRemaining.innerHTML = (el.about.maxLength - el.about.value.length) + " characters remaining";
    });

    var firstName = document.getElementById('signup-firstName');
    var lastName = document.getElementById('signup-lastName');
    var occupation = document.getElementById('signup-job');
    var city = document.getElementById('signup-city');
    var birthDate = document.getElementById('signup-birthDate');
    var password = document.getElementById('signup-password');
    var passwordConfirm = document.getElementById('signup-passwordConfirm');

    var checkedInputs = {
      username: el.username,
      email: el.email,
      passwd1: password,
      passwd2: passwordConfirm,
      firstName: firstName,
      lastName: lastName,
      occupation: occupation,
      city: city,
      birthDate: birthDate,
      country: country,
      address: el.address,
      interests: el.interests,
      about: el.about
    };

    ValidChecker.init(checkedInputs);
    SignUpLocation.init();
    SignUpFace.init();
    stateData.oldEmail = el.email.value;
    el.email.disabled = false;
  }

  return {
    init: init
  };
}());