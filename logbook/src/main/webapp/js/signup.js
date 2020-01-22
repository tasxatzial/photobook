'use strict';

var Signup = (function() {
  var data = {
    oldEmail: null
  };

  var el = {
    username: null,
    email: null,
    signupSection: null,
    header: null,
    signupContent: null,
    address: null,
    gender: null,
    signupButton: null,
    signupMsg: null,
    geolocSearchButton: null,
    nominatimSearchButton: null
  };

  function clickSignup(action) {
    formMsg.clear(el.signupMsg);
    var invalidElement = ValidChecker.checkInvalidElements();
    if (invalidElement) {
      scrollToParent(invalidElement);
    }
    else {
      checkUsernameEmailDB(action);
    }
  }

  function gatherData() {
    var data = new FormData();
    var inputs = ValidChecker.getCheckedInputs();
    for (var i = 0; i < inputs.length; i++) {
      data.append(inputs[i].name.split('-')[1], inputs[i].value);
    }

    for (var j = 0; j < el.gender.length; j++) {
      if (el.gender[j].checked) {
        data.append(el.gender[j].name.split('-')[1], el.gender[j].value);
      }
    }

    data.append(el.address.name.split('-')[1], el.address.value);
    return data;
  }

  function enableInputs(action) {
    var inputs = ValidChecker.getCheckedInputs();
    for (var i = 0; i < inputs.length; i++) {
      if (action === 'Signup' || inputs[i].name !== "signup-username") {
        formInput.enable(inputs[i]);
      }
    }
    formInput.enable(el.gender[0]);
    formInput.enable(el.gender[1]);
    formInput.enable(el.gender[2]);
    formInput.enable(el.address);
    formSubmit.enable(el.signupButton);
    formButton.enable(el.geolocSearchButton);
    formButton.enable(el.nominatimSearchButton);
  }

  function disableInputs() {
    var inputs = ValidChecker.getCheckedInputs();
    for (var i = 0; i < inputs.length; i++) {
      formInput.disable(inputs[i]);
    }
    formInput.disable(el.gender[0]);
    formInput.disable(el.gender[1]);
    formInput.disable(el.gender[2]);
    formInput.disable(el.address);
    formSubmit.disable(el.signupButton);
    formButton.disable(el.geolocSearchButton);
    formButton.disable(el.nominatimSearchButton);
  }

  function doSignup(action) {
    Requests.cancelExcept(null);
    disableInputs();
    var loader = newElements.createLoader("images/loader.gif");
    formMsg.showElement(el.signupMsg, loader);
    el.signupButton.scrollIntoView();

    var data = gatherData();
    data.append('action', action);
    var ID = Requests.add(ajaxRequest('POST', 'Main', data,
        function() {return successCallback(action);},
        function() {return failCallback(action);}
    ));

    function successCallback(action) {
      if (action === 'Signup') {
        var response = JSON.parse(Requests.get(ID).responseText);
        var accountInfoTitle = document.createElement('p');
        var accountInfo = newElements.createSignupSummary(response, Init.dataNames);
        el.header.innerHTML = 'Sign up completed';
        accountInfoTitle.innerHTML = 'You provided the following information: ';
        el.signupContent.innerHTML = '';
        el.signupMiddle.style.maxWidth = '65rem';
        el.signupContent.appendChild(accountInfoTitle);
        el.signupContent.appendChild(accountInfo);
      }
      else {
        formMsg.showOK(el.signupMsg, 'Success');
        el.signupButton.scrollIntoView();
      }
      enableInputs(action);
    }

    function failCallback(action) {
      el.signupContent.innerHTML = '';
      el.signupMiddle.style.maxWidth = '65rem';
      if (Requests.get(ID).status >= 500) {
        var errorMsg = document.createElement('p');
        errorMsg.innerHTML = 'Oops, something went wrong. Please try again in a while';
        el.header.innerHTML = Requests.get(ID).status + ' - Server Error';
        el.signupContent.appendChild(errorMsg);
      } else {
        var response = JSON.parse(Requests.get(ID).responseText);
        var accountInfo = newElements.createSignupSummary(response, Init.dataNames);
        el.header.innerHTML = Requests.get(ID).status + ' - Bad Request';
        el.signupContent.appendChild(accountInfo);
      }
      enableInputs(action);
    }
  }

  /* scrolls to an element */
  function scrollToParent(element) {
    if (window.scrollY) {
      var html = document.getElementsByTagName('html')[0];
      var fontSize = parseFloat(getComputedStyle(html).getPropertyValue('font-size'));
      window.scroll(0, element.parentNode.offsetTop - 2.8 * fontSize);
    }
  }

  function checkUsernameEmailDB(action) {
    if (action === 'UpdateAccount' && el.email.value === data.oldEmail) {
      doSignup(action);
      return;
    }
    Requests.cancelExcept(null);
    formInput.disable(el.username);
    formInput.disable(el.email);
    formSubmit.disable(el.signupButton);

    var loader = newElements.createLoader("images/loader.gif");
    formMsg.showElement(el.signupMsg, loader);
    el.signupButton.scrollIntoView();

    var formData = new FormData();
    formData.append('action', 'CheckUsernameEmailDB');
    if (action !== 'UpdateAccount') {
      formData.append('username', el.username.value);
    }
    formData.append('email', el.email.value);

    var ID = Requests.add(ajaxRequest('POST', 'Main', formData, successCallback, failCallback));

    function successCallback() {
      var response = JSON.parse(Requests.get(ID).responseText);
      formMsg.clear(el.signupMsg);
      if (!response.username && !response.email) {
        doSignup(action);
      }
      else {
        if (response.username) {
          ValidChecker.showInvalidMsg(el.username, response.username);
        }
        if (response.email) {
          ValidChecker.showInvalidMsg(el.email, response.email);
        }
        if (response.username) {
          scrollToParent(el.username);
        }
        else {
          scrollToParent(el.email);
        }
      }
      formSubmit.enable(el.signupButton);
      if (action === 'Signup') {
        formInput.enable(el.username);
      }
      formInput.enable(el.email);
    }

    function failCallback() {
      formMsg.clear(el.signupMsg);
      formSubmit.enable(el.signupButton);
      if (action === 'Signup') {
        formInput.enable(el.username);
      }
      formInput.enable(el.email);
      console.log(Requests.get(ID).responseText);
    }
  }

  function init(action) {
    el.username = document.getElementById('signup-username');
    el.email = document.getElementById('signup-email');
    el.signupMiddle = document.getElementById('signup-middle');
    el.header = el.signupMiddle.children[0].children[0];
    el.signupContent = el.signupMiddle.children[1];
    el.address = document.getElementById('signup-address');
    el.gender = document.querySelectorAll('input[type="radio"]');
    el.signupMsg = document.getElementById('sign-process-msg');
    el.signupButton = document.querySelector('#signup-button input');
    el.geolocSearchButton = document.getElementsByClassName('signup-geolocation-search-button')[0];
    el.nominatimSearchButton = document.getElementsByClassName('signup-location-search-button')[0];

    if (action === 'GetSignup') {
      el.signupButton.addEventListener('click', function() {
        clickSignup('Signup');
      });
    }
    else if (action === 'AccountInfo') {
      formInput.disable(document.getElementById('signup-username'));

      var countryHidden = document.getElementById('country-hidden');
      var country = document.getElementById('signup-country');
      country.children[0].selected = 'false';
      for (var j = 0; j < country.children.length; j++) {
        if (country.children[j].value === countryHidden.innerHTML ||
            country.children[j].name === countryHidden.innerHTML) {
          country.children[j].selected = 'true';
          break;
        }
      }

      el.signupButton.addEventListener('click', function() {
        clickSignup('UpdateAccount');
      });
    }

    ValidChecker.init();
    SignUpLocation.init();
    SignUpFace.init();
    data.oldEmail = el.email.value;
    el.signupButton.disabled = false;
  }

  return {
    init: init
  };
}());