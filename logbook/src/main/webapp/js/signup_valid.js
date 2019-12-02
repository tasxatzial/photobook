'use strict';

var ValidChecker = (function() {

  function init() {
    var username = document.getElementById('signup-username');
    var email = document.getElementById('signup-email');
    var passwd1 = document.getElementById('signup-password');
    var passwd2 = document.getElementById('signup-password-confirm');
    var firstName = document.getElementById('signup-firstName');
    var lastName = document.getElementById('signup-lastName');
    var occupation = document.getElementById('signup-job');
    var city = document.getElementById('signup-city');
    var birthDate = document.getElementById('signup-birthDate');
    var country = document.getElementById('signup-country');
    var interests = document.querySelector('textarea[name="signup-interests"]');
    var about = document.querySelector('textarea[name="signup-about"]');
    var signupMsg = document.getElementById('signupin-msg');

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

    /* displays an invalid message next to the element label */
    function showInvalidMsg(element, value) {
      if (!element.parentNode.children[0].children[1]) {
        var label = element.parentNode.children[0];
        var msg = newElements.createInvalidValueMsg(value);
        label.appendChild(msg);
      }
    }

    /* add listeners ----------------------------------------------- */
    addValidPatternListeners(passwd1);
    addValidPatternListeners(firstName);
    addValidPatternListeners(lastName);
    addValidPatternListeners(occupation);
    addValidPatternListeners(city);
    addValidPatternListeners(birthDate);
    addValidPatternListeners(country);
    addValidPatternListeners(interests);
    addValidPatternListeners(about);

    /* regex validation listeners for all elements besides username, email, password-confirm */
    function addValidPatternListeners(element) {
      element.checkedValid = 0;
      element.invalidMsg = 'Invalid';
      element.scrollElem = element;
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
          checkValid(x);
          if (x.value && !x.isValid) {
            showInvalidMsg(x, x.invalidMsg);
          }
        };
      }(element));
    }

  }

  return {
    init: init
  };

}());