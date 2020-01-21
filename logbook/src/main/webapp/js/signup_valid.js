'use strict';

var ValidChecker = (function() {
  var data = {
    checkedInputs: []
  };

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
    var signupMsg = document.getElementById('sign-process-msg');

    data.checkedInputs = [];

        /* collect all elements --------------------------------------- */
    data.checkedInputs.push(username, passwd1, passwd2, email, firstName, lastName, birthDate,
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
  }

  /* checks if an element has a valid value and modifies its isValid attribute */
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

  /* displays an invalid message next to the element label */
  function showInvalidMsg(element, value) {
    if (!element.parentNode.children[0].children[1]) {
      var msg = document.createElement('div');
      msg.innerHTML = value;
      msg.className = 'invalid-value';

      element.parentNode.children[0].appendChild(msg);
    }
  }

  function checkInvalidElements() {
    for (var j = 0; j < data.checkedInputs.length; j++) {
      checkValid(data.checkedInputs[j]);
      if (!data.checkedInputs[j].isValid) {
        showInvalidMsg(data.checkedInputs[j], data.checkedInputs[j].invalidMsg);
        return data.checkedInputs[j].scrollElem;
      }
    }
  }

  function getCheckedInputs() {
    return data.checkedInputs;
  }

  return {
    init: init,
    checkInvalidElements: checkInvalidElements,
    showInvalidMsg: showInvalidMsg,
    getCheckedInputs: getCheckedInputs
  };

}());