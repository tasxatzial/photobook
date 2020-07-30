'use strict';

/**
 * Style for buttons that can be enabled or disabled.
 * @type {{enable: enable, disable: disable}}
 */
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

/**
 * Show various messages and style them accordingly depending on the results.
 * @type {{showOK: showOK, showError: showError, clear: clear, showElement: showElement}}
 */
var formMsg = (function() {

  /**
   * Shows the msg in the msgDiv element using red color.
   * @param msgDiv
   * @param msg
   */
  function showError(msgDiv, msg) {
    msgDiv.innerHTML = msg;
    msgDiv.style.color = 'red';
  }

  /**
   * Shows the msg in the msgDiv element using green color.
   * @param msgDiv
   * @param msg
   */
  function showOK(msgDiv, msg) {
    msgDiv.innerHTML = msg;
    msgDiv.style.color = 'green';
  }

  /**
   * Clears the content of the msgDiv element.
   * @param msgDiv
   */
  function clear(msgDiv) {
    msgDiv.innerHTML = '';
    msgDiv.style.color = 'black';
  }

  /**
   * Clears the content of the msgDiv element and appends the specified element to it.
   * @param msgDiv
   * @param element
   */
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

/**
 * Style for enabled/disabled form input fields.
 * @type {{enable: enable, disable: disable}}
 */
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

/**
 * Style for enabled/disabled form submit button.
 * @type {{enable: enable, disable: disable}}
 */
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