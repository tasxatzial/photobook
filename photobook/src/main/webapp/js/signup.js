'use strict';

/**
 * Functions related to the signup process and the edit account info process.
 * These do not include the loading of the signup form (loaded in landing.js/account_form.js)
 * @type {{init: init}}
 */
var Signup = (function() {
  var el = null;

  function runInit() {
    el = {
      signupSection: null,
      signupParent: null,
      signupContent: null,
      signupButton: null,
      header: null,
      username: null,
      email: null,
      password: null,
      passwordConfirm: null,
      address: null,
      gender: null,
      interests: null,
      about: null,
      geolocSearchButton: null,
      nominatimSearchButton: null,
      step1Content: null,
      step1ButtonContainer: null,
      step1NextButton: null,
      step2Content: null,
      step4BackButton: null,
      faceAssosiate: null
    };
  }

  /**
   * The first function that is called when the next button in step1 is clicked.
   */
  function gotoStep2() {
    var invalidElement = ValidChecker.checkInvalidElements(ValidChecker.getCheckedInputsStep1());
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
      } else if (name === 'password' || name === 'passwordConfirm') {
        data.append(name, CryptoJS.MD5('hy359' + inputs[i].value + '!”£$').toString());
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
   * Enables all form inputs in step4.
   */
  function enableInputsStep4() {
    formInput.enable(el.interests);
    formInput.enable(el.about);
    formSubmit.enable(el.signupButton);
    el.step4BackButton.disabled = false;
  }

  /**
   * Disables all form inputs in step4.
   */
  function disableInputsStep4() {
    formInput.disable(el.interests);
    formInput.disable(el.about);
    formSubmit.disable(el.signupButton);
    el.step4BackButton.disabled = true;
  }

  /**
   * Enables all form inputs in step1.
   */
  function enableInputsStep1() {
    formInput.enable(el.username);
    formInput.enable(el.email);
    formInput.enable(el.password);
    formInput.enable(el.passwordConfirm);
    formSubmit.enable(el.step1NextButton);
    el.faceAssosiate.disabled = false;
  }

  /**
   * Disables all form inputs in step4.
   */
  function disableInputsStep1() {
    formInput.disable(el.username);
    formInput.disable(el.email);
    formInput.disable(el.password);
    formInput.disable(el.passwordConfirm);
    formSubmit.disable(el.step1NextButton);
    el.faceAssosiate.disabled = true;
  }

  /**
   * Performs signup
   */
  function doSignup() {
    Requests.cancelExcept(null);
    disableInputsStep4();
    var loader = newElements.createSlidingLoader();

    var data = gatherData();
    data.append('action', 'Signup');
    var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, failCallback));

    function successCallback() {
      Init.navbarContent.removeChild(loader);
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
      enableInputsStep4();
    }

    function failCallback() {
      Init.navbarContent.removeChild(loader);
      if (Requests.get(ID).status === 401) {
        Logout.showExpired();
        return;
      }
      if (Requests.get(ID).status === 500) {
        newElements.showFullWindowMsg('OK', 'Server error', Init.clearFullWindowMsg);
      }
      else if (Requests.get(ID).status === 0) {
        newElements.showFullWindowMsg('OK', 'Unable to send request', Init.clearFullWindowMsg);
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
      enableInputsStep4();
    }
  }

  /**
   * Checks whether the username and email are taken by other user.
   */
  function checkUsernameEmailDB() {
    Requests.cancelExcept(null);
    var loader = newElements.createSlidingLoader();
    disableInputsStep1();

    var formData = new FormData();
    formData.append('action', 'CheckUsernameEmailDB');
    formData.append('username', el.username.value.toLowerCase());
    formData.append('email', el.email.value.toLowerCase());

    var ID = Requests.add(ajaxRequest('POST', 'Main', formData, successCallback, failCallback));

    function successCallback() {
      Init.navbarContent.removeChild(loader);
      var response = JSON.parse(Requests.get(ID).responseText);
      if (response.username === 'unused' && response.email === 'unused') {
        el.signupContent.removeChild(el.step1Content);
        el.signupContent.appendChild(el.step2Content);
        el.step2BackButton.style.top = computeTop(el.step2BackButton);
      }
      else {
        if (response.username !== 'unused') {
          ValidChecker.showInvalidMsg(el.username, response.username);
        }
        if (response.email !== 'unused') {
          ValidChecker.showInvalidMsg(el.email, response.email);
        }
        if (response.username !== 'unused') {
          Init.scrollTo(el.username.parentNode);
        }
        else if (response.email !== 'unused') {
          Init.scrollTo(el.email.parentNode);
        }
      }
      enableInputsStep1();
    }

    function failCallback() {
      Init.navbarContent.removeChild(loader);
      enableInputsStep1();
      var error = null;
      if (Requests.get(ID).status === 0) {
        error = 'Unable to send request';
      }
      else if (Requests.get(ID).status === 500) {
        error = "Server error";
      }
      else {
        error = 'Error';
      }
      newElements.showFullWindowMsg('OK', error, Init.clearFullWindowMsg);
    }
  }

  /**
   * Initializations after the signup form has loaded.
   */
  function init() {
    el.username = document.getElementById('signup-username');
    el.email = document.getElementById('signup-email');
    el.password = document.getElementById('signup-password');
    el.passwordConfirm = document.getElementById('signup-passwordConfirm');
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
    el.signupButtonContainer = document.querySelector('#signup-button');
    el.signupButton = el.signupButtonContainer.children[1];
    el.step1Content = el.signupContent.children[0];
    el.step2Content = el.signupContent.children[1];
    el.step3Content = el.signupContent.children[2];
    el.step4Content = el.signupContent.children[3];
    el.step1ButtonContainer = document.getElementById('signup-step1-button-container');
    el.step2ButtonContainer = document.getElementById('signup-step2-button-container');
    el.step3ButtonContainer = document.getElementById('signup-step3-button-container');
    el.step1NextButton = el.step1ButtonContainer.children[0];
    el.step2NextButton = el.step2ButtonContainer.children[1];
    el.step3NextButton = el.step3ButtonContainer.children[1];
    el.step2BackButton = el.step2ButtonContainer.children[0];
    el.step3BackButton = el.step3ButtonContainer.children[0];
    el.step4BackButton = el.signupButtonContainer.children[0];
    el.faceAssosiate = document.querySelector("input[type=checkbox]");
    el.signupButton.classList.add('right-button');

    el.step1NextButton.addEventListener('click', function() {
      this.blur();
      gotoStep2();
    });
    el.step2NextButton.addEventListener('click', function() {
      this.blur();
      var invalidEvent = ValidChecker.checkInvalidElements(ValidChecker.getCheckedInputsStep2());
      if (invalidEvent) {
        Init.scrollTo(invalidEvent.parentNode);
      }
      else {
        el.signupContent.removeChild(el.step2Content);
        el.signupContent.appendChild(el.step3Content);
        el.step3BackButton.style.top = computeTop(el.step3BackButton);
      }
    });
    el.step3NextButton.addEventListener('click', function() {
      this.blur();
      var invalidEvent = ValidChecker.checkInvalidElements(ValidChecker.getCheckedInputsStep3());
      if (invalidEvent) {
        Init.scrollTo(invalidEvent.parentNode);
      }
      else {
        el.signupContent.removeChild(el.step3Content);
        el.signupContent.appendChild(el.step4Content);
        el.step4BackButton.style.top = computeTop(el.step4BackButton);
      }
    });
    el.signupButton.addEventListener('click', function() {
      this.blur();
      var invalidEvent = ValidChecker.checkInvalidElements(ValidChecker.getCheckedInputsStep4());
      if (invalidEvent) {
        Init.scrollTo(invalidEvent.parentNode);
      }
      else {
        doSignup();
      }
    });
    el.step2BackButton.addEventListener('click', function() {
      el.signupContent.removeChild(el.step2Content);
      el.signupContent.appendChild(el.step1Content);
    });
    el.step3BackButton.addEventListener('click', function() {
      el.signupContent.removeChild(el.step3Content);
      el.signupContent.appendChild(el.step2Content);
    });
    el.step4BackButton.addEventListener('click', function() {
      el.signupContent.removeChild(el.step4Content);
      el.signupContent.appendChild(el.step3Content);
    });
    el.step1NextButton.disabled = false;

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
    var country = document.getElementById('signup-country');

    var checkedInputs = {
      username: el.username,
      email: el.email,
      passwd1: el.password,
      passwd2: el.passwordConfirm,
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
    el.email.disabled = false;
    el.password.disabled = false;
    el.passwordConfirm.disabled = false;

    el.signupContent.removeChild(el.step2Content);
    el.signupContent.removeChild(el.step3Content);
    el.signupContent.removeChild(el.step4Content);
    el.step2Content.classList.remove('signup-hidden');
    el.step3Content.classList.remove('signup-hidden');
    el.step4Content.classList.remove('signup-hidden');
  }

  /* used to compute the top of the go back buttons */
  function computeTop(element) {
    var elementHeight = window.getComputedStyle(element).height;
    var elementHeightNum = elementHeight.substring(0, elementHeight.length - 2);
    var parentHeight = window.getComputedStyle(element.parentElement).height;
    var parentHeightNum = parentHeight.substring(0, parentHeight.length - 2);
    return 0.5 *(parentHeightNum - elementHeightNum) + 'px';
  }

  return {
    init: init,
    runInit: runInit
  };
}());