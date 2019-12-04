'use strict';

var ShowAccountInfo = (function() {
  var state = {
    xhr: null,
    xhrResponse: null
  };

  var el = {
    accountInfoButton: null
  };

  function init() {
    el.accountInfoButton = document.getElementById('my-account-button');

    el.accountInfoButton.disabled = true;
    state.xhrResponse = null;

    var data = new FormData();
    data.append("action", "AccountInfo");
    state.xhr = ajaxRequest("POST", "Main", data, successCallback, failCallback);

    function successCallback() {
      var nonav = document.getElementById('no-nav');
      nonav.innerHTML = state.xhr.responseText;
      nonav.style.height = 'auto';
      formInput.disable(document.getElementById('signup-username'));

      var countryHidden = document.getElementById('country-hidden');
      var country = document.getElementById('signup-country');
      country.children[0].selected = 'false';
      for (var j = 0; j < country.children.length; j++) {
        if (country.children[j].value === countryHidden.innerHTML) {
          country.children[j].selected = 'true';
          break;
        }
      }

      var genderHidden = document.getElementById('gender-hidden');
      var gender = document.querySelectorAll('input[type="radio"]');
      for (var i = 0; i < gender.length; i++) {
        if (gender[i].value === genderHidden.innerHTML) {
          gender[i].checked = 'true';
        }
      }
      el.accountInfoButton.disabled = false;
      Signup.init('UpdateAccount');
    }

    function failCallback() {
      el.accountInfoButton.disabled = false;
      console.log(state.xhr.responseText);
    }
  }

  return {
    init: init
  };
}());