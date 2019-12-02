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
      else {
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