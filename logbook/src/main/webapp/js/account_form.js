'use strict';

var AccountInfo = (function() {
  var el = {
    confirmDelete: null,
    deleteAccountMsg: null
  };

  function init() {
    el.confirmDelete = null;

    var accountSubsection = document.getElementById('account-subsection');
    var editAccountSection = createEditAccountSection();
    accountSubsection.innerHTML = '';
    accountSubsection.appendChild(editAccountSection);

    var editAccountButton = document.querySelector('#edit-account-button input');
    editAccountButton.addEventListener('click', function() {
      Signup.init('AccountInfo');
    });

    var deleteAccountButton = document.querySelector('#delete-account-button input');
    deleteAccountButton.addEventListener('click', confirmDelete);

    el.deleteAccountMsg = document.getElementById('delete-account-msg');
  }

  function deleteAccount() {
    Requests.cancelAll();

    el.confirmDelete = null;

    var formData = new FormData();
    formData.append("action", "DeleteAccount");

    var loader = newElements.createLoader('images/loader.gif');
    formMsg.showElement(el.deleteAccountMsg, loader);

    var ID = Requests.add(ajaxRequest("POST", "Main", formData, successCallback, failCallback));

    function successCallback() {
      if (JSON.parse(Requests.get(ID).responseText).ERROR) {
        Logout.showExpired();
        return;
      }
      Logout.init();
    }

    function failCallback() {
      formMsg.showError(el.deleteAccountMsg, 'Error');
      console.log(Requests.get(ID).responseText);
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

  function createEditAccountSection() {
    var editAccount = newElements.createBlueButton('Edit Account', 'edit-account-button');
    var deleteAccount = newElements.createBlueButton('Delete Account', 'delete-account-button');
    var deleteAccountMsg = document.createElement('div');
    deleteAccountMsg.id = 'delete-account-msg';
    deleteAccount.appendChild(deleteAccountMsg);

    var div = document.createElement('div');
    div.id = 'edit-account-parent';
    div.className = 'parent-in-myaccount';

    div.appendChild(editAccount);
    div.appendChild(deleteAccount);

    var section = document.createElement('div');
    section.id = 'edit-account-section';
    section.appendChild(div);

    return section;
  }

  return {
    init: init
  };
}());