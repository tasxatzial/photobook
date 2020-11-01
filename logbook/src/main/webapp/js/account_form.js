'use strict';

/**
 * Functions related to the account tab section.
 * @type {{init: init}}
 */
var AccountInfo = (function() {
  var el = {
    confirmDelete: null,
    deleteAccountMsg: null,
    deleteAccountDiv: null,
    editAccountDiv: null,
    showEditAccountMsg: null,
  };

  /**
   * Initializes the view when the user account tab is clicked.
   */
  function init() {
    var accountSubsection = document.getElementById('account-subsection');
    accountSubsection.innerHTML = '';
    accountSubsection.appendChild(createEditAccountSection());
  }

  /**
   * Loads the signup form already filled in with user account details.
   */
  function editAccount() {
    Requests.cancelExcept(null);
    el.deleteAccountDiv.parentElement.removeChild(el.deleteAccountDiv);
    el.editAccountDiv.parentElement.removeChild(el.editAccountDiv);
    formMsg.showElement(el.showEditAccountMsg, Init.loader);

    var data = new FormData();
    data.append("action", "AccountInfo");
    var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, failCallback));

    function successCallback() {
      document.getElementById('account-subsection').innerHTML = Requests.get(ID).responseText;
      var signupParent = document.getElementById('signup-parent');
      signupParent.classList.remove('parent-in-main');
      signupParent.classList.add('parent-in-myaccount');
      EditAccount.init();
    }

    function failCallback() {
      if (Requests.get(ID).status === 401) {
        Logout.showExpired();
        return;
      }
      formMsg.clear(el.showEditAccountMsg);

      var error = null;
      if (Requests.get(ID).status === 400) {
        var responseText = Requests.get(ID).responseText;
        if (!responseText) {
          error = newElements.createKeyValue('Error', 'Unknown');
        }
        else {
          if (JSON.parse(responseText).ERROR === 'INVALID_ACTION') {
            error = newElements.createKeyValue('Error', 'Invalid action');
          }
          else {
            error = newElements.createKeyValue('Error', 'Invalid user');
          }
        }
      }
      else if (Requests.get(ID).status === 500) {
        error = newElements.createKeyValue('Error', 'Server error');
      }
      else if (Requests.get(ID).status === 0) {
        error = newElements.createKeyValue('Error', 'Unable to send request');
      }
      else {
        error = newElements.createKeyValue('Error', 'Unknown');
      }
      var editAccountParent = document.getElementById('edit-account-parent');
      editAccountParent.appendChild(error);
    }
  }

  /**
   * Deletes user account and calls the logout function.
   */
  function deleteAccount() {
    Requests.cancelExcept(null);
    formMsg.showElement(el.deleteAccountMsg, Init.loader);

    var formData = new FormData();
    formData.append("action", "DeleteAccount");
    var ID = Requests.add(ajaxRequest("POST", "Main", formData, successCallback, failCallback));

    function successCallback() {
      Logout.init();
    }

    function failCallback() {
      if (Requests.get(ID).status === 401) {
        formMsg.showError(el.deleteAccountMsg, 'Error: Session has expired');
      }
      else if (Requests.get(ID).status === 0) {
        formMsg.showError(el.deleteAccountMsg, 'Unable to send request');
      }
      else if (Requests.get(ID).status === 500) {
        var response = JSON.parse(Requests.get(ID).responseText);
        if (response.ERROR === 'DELETE_POSTS') {
          formMsg.showError(el.deleteAccountMsg, 'Server error: Delete posts');
        }
        else {
          formMsg.showError(el.deleteAccountMsg, 'Server error: Delete account');
        }
      }
      else {
        formMsg.showError(el.deleteAccountMsg, 'Error');
      }
      var button = newElements.createFullWindowButton('OK');
      button.addEventListener('click', Init.clearFullWindowMsg);
      el.confirmDelete.children[0].appendChild(button);
    }
  }

  /**
   * Shows yes/no confirmation buttons when the delete account button is clicked.
   */
  function showConfirmDelete() {
    var yesNoButtons = newElements.createYesNoButtons('account-delete-confirm');
    yesNoButtons.children[1].addEventListener('click', function () {
      el.confirmDelete.children[0].removeChild(yesNoButtons);
      el.deleteAccountMsg = document.createElement('p');
      el.confirmDelete.children[0].appendChild(el.deleteAccountMsg);
      deleteAccount();
    });
    yesNoButtons.children[2].addEventListener('click', Init.clearFullWindowMsg);

    el.confirmDelete = newElements.createFullWindow('Your account & posts will be deleted!');
    el.confirmDelete.children[0].appendChild(yesNoButtons);

    var body = document.getElementsByTagName('body')[0];
    body.id = 'full-body';
    document.getElementsByTagName('body')[0].appendChild(el.confirmDelete);
    Init.scrollTo(el.deleteAccountDiv);
  }

  /**
   * Creates the initial elements in the account section.
   * @returns {HTMLDivElement}
   */
  function createEditAccountSection() {
    el.editAccountDiv = newElements.createBlueButton('Edit Account', 'edit-account-button');
    el.editAccountDiv.children[0].addEventListener('click', editAccount);

    el.deleteAccountDiv = newElements.createBlueButton('Delete Account', 'delete-account-button');
    el.deleteAccountDiv.children[0].addEventListener('click', showConfirmDelete);

    el.showEditAccountMsg = document.createElement('div');
    el.showEditAccountMsg.id = 'show-edit-account-msg';
    el.showEditAccountMsg.className = 'sign-process-msg';

    var div = document.createElement('div');
    div.id = 'edit-account-parent';
    div.className = 'parent-in-myaccount';

    div.appendChild(el.showEditAccountMsg);
    div.appendChild(el.editAccountDiv);
    div.appendChild(el.deleteAccountDiv);

    var section = document.createElement('div');
    section.id = 'edit-account-section';
    section.appendChild(div);

    return section;
  }

  return {
    init: init
  };
}());