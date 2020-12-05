'use strict';

/**
 * Functions related to the account tab section.
 * @type {{init: init}}
 */
var AccountInfo = (function() {
  var el = {
    confirmDelete: null,
    deleteAccountDiv: null,
    editAccountDiv: null,
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
    var loader = newElements.createSlidingLoader();

    var data = new FormData();
    data.append("action", "AccountInfo");
    var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, failCallback));

    function successCallback() {
      Init.navbarContent.removeChild(loader);
      document.getElementById('account-subsection').innerHTML = Requests.get(ID).responseText;
      var signupParent = document.getElementById('signup-parent');
      signupParent.classList.remove('parent-in-main');
      signupParent.classList.add('parent-in-myaccount');
      EditAccount.init();
    }

    function failCallback() {
      Init.navbarContent.removeChild(loader);
      if (Requests.get(ID).status === 401) {
        Logout.showExpired();
        return;
      }

      var error = null;
      if (Requests.get(ID).status === 400) {
        var responseText = Requests.get(ID).responseText;
        if (!responseText) {
          error = 'Error';
        }
        else {
          if (JSON.parse(responseText).ERROR === 'INVALID_ACTION') {
            error = 'Invalid action';
          }
          else {
            error = 'Invalid user';
          }
        }
      }
      else if (Requests.get(ID).status === 500) {
        error = 'Server error';
      }
      else if (Requests.get(ID).status === 0) {
        error = 'Unable to send request';
      }
      else {
        error = 'Error';
      }
      newElements.showFullWindowMsg('OK', error, Init.clearFullWindowMsg);
    }
  }

  /**
   * Deletes user account and calls the logout function.
   */
  function deleteAccount() {
    Requests.cancelExcept(null);

    var formData = new FormData();
    formData.append("action", "DeleteAccount");
    var ID = Requests.add(ajaxRequest("POST", "Main", formData, successCallback, failCallback));

    function successCallback() {
      Logout.init();
    }

    function failCallback() {
      var confirmDelete = document.getElementById('full-screen');
      document.getElementsByTagName('body')[0].removeChild(confirmDelete);
      var error = null;
      if (Requests.get(ID).status === 401) {
        error = 'Session has expired';
      }
      else if (Requests.get(ID).status === 0) {
        error = 'Unable to send request';
      }
      else if (Requests.get(ID).status === 500) {
        var response = JSON.parse(Requests.get(ID).responseText);
        if (response.ERROR === 'DELETE_POSTS') {
          error = 'Server error: Delete posts';
        }
        else if (response.ERROR === 'DELETE_ACCOUNT') {
          error = 'Server error: Delete account';
        }
        else if (response.ERROR === 'DELETE_POST_RATINGS') {
          error = 'Server error: Delete ratings';
        }
        else {
          error = 'Server error';
        }
      }
      else {
        error = 'Error';
      }
      newElements.showFullWindowMsg('OK', error, Init.clearFullWindowMsg);
    }
  }

  /**
   * Creates the initial elements in the account section.
   * @returns {HTMLDivElement}
   */
  function createEditAccountSection() {
    el.editAccountDiv = newElements.createBlueButton('Edit Account', 'edit-account-button');
    el.editAccountDiv.children[0].addEventListener('click', editAccount);

    el.deleteAccountDiv = newElements.createBlueButton('Delete Account', 'delete-account-button');
    el.deleteAccountDiv.children[0].addEventListener('click', function() {
      var self = this;
      self.disabled = true;
      setTimeout(function() {
        newElements.showConfirmDelete('Your account & posts will be deleted!', 'account-delete-confirm', deleteAccount);
        self.disabled = false;
      }, 200);
    });

    var div = document.createElement('div');
    div.id = 'edit-account-parent';
    div.className = 'parent-in-myaccount';

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