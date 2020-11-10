'use strict';

/**
 * Functions related to the signup process and the edit account info process.
 * These do not include the loading of the signup form (loaded in landing.js/account_form.js)
 * @type {{init: init}}
 */
var Signup = (function() {
  var el = {
    signupSection: null,
    signupParent: null,
    signupContent: null,
    signupButton: null,
    signupMsg: null,
    header: null,
    username: null,
    email: null,
    address: null,
    gender: null,
    interests: null,
    about: null,
    geolocSearchButton: null,
    nominatimSearchButton: null,
    step1Msg: null,
    step1Content: null,
    step1ButtonContainer: null,
    step1NextButton: null,
    step2Content: null,
    step4BackButton: null
  };

  /**
   * The first function that is called when the next button in step1 is clicked.
   */
  function gotoStep2() {
    formMsg.clear(el.signupMsg);
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
   * Enables all form inputs in the final step.
   */
  function enableInputs() {
    formInput.enable(el.interests);
    formInput.enable(el.about);
    formSubmit.enable(el.signupButton);
    el.step4BackButton.disabled = false;
  }

  /**
   * Disables all form inputs.
   */
  function disableInputs() {
    formInput.disable(el.interests);
    formInput.disable(el.about);
    formSubmit.disable(el.signupButton);
    el.step4BackButton.disabled = true;
  }

  /**
   * Performs signup
   */
  function doSignup() {
    Requests.cancelExcept(null);
    disableInputs();

    el.signupMsg.classList.add('msg-open');
    setTimeout(function() {
      formMsg.showElement(el.signupMsg, Init.loader);
    }, 150);

    var data = gatherData();
    data.append('action', 'Signup');
    var ID = Requests.add(ajaxRequest('POST', 'Main', data, function() {
      setTimeout(successCallback, 300);
    }, function() {
      setTimeout(failCallback, 300);
    }));

    function successCallback() {
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
    Requests.cancelExcept(null);

    /* disable both username and email fields during this process */
    formInput.disable(el.username);
    formInput.disable(el.email);

    /* also disable step1 next button */
    formSubmit.disable(el.step1NextButton);

    el.step1Msg.classList.add('msg-open');
    setTimeout(function() {
      formMsg.showElement(el.step1Msg, Init.loader);
    }, 150);

    var formData = new FormData();
    formData.append('action', 'CheckUsernameEmailDB');
    formData.append('username', el.username.value.toLowerCase());
    formData.append('email', el.email.value.toLowerCase());

    var ID = Requests.add(ajaxRequest('POST', 'Main', formData,
        function() {
      setTimeout(successCallback, 300);
        }, function() {
      setTimeout(failCallback, 300);
    }));

    function successCallback() {
      var response = JSON.parse(Requests.get(ID).responseText);
      formMsg.clear(el.step1Msg);
      if (response.username === 'unused' && response.email === 'unused') {
        el.step1Content.classList.add('signup-hidden');
        el.step2Content.classList.remove('signup-hidden');
        el.step1Msg.classList.remove('msg-open');
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
      formSubmit.enableNext(el.step1NextButton);
      formInput.enable(el.username);
      formInput.enable(el.email);
    }

    function failCallback() {
      formSubmit.enableNext(el.step1NextButton);
      formInput.enable(el.username);
      formInput.enable(el.email);
      if (Requests.get(ID).status === 0) {
        formMsg.showError(el.step1Msg, 'Unable to send request');
      }
      else {
        formMsg.showError(el.step1Msg, 'Error');
      }
      Init.scrollTo(el.step1ButtonContainer);
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
    el.step1Msg = document.getElementById('signup-step1-process-msg');
    el.signupButtonContainer = document.querySelector('#signup-button');
    el.signupButton = el.signupButtonContainer.children[1];
    el.step1Content = document.getElementById('signup-step1');
    el.step2Content = document.getElementById('signup-step2');
    el.step3Content = document.getElementById('signup-step3');
    el.step4Content = document.getElementById('signup-step4');
    el.step1ButtonContainer = document.getElementById('signup-step1-button-container');
    el.step2ButtonContainer = document.getElementById('signup-step2-button-container');
    el.step3ButtonContainer = document.getElementById('signup-step3-button-container');
    el.step1NextButton = el.step1ButtonContainer.children[0];
    el.step2NextButton = el.step2ButtonContainer.children[1];
    el.step3NextButton = el.step3ButtonContainer.children[1];
    el.step2BackButton = el.step2ButtonContainer.children[0];
    el.step3BackButton = el.step3ButtonContainer.children[0];
    el.step4BackButton = el.signupButtonContainer.children[0];

    el.signupButton.classList.add('right-button');

    el.step1NextButton.addEventListener('click', function() {
      gotoStep2();
    });
    el.step2NextButton.addEventListener('click', function() {
      var invalidEvent = ValidChecker.checkInvalidElements(ValidChecker.getCheckedInputsStep2());
      if (invalidEvent) {
        Init.scrollTo(invalidEvent.parentNode);
      }
      else {
        el.step2Content.classList.add('signup-hidden');
        el.step3Content.classList.remove('signup-hidden');
        el.step3BackButton.style.top = computeTop(el.step3BackButton);
      }
    });
    el.step3NextButton.addEventListener('click', function() {
      var invalidEvent = ValidChecker.checkInvalidElements(ValidChecker.getCheckedInputsStep3());
      if (invalidEvent) {
        Init.scrollTo(invalidEvent.parentNode);
      }
      else {
        el.step3Content.classList.add('signup-hidden');
        el.step4Content.classList.remove('signup-hidden');
        el.step4BackButton.style.top = computeTop(el.step4BackButton);
      }
    });
    el.signupButton.addEventListener('click', function() {
      doSignup();
    });
    el.step2BackButton.addEventListener('click', function() {
      el.step2Content.classList.add('signup-hidden');
      el.step1Content.classList.remove('signup-hidden');
    });
    el.step3BackButton.addEventListener('click', function() {
      el.step3Content.classList.add('signup-hidden');
      el.step2Content.classList.remove('signup-hidden');
    });
    el.step4BackButton.addEventListener('click', function() {
      el.signupMsg.classList.remove('msg-open');
      formMsg.clear(el.signupMsg);
      el.step4Content.classList.add('signup-hidden');
      el.step3Content.classList.remove('signup-hidden');
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

    ValidChecker.init();
    SignUpLocation.init();
    SignUpFace.init();
    el.email.disabled = false;
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
    init: init
  };
}());