'use strict';

/**
 * Creates and returns an ajax request.
 * @param method GET or POST
 * @param url
 * @param data
 * @param successFunction
 * @param failFunction
 */
function ajaxRequest(method, url, data, successFunction, failFunction) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status >= 200 && this.status < 300) {
        successFunction();
      }
      else if (this.statusName !== 'aborted') {
        failFunction();
      }
    }
  };
  if (method === 'GET') {
    xhr.send();
  }
  else if (method === 'POST') {
    xhr.send(data);
  }
  return xhr;
}

/**
 * Simple function for managing multiple ajax requests.
 * @type {{add: (function(*): *), get: (function(*): *), cancelExcept: cancelExcept}}
 */
var Requests = (function() {

  /* stores the requests */
  var xhr = {};

  /* generate an Id */
  function getID() {
    return (Math.random() + 1).toString(36).substring(2, 5);
  }

  /* adds a request and returns its Id */
  function add(request) {
    var ID = getID();
    xhr[ID] = request;
    return ID;
  }

  /* gets the request that has the specified Id */
  function get(ID) {
    return xhr[ID];
  }

  /* cancels all requests except the one with the specified Id */
  function cancelExcept(ID) {
    for (var key in xhr) {
      if (key !== ID) {
        xhr[key]['statusName'] = 'aborted';
        xhr[key].abort();
        delete xhr[key];
      }
    }
  }

  return {
    add: add,
    get: get,
    cancelExcept: cancelExcept
  };
}());
