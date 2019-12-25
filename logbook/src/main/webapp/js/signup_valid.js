'use strict';

var ValidChecker = (function() {

  var state = {
    checkedInputs: [],
    oldEmail: null
  };

  function init(action) {
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
    var signupMsg = document.getElementById('signupin-msg');
    var signupButton = document.querySelector('#signup-button input');

    state.checkedInputs = [];
    state.oldEmail = email.value;

        /* collect all elements --------------------------------------- */
    state.checkedInputs.push(username, passwd1, passwd2, email, firstName, lastName, birthDate,
        occupation, city, country, interests, about);

    /* valid regex check functions --------------------------------- */
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

    function regexValid(element) {
      element.valid = function () {
        var regex = new RegExp(element.pattern);
        return regex.test(element.value) && element.value;
      };
    }

    /* add listeners ----------------------------------------------- */
    addUsernameEmailListeners(username);
    addUsernameEmailListeners(email);
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

    /* regex validation listeners for all elements besides username, email, passwordConfirm */
    function addValidPatternListeners(element) {
      element.checkedValid = 0;
      element.invalidMsg = 'Invalid';
      element.scrollElem = element;
      element.oldValue = element.value;
      element.addEventListener('input', function (x) {
        return function () {
          signupMsg.innerHTML = '';
          x.checkedValid = 0;
          if (x.parentNode.children[0].children[1]) {
            x.parentNode.children[0].removeChild(x.parentNode.children[0].children[1]);
          }
        };
      }(element));
      element.addEventListener('focusout', function (x) {
        return function () {
          if (x.checkedValid) {
            return;
          }
          checkValid(x);
          if (x.value && !x.isValid) {
            showInvalidMsg(x, x.invalidMsg);
          }
        };
      }(element));
    }

    /* same value listeners for password and passwordConfirm */
    function addPasswdConfirmListeners() {
      passwd1.addEventListener('input', clearMismatchMsg);
      passwd1.addEventListener('focusout', checkMismatch);

      passwd2.checkedValid = 0;
      passwd2.scrollElem = passwd1;
      passwd2.invalidMsg = 'Mismatch';
      passwd2.addEventListener('input', clearMismatchMsg);
      passwd2.addEventListener('focusout', checkMismatch);

      function checkMismatch() {
        if (passwd1.checkedValid && passwd2.checkedValid) {
          return;
        }
        checkValid(passwd2);
        if (passwd1.value && passwd2.value && passwd1.isValid && !passwd2.isValid) {
          showInvalidMsg(passwd2, passwd2.invalidMsg);
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

    /* username and email check listeners (includes both regex checks and db checks */
    function addUsernameEmailListeners(element) {
      element.checkedValid = 0;
      element.isTaken = -1;
      element.invalidMsg = 'Invalid';
      element.scrollElem = element;
      element.addEventListener('input', function (x) {
        return function () {
          signupMsg.innerHTML = '';
          x.checkedValid = 0;
          x.isTaken = -1;
          if (x.parentNode.children[0].children[1]) {
            x.parentNode.children[0].removeChild(x.parentNode.children[0].children[1]);
          }
        };
      }(element));
      element.addEventListener('focusout', function(x) {
        return function() {
          if (x.checkedValid) {
            return;
          }
          checkValid(x);
          if (!x.value) {
            return;
          }
          if (!x.isValid) {
            showInvalidMsg(x, x.invalidMsg);
            return;
          }
          if (x.name === 'signup-username') {
            formSubmit.disable(signupButton);
            checkTaken(username, 'CheckUsernameDB', 'username', x.value, successCallback, failCallback);
          }
          if (x.name === 'signup-email' && (action !== 'AccountInfo' || state.oldEmail !== x.value)) {
            formSubmit.disable(signupButton);
            checkTaken(email, 'CheckEmailDB', 'email', x.value, successCallback, failCallback);
          }

          function successCallback() {
            formSubmit.enable(signupButton);
          }
          function failCallback() {
            formSubmit.enable(signupButton);
            showInvalidMsg(x, 'Error checking');
          }
        };
      }(element));
    }

    /* checks that username/email do not exist on database */
    function checkTaken(element, action, parameter, value, successFunc, failFunc) {
      var state = {
        xhr: null
      };

      var data = new FormData();
      data.append('action', action);
      data.append('parameter', parameter);
      data.append('parameterValue', value);
      data.append(element.name.split('-')[1], element.value);
      state.xhr = ajaxRequest('POST', 'Main', data, successCallback, failFunc);

      function successCallback() {
        var response = JSON.parse(state.xhr.responseText);
        if (response[element.name.split('-')[1]] === '0') {
          element.isTaken = 1;
          showInvalidMsg(element, 'Already taken');
        }
        else {
          element.isTaken = 0;
        }
        successFunc();
      }
    }

  }

  /* checks if an element has a valid value (db checks are excluded) and modifies its isValid attribute */
  function checkValid(element) {
    if (element.checkedValid) {
      return;
    }
    element.checkedValid = 1;
    if (element.valid()) {
      element.isValid = 1;
    }
    else {
      element.isValid = 0;
    }
  }

  /* scrolls to an element */
  function scrollToParent(element) {
    if (window.scrollY) {
      var html = document.getElementsByTagName('html')[0];
      var fontSize = parseFloat(getComputedStyle(html).getPropertyValue('font-size'));
      window.scroll(0, element.parentNode.offsetTop - 2.8 * fontSize);
    }
  }

  /* displays an invalid message next to the element label */
  function showInvalidMsg(element, value) {
    if (!element.parentNode.children[0].children[1]) {
      var label = element.parentNode.children[0];
      var msg = newElements.createInvalidValueMsg(value);
      label.appendChild(msg);
    }
  }

  function getCheckedInputs() {
    return state.checkedInputs;
  }

  return {
    init: init,
    getCheckedInputs: getCheckedInputs,
    checkValid: checkValid,
    showInvalidMsg: showInvalidMsg,
    scrollToParent: scrollToParent
  };

}());