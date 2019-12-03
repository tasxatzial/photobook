function logout() {
  var state = {
    xhr: null
  };

  var data = new FormData();
  data.append("action", "Logout");

  state.xhr = ajaxRequest('POST', 'Main', data, successCallback, failCallback);

  function successCallback() {
    var navbarContent = document.getElementById('navbar-content');
    var accountButton = document.getElementById('my-account-button');
    var allUsersButton = document.getElementById('show-users-button');
    var logoutButton = document.getElementById('logout-button');
    navbarContent.removeChild(accountButton);
    navbarContent.removeChild(allUsersButton);
    navbarContent.removeChild(logoutButton);

    document.getElementById('no-nav').innerHTML = state.xhr.responseText;
    Landing.init();
  }

  function failCallback() {
    console.log(state.xhr.responseText);
  }
}