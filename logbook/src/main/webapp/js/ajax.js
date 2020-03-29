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

var Requests = (function() {
  var xhr = {};

  function getID() {
    return (Math.random() + 1).toString(36).substring(2, 5);
  }

  function add(request) {
    var ID = getID();
    xhr[ID] = request;
    return ID;
  }

  function get(ID) {
    return xhr[ID];
  }

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
