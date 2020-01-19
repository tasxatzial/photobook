'use strict';

var AccountInfo = (function() {
  var el = {
    confirmDelete: null,
    deleteAccountMsg: null,
    deleteAccountButton: null
  };

  function init() {
    el.confirmDelete = null;
    var accountSubsection = document.getElementById('account-subsection');
    accountSubsection.innerHTML = '';
    accountSubsection.appendChild(createEditAccountSection());
  }

  function editAccount() {
    Requests.cancelExcept(null);

    var data = new FormData();
    data.append("action", "AccountInfo");
    var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, failCallback));

    function successCallback() {
      if (Requests.get(ID).getResponseHeader("content-type").split(';')[0] === 'application/json') {
        Logout.showExpired();
        return;
      }

      document.getElementById('account-subsection').innerHTML = Requests.get(ID).responseText;
      document.getElementById('signup-parent').className = 'parent-in-myaccount';

      Signup.init('AccountInfo');
    }

    function failCallback() {
      console.log(Requests.get(ID).responseText);
    }
  }

  function deleteAccount() {
    redButton.disable(el.deleteAccountButton);
    Requests.cancelExcept(null);
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
      redButton.enable(el.deleteAccountButton);
      formMsg.showError(el.deleteAccountMsg, 'Error');
      el.deleteAccountButton.scrollIntoView();
      console.log(Requests.get(ID).responseText);
    }
  }

  function confirmDelete() {
    if (!el.confirmDelete) {
      el.confirmDelete = newElements.createYesNoButtons('account-delete-confirm');
      el.confirmDelete.children[1].addEventListener('click', deleteAccount);
      el.confirmDelete.children[2].addEventListener('click', function() {
        formMsg.clear(el.deleteAccountMsg);
        el.confirmDelete = null;
      });
      formMsg.showElement(el.deleteAccountMsg, el.confirmDelete);
      el.deleteAccountButton.scrollIntoView();
    }
  }

  function createEditAccountSection() {
    var editAccountDiv = newElements.createBlueButton('Edit Account', 'edit-account-button');
    editAccountDiv.children[0].addEventListener('click', editAccount);

    var deleteAccountDiv = newElements.createBlueButton('Delete Account', 'delete-account-button');
    el.deleteAccountButton = deleteAccountDiv.children[0];
    el.deleteAccountButton.addEventListener('click', confirmDelete);

    el.deleteAccountMsg = document.createElement('div');
    el.deleteAccountMsg.id = 'delete-account-msg';
    deleteAccountDiv.appendChild(el.deleteAccountMsg);

    var div = document.createElement('div');
    div.id = 'edit-account-parent';
    div.className = 'parent-in-myaccount';

    div.appendChild(editAccountDiv);
    div.appendChild(deleteAccountDiv);

    var section = document.createElement('div');
    section.id = 'edit-account-section';
    section.appendChild(div);

    return section;
  }

  return {
    init: init
  };
}());