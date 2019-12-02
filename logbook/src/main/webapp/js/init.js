(function() {
  var state = {
    xhr: null
  };

  var data = new FormData();
  data.append("action", "GetLanding");
  state.xhr = ajaxRequest('POST', 'Main', data, successCallback, failCallback);

  function successCallback() {
    document.getElementById('no-nav').innerHTML = state.xhr.responseText;
    var id = document.getElementById('landing-section');
    if (id) {
      Landing.init();
    }
    else {

    }
  }

  function failCallback() {
    console.log(state.xhr.responseText);
  }
}());