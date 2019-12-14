'use strict';

var EditAccount = (function() {
  var state = {
    xhr: null,
    xhrResponse: null
  };

  var el = {
    confirmDelete: null,
    deleteAccountMsg: null
  };

  function init() {
    el.confirmDelete = null;

    var accountSubsection = document.getElementById('account-subsection');
    var editAccountSection = newElements.createEditAccountSection();
    accountSubsection.innerHTML = '';
    accountSubsection.appendChild(editAccountSection);

    var editAccountButton = document.querySelector('#edit-account-button input');
    editAccountButton.addEventListener('click', editAccount);

    var deleteAccountButton = document.querySelector('#delete-account-button input');
    deleteAccountButton.addEventListener('click', confirmDelete);

    el.deleteAccountMsg = document.getElementById('delete-account-msg');
  }

  function editAccount() {
    state.xhrResponse = null;

    var data = new FormData();
    data.append("action", "AccountInfo");
    state.xhr = ajaxRequest("POST", "Main", data, successCallback, failCallback);

    function successCallback() {
      document.getElementById('account-subsection').innerHTML = state.xhr.responseText;
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

      var genderHidden = document.getElementById('gender-hidden');
      var gender = document.querySelectorAll('input[type="radio"]');
      for (var i = 0; i < gender.length; i++) {
        if (gender[i].value === genderHidden.innerHTML) {
          gender[i].checked = 'true';
        }
      }

      Signup.init('UpdateAccount');
    }

    function failCallback() {
      console.log(state.xhr.responseText);
    }
  }

  function deleteAccount() {
    var state = {
      xhr: null
    };

    el.confirmDelete = null;

    var formData = new FormData();
    formData.append("action", "DeleteAccount");

    var loader = newElements.createLoader('images/loader.gif');
    formMsg.showElement(el.deleteAccountMsg, loader);

    state.xhr = ajaxRequest("POST", "Main", formData, logout, failCallback);

    function failCallback() {
      formMsg.showError(el.deleteAccountMsg, 'Error');
      console.log(state.xhr.responseText);
    }
  }

  function confirmDelete() {
    if (!el.confirmDelete) {
      el.confirmDelete = newElements.createYesNoButtons('account-delete-confirm');
      formMsg.showElement(el.deleteAccountMsg, el.confirmDelete);
      document.getElementById('account-delete-confirm-yes-button').addEventListener('click', deleteAccount);
      document.getElementById('account-delete-confirm-no-button').addEventListener('click', function() {
        formMsg.clear(el.deleteAccountMsg);
        el.confirmDelete = null;
      });
    }
  }

  return {
    init: init
  };
}());