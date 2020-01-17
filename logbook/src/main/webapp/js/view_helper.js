'use strict';

/* style for buttons that can be enabled or disabled */
var formButton = (function() {
  function enable(button) {
    button.disabled = false;
    button.style.boxShadow = '0 2px 2px rgba(0, 0, 0, 0.2)';
  }
  function disable(button) {
    button.disabled = true;
    button.style.boxShadow = 'none';
  }

  return {
    enable: enable,
    disable: disable
  };
}());

/* show various messages depending on the result of a search */
var formMsg = (function() {
  function showError(msgDiv, msg) {
    msgDiv.innerHTML = msg;
    msgDiv.style.color = 'red';
  }
  function showOK(msgDiv, msg) {
    msgDiv.innerHTML = msg;
    msgDiv.style.color = 'green';
  }
  function clear(msgDiv) {
    msgDiv.innerHTML = '';
    msgDiv.style.color = 'black';
  }
  function showElement(msgDiv, element) {
    msgDiv.innerHTML = '';
    msgDiv.style.color = 'black';
    msgDiv.appendChild(element);
  }

  return {
    showError: showError,
    showOK: showOK,
    clear: clear,
    showElement: showElement
  };
}());

/* style for enabled/disabled input form fields */
var formInput = (function() {
  function enable(input) {
    input.disabled = false;
    input.style.backgroundColor = '#f5fdff';
  }
  function disable(input) {
    input.disabled = true;
    input.style.backgroundColor = 'rgb(245, 243, 243)';
  }

  return {
    enable: enable,
    disable: disable
  };
}());

/* style for enabled/disabled form submit button */
var formSubmit = (function() {
  function enable(input) {
    input.disabled = false;
    input.style.background ='linear-gradient(to bottom, #43628b, #324a69)';
  }
  function disable(input) {
    input.disabled = true;
    input.style.background ='gray';
  }

  return {
    enable: enable,
    disable: disable
  };
}());

var redButton = (function() {
  function enable(input) {
    input.disabled = false;
    input.style.background = '#ff4e56';
  }
  function disable(input) {
    input.disabled = true;
    input.style.background = 'gray';
  }

  return {
    enable: enable,
    disable: disable
  };
}());