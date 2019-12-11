'use strict';

var PostForm = (function() {
  var state = {
    xhr: null,
  };

  var el = {
    filePicker: null,
    selectOnlinePhoto: null
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
    el.selectOnlinePhoto = document.getElementById('select-online-photo');
    var selectDiskPhoto = document.getElementById('select-disk-photo');
    el.filePicker = new PhotoPicker(selectDiskPhoto.children[2], selectDiskPhoto.children[1]);
    var locationDetect = document.querySelector('.post-form-options');
    var locationDetectButton = document.getElementById('post-form-detect-button');
    var locationPlace = document.getElementById('post-form-country-hidden');
    var onlinePhotoToggle = OnlinePhotoToggle();

    el.selectOnlinePhoto.children[0].children[0].addEventListener('click', function() {
      onlinePhotoToggle.toggle();
    });

    selectDiskPhoto.children[0].addEventListener('click', function() {
      el.filePicker.click(function() {
        el.selectOnlinePhoto.children[1].style.display = 'none';
        el.selectOnlinePhoto.children[0].children[0].checked = false;
        el.selectOnlinePhoto.className = '';
      });
    });

    locationDetect.children[0].children[0].addEventListener('click', function() {
      locationDetectButton.disabled = false;
      locationPlace.style.display = 'none';
    });

    locationDetect.children[2].children[0].addEventListener('click', function() {
      locationDetectButton.disabled = true;
      locationPlace.style.display = 'block';
      locationPlace.children[1].style.marginBottom = '0.7rem';
    });
  }

  function OnlinePhotoToggle() {
    var state = {
      checked: false
    };

    function toggle() {
      if (state.checked) {
        state.checked = false;
        el.selectOnlinePhoto.children[1].style.display = 'none';
        el.selectOnlinePhoto.className = '';
        el.selectOnlinePhoto.children[1].value = '';
      } else {
        state.checked = true;
        el.selectOnlinePhoto.children[1].style.display = 'inline-block';
        el.selectOnlinePhoto.className = 'sign-child';
        el.filePicker.clearPhoto();
      }
    }

    return {
      toggle: toggle
    };
  }

  return {
    init: init
  };
}());