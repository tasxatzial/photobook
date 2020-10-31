'use strict';

/**
 * Functions that check if the provided account information is valid based on specific patterns and requirements.
 * This happens either during the signup process or when we are editing the user account info.
 *
 * @type {{init: init, showInvalidMsg: showInvalidMsg, getCheckedInputs: (function(): []|*[]), checkInvalidElements: checkInvalidElements}}
 */
var ValidChecker = (function() {
  var data = {
    checkedInputsStep1: [],
    checkedInputsStep2: [],
    checkedInputsStep3: [],
    checkedInputsStep4: [],
    checkedInputs: []
  };

  /**
   * Initializations after the signup form has loaded.
   */
  function init() {
    var username = document.getElementById('signup-username');
    var email = document.getElementById('signup-email');
    var passwd1 = document.getElementById('signup-password');
    var passwd2 = document.getElementById('signup-passwordConfirm');
    var firstName = document.getElementById('signup-firstName');
    var lastName = document.getElementById('signup-lastName');
    var occupation = document.getElementById('signup-job');
    var city = document.getElementById('signup-city');
    var birthDate = document.getElementById('signup-birthDate');
    var country = document.getElementById('signup-country');
    var interests = document.querySelector('textarea[name="signup-interests"]');
    var about = document.querySelector('textarea[name="signup-about"]');
    var signupMsg = document.getElementById('signup-process-msg');

    data.checkedInputsStep1 = [];
    data.checkedInputsStep2 = [];
    data.checkedInputsStep3 = [];
    data.checkedInputsStep4 = [];
    data.checkedInputs = [];

    /* collect all elements that require checking --------------------------------------- */
    data.checkedInputsStep1.push(username, passwd1, passwd2, email);
    data.checkedInputsStep2.push(firstName, lastName, birthDate, occupation);
    data.checkedInputsStep3.push(country, city);
    data.checkedInputsStep4.push(interests, about);
    for (var i = 0; i < data.checkedInputsStep1.length; i++) {
      data.checkedInputs.push(data.checkedInputsStep1[i]);
    }
    for (i = 0; i < data.checkedInputsStep2.length; i++) {
      data.checkedInputs.push(data.checkedInputsStep2[i]);
    }
    for (i = 0; i < data.checkedInputsStep3.length; i++) {
      data.checkedInputs.push(data.checkedInputsStep3[i]);
    }
    for (i = 0; i < data.checkedInputsStep4.length; i++) {
      data.checkedInputs.push(data.checkedInputsStep4[i]);
    }

    /* checks for valid regex pattern */
    function regexValid(element) {
      element.valid = function () {
        var regex = new RegExp(element.pattern);
        return regex.test(element.value) && element.value;
      };
    }

    /* define the check function for each one of the checked inputs ---------------------------- */
    regexValid(username);
    regexValid(email);
    regexValid(passwd1);
    regexValid(firstName);
    regexValid(lastName);
    regexValid(occupation);
    regexValid(city);

    passwd2.valid = function () {
      return passwd1.value === passwd2.value;
    };

    birthDate.valid = function () {
      return birthDate.value !== '';
    };

    country.valid = function () {
      return country.value !== '';
    };

    interests.valid = function () {
      return interests.value.length <= 100;
    };

    about.valid = function () {
      return about.value.length <= 500;
    };

    /* add listeners ----------------------------------------------- */
    addValidPatternListeners(username);
    addValidPatternListeners(email);
    addValidPatternListeners(passwd1);
    addPasswdConfirmListeners();
    addValidPatternListeners(firstName);
    addValidPatternListeners(lastName);
    addValidPatternListeners(occupation);
    addValidPatternListeners(city);
    addValidPatternListeners(birthDate);
    addValidPatternListeners(country);
    addValidPatternListeners(interests);
    addValidPatternListeners(about);

    /* listeners for all elements except passw2 */
    function addValidPatternListeners(element) {
      element.checkedValid = 0;
      element.invalidMsg = 'Invalid';
      element.scrollElem = element;
      element.addEventListener('input', function () {
        signupMsg.innerHTML = '';
        element.checkedValid = 0;
        for (var child = element.parentNode.children[0].firstChild; child !== null; child = child.nextSibling) {
          if (child.className === 'invalid-value') {
            element.parentNode.children[0].removeChild(child);
          }
        }
      });
      element.addEventListener('focusout', function () {
        if (!element.checkedValid) {
          checkValid(element);
          if (element.value && !element.isValid) {
            showInvalidMsg(element, element.invalidMsg);
          }
        }
      });
    }

    /* listeners for passwd1 and passwd2 */
    function addPasswdConfirmListeners() {
      passwd1.addEventListener('input', clearMismatchMsg);
      passwd1.addEventListener('focusout', checkMismatch);

      passwd2.checkedValid = 0;
      passwd2.scrollElem = passwd1;
      passwd2.invalidMsg = 'Mismatch';
      passwd2.addEventListener('input', clearMismatchMsg);
      passwd2.addEventListener('focusout', checkMismatch);

      function checkMismatch() {
        if (!passwd1.checkedValid || !passwd2.checkedValid) {
          checkValid(passwd2);
          if (passwd1.value && passwd2.value && passwd1.isValid && !passwd2.isValid) {
            showInvalidMsg(passwd2, passwd2.invalidMsg);
          }
        }
      }
      function clearMismatchMsg() {
        signupMsg.innerHTML = '';
        passwd2.checkedValid = 0;
        if (passwd2.parentNode.children[0].children[1]) {
          passwd2.parentNode.children[0].removeChild(passwd2.parentNode.children[0].children[1]);
        }
      }
    }
  }

  /**
   * Checks if an input field has a valid value and modifies its isValid attribute.
   * @param element
   */
  function checkValid(element) {
    if (!element.checkedValid) {
      element.checkedValid = 1;
      if (element.valid()) {
        element.isValid = 1;
      }
      else {
        element.isValid = 0;
      }
    }
  }

  /**
   * Shows the specified text (an invalid input message) next to the label of the specified element.
   * @param element
   * @param text
   */
  function showInvalidMsg(element, text) {
    for(var child = element.parentNode.children[0].firstChild; child !== null; child = child.nextSibling) {
      if (child.className === 'invalid-value') {
        return;
      }
    }
    var msg = document.createElement('div');
    msg.innerHTML = text;
    msg.className = 'invalid-value';

    element.parentNode.children[0].appendChild(msg);
  }

  /**
   * Checks whether there are any invalid input fields. Returns the element that we need to scroll to so that
   * the user sees an invalid message notification.
   * @returns {HTMLElement}
   */
  function checkInvalidElements(array) {
    for (var j = 0; j < array.length; j++) {
      checkValid(array[j]);
      if (!array[j].isValid) {
        showInvalidMsg(array[j], array[j].invalidMsg);
        return array[j].scrollElem;
      }
    }
  }

  /**
   * Returns the array of the input fields that require checking.
   * @returns {[]|*[]}
   */
  function getCheckedInputsStep1() {
    return data.checkedInputsStep1;
  }
  function getCheckedInputsStep2() {
    return data.checkedInputsStep2;
  }
  function getCheckedInputsStep3() {
    return data.checkedInputsStep3;
  }
  function getCheckedInputsStep4() {
    return data.checkedInputsStep4;
  }
  function getCheckedInputs() {
    return data.checkedInputs;
  }

  return {
    init: init,
    checkInvalidElements: checkInvalidElements,
    showInvalidMsg: showInvalidMsg,
    getCheckedInputsStep1: getCheckedInputsStep1,
    getCheckedInputsStep2: getCheckedInputsStep2,
    getCheckedInputsStep3: getCheckedInputsStep3,
    getCheckedInputsStep4: getCheckedInputsStep4,
    getCheckedInputs: getCheckedInputs
  };
}());