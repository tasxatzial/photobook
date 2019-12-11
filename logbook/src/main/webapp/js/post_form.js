'use strict';

var PostForm = (function() {
  var state = {
    xhr: null
  };

  function init(userPosts) {
    var nonav = document.getElementById('no-nav');
    var data = new FormData();
    data.append("action", "GetPostForm");
    state.xhr = ajaxRequest('POST', 'Main', data, successCallback, failCallback);

    function successCallback() {
      var postFormSection = newElements.createPostFormSection();
      postFormSection.children[0].innerHTML = state.xhr.responseText;
      if (!userPosts) {
        nonav.innerHTML = '';
        nonav.appendChild(postFormSection);
      }
      else {
        var accountParent = document.getElementById('account-parent');
        accountParent.removeChild(accountParent.children[2]);
        postFormSection.children[0].style.paddingLeft = '0';
        postFormSection.children[0].style.paddingRight = '0';
        accountParent.appendChild(postFormSection);
      }
      addListeners();
    }

    function failCallback() {
      console.log(state.xhr.responseText);
    }
  }

  function addListeners() {
    var selectOnlinePhoto = document.getElementById('select-online-photo');
    var selectDiskPhoto = document.getElementById('select-disk-photo');

    selectOnlinePhoto.children[0].children[0].addEventListener('click', function() {
      selectOnlinePhoto.children[1].style.display = 'block';
      selectOnlinePhoto.className = 'sign-child';
      filePicker.clearPhoto();
    });
    var filePicker = new PhotoPicker(selectDiskPhoto.children[2], selectDiskPhoto.children[1]);
    selectDiskPhoto.children[0].addEventListener('click', function() {
      filePicker.click(function() {
        selectOnlinePhoto.children[1].style.display = 'none';
        selectOnlinePhoto.children[0].children[0].checked = false;
        selectOnlinePhoto.className = '';
      });
    });


  }

  return {
    init: init
  };
}());