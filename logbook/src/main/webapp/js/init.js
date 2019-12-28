'use strict';

var Init = (function() {
  var state = {
    xhr: null
  };

  var dataNames = [
    ["username", "Username"],
    ["password", "Password"],
    ["passwordConfirm", "Confirm Password"],
    ["email", "Email"],
    ["firstName", "First name"],
    ["lastName", "Last name"],
    ["birthDate", "Birth date"],
    ["gender", "Gender"],
    ["job", "Occupation"],
    ["country", "Country"],
    ["city", "City"],
    ["address", "Address"],
    ["interests", "Interests"],
    ["about", "General Info"]
  ];

  var navbarContent = document.getElementById('navbar-content');
  var nonav = document.getElementById('no-nav');

  var data = new FormData();
  data.append("action", "GetLanding");
  state.xhr = ajaxRequest('POST', 'Main', data, successCallback, failCallback);

  function successCallback() {
    nonav.innerHTML = state.xhr.responseText;
    var id = document.getElementById('landing-section');
    if (id) {
      Landing.init();
    }
    else {
      homepage();
    }
  }

  function failCallback() {
    console.log(state.xhr.responseText);
  }

  return {
    dataNames: dataNames,
    nonav: nonav,
    navbarContent: navbarContent
  };
}());