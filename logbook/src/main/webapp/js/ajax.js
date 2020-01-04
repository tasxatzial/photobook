'use strict';

/* create and return a ajax request */
function ajaxRequest(method, url, data, successFunction, failFunction) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status >= 200 && this.status < 300) {
        successFunction();
      }
      else if (this.status) {
        failFunction();
      }
    }
  };
  if (method === 'GET') {
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send();
  }
  else if (method === 'POST') {
    xhr.send(data);
  }
  return xhr;
}

var Requests = (function() {
  var xhr = new Map();

  function getID() {
    return (Math.random() + 1).toString(36).substring(2, 5);
  }

  function add(request) {
    var ID = getID();
    xhr.set(ID, request);
    return ID;
  }

  function get(ID) {
    return xhr.get(ID);
  }

  function cancelAll() {
    xhr.forEach(function(i) {
      i.abort();
    });
    xhr.clear();
  }

  return {
    add: add,
    get: get,
    cancelAll: cancelAll
  };
}());