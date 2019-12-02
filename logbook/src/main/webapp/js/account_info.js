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

    }

    function failCallback() {
      
    }
  }

  return {
    init: init
  };
}());