'use strict';

var Init = (function() {
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
  data.append("action", "Init");
  var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, failCallback));

  function successCallback() {
    var response = JSON.parse(Requests.get(ID).responseText);
    if (response.LANDING) {
      Landing.init();
    }
    else {
      Homepage.init();
    }
  }

  function failCallback() {
    console.log(Requests.get(ID).responseText);
  }

  return {
    dataNames: dataNames,
    nonav: nonav,
    navbarContent: navbarContent
  };
}());