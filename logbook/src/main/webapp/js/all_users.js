var ShowAllUsers = (function() {
  var state = {
    pages: 1
  };

  var el = {
    userListParent: null,
  };

  function init() {

  }

  function showPage(pageNo) {
    if (pageNo <= state.pages && pageNo >= 1) {
      if (el.userListParent.children[0].children[1]) {
        el.userListParent.children[0].removeChild(el.userListParent.children[0].children[1]);
      }
      var userPage = newElements.createAccountDetails(state.xhrResponse[pageNo], null, false);
      el.userListParent.children[0].appendChild(userPage);
    }
  }

  return {
    init: init
  };
}());