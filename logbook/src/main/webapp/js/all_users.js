var ShowAllUsers = (function() {
  var state = {
    pages: 1
  };

  var el = {
    userListParent: null,
    nonav: null
  };

  function init() {

  }

  function addListeners() {
    var navButtons = el.userListParent.children[1];
    var leftButton = navButtons.children[0];
    var selectButton = navButtons.children[1].children[0];
    var rightButton = navButtons.children[2];

    leftButton.disabled = true;
    if (state.pages <= 1) {
      rightButton.disabled = true;
    }
    leftButton.addEventListener('click', function () {
      selectButton.value = Number(selectButton.value) - 1;
      if (selectButton.value == 1) {
        leftButton.disabled = true;
      }
      rightButton.disabled = false;
      showPage(selectButton.value);
    });
    rightButton.addEventListener('click', function () {
      selectButton.value = Number(selectButton.value) + 1;
      if (selectButton.value == state.pages) {
        rightButton.disabled = true;
      }
      leftButton.disabled = false;
      showPage(selectButton.value);
    });
    selectButton.addEventListener('change', function () {
      showPage(selectButton.value);
      leftButton.disabled = selectButton.value == 1;
      rightButton.disabled = selectButton.value == state.pages;
    });
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