'user strict';

var ShowProfile = (function() {
  var state = {
    xhr: null,
    xhrResponse: null
  };

  function init(username) {
    var nonav = document.getElementById('no-nav');
    state.xhrResponse = null;

    var data = new FormData();
    data.append("action", "GetProfile");
    data.append("username", username);
    state.xhr = ajaxRequest("POST", "Main", data, successCallback, failCallback);

    function successCallback() {
      state.xhrResponse = JSON.parse(state.xhr.responseText);
      var profileSection = newElements.createProfile(state.xhrResponse, Init.dataNames);
      nonav.innerHTML = '';
      nonav.appendChild(profileSection);
    }

    function failCallback() {
      console.log(state.xhr.responseText);
    }
  }

  return {
    init: init
  };
}());