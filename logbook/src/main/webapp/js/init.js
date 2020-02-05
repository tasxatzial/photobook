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

  var postNames = [
    ["description", "Description"],
    ["latitude", "Latitude"],
    ["longitude", "Longitude"],
    ["resourceURL", "Online URL"],
    ["imageURL", "Online image"],
    ["imageBase64", "Disk image"]
  ];

  var navbarContent = document.getElementById('navbar-content');
  var nonav = document.getElementById('no-nav');
  var loader = newElements.createLoader('images/loader.gif');

  var user = null;

  var data = new FormData();
  data.append("action", "Init");
  var ID = Requests.add(ajaxRequest('POST', 'Main', data, successCallback, failCallback));

  function successCallback() {
    var response = JSON.parse(Requests.get(ID).responseText);
    if (response.LANDING) {
      Landing.init();
    }
    else {
      user = response.USER;
      Homepage.init();
    }
  }

  function failCallback() {
    console.log(Requests.get(ID).responseText);
  }

  function setUser(username) {
    user = username;
  }

  function getUser() {
    return user;
  }

  /* scrolls to an element */
  function scrollTo(element) {
    if (window.scrollY) {
      var nonavMargin = parseFloat(getComputedStyle(Init.nonav).getPropertyValue('margin-top'));
      window.scroll(0, element.offsetTop - nonavMargin);
    }
  }

  function clearFullWindowMsg() {
    var body = document.getElementsByTagName('body')[0];
    body.removeAttribute('id');

    var msg = document.getElementById('full-screen');
    if (msg) {
      body.removeChild(msg);
    }
  }

  function fourDecimal(string) {
    var num = 0.0001 * Math.round(parseFloat(string) * 10000);
    if (num > 99.9999) {
      if (num < 100) {
        num = 100;
      }
      return (num.toString()).substring(0, 8);
    }
    else if (num > -0.0001) {
      if (num < 0) {
        num = 0;
      }
      return (num.toString()).substring(0, 7);
    }
    else if (num > -100.0001) {
      if (num < -100) {
        num = -100;
      }
      return (num.toString()).substring(0, 8);
    }
    else {
      return (num.toString()).substring(0, 9);
    }
  }

  return {
    dataNames: dataNames,
    postNames: postNames,
    nonav: nonav,
    navbarContent: navbarContent,
    getUser: getUser,
    setUser: setUser,
    loader: loader,
    scrollTo: scrollTo,
    clearFullWindowMsg: clearFullWindowMsg,
    fourDecimal: fourDecimal
  };
}());