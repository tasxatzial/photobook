'use strict';

var PostForm = (function() {
  var state = {
    xhr: null,
    xhrResponse: null
  };

  var loc = {
    lat: null,
    lon: null
  };

  var nominatimAPI = {
    url: 'https://nominatim.openstreetmap.org/search'
  };

  var el = {
    filePicker: null,
    selectOnlinePhoto: null,
    locationPlace: null,
    locationDetect: null,
    createPostMsg: null,
    description: null,
    onlineResource: null,
    onlineImage: null,
    postButton: null,
    selectDiskPhoto: null,
    locationDetectButton: null,
    onlinePhotoToggle: null
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

      el.createPostMsg = document.getElementById('signupin-msg');
      el.description = document.getElementById('post-form-description');
      el.onlineResource = document.getElementById('post-form-online-page');
      el.onlineImage = document.getElementById('post-form-online-image');
      el.selectOnlinePhoto = document.getElementById('select-online-photo');
      el.selectDiskPhoto = document.getElementById('select-disk-photo');
      el.filePicker = new PhotoPicker(el.selectDiskPhoto.children[2], el.selectDiskPhoto.children[1]);
      el.locationDetect = document.querySelector('.post-form-options');
      el.locationDetectButton = document.getElementById('post-form-detect-button');
      el.locationPlace = document.getElementById('post-form-country-hidden');
      el.onlinePhotoToggle = OnlinePhotoToggle();
      el.postButton = document.getElementById('post-button');

      addListeners();
    }

    function failCallback() {
      console.log(state.xhr.responseText);
    }
  }

  function addListeners() {
    el.description.addEventListener('input', function() {
      formMsg.clear(el.createPostMsg);
    });

    el.selectOnlinePhoto.children[0].children[0].addEventListener('click', function() {
      el.onlinePhotoToggle.toggle();
    });

    el.selectDiskPhoto.children[0].addEventListener('click', function() {
      el.filePicker.click(function() {
        el.selectOnlinePhoto.children[1].style.display = 'none';
        el.selectOnlinePhoto.children[0].children[0].checked = false;
        el.selectOnlinePhoto.className = '';
      });
    });

    el.locationDetect.children[0].children[0].addEventListener('click', function() {
      loc.lat = null;
      loc.lon = null;
      el.locationDetectButton.disabled = false;
      el.locationPlace.style.display = 'none';
      el.locationPlace.children[1].children[1].value = '';
      el.locationPlace.children[0].children[1].value = '';
    });

    el.locationDetect.children[2].children[0].addEventListener('click', function() {
      loc.lat = null;
      loc.lon = null;
      el.locationPlace.style.display = 'block';
      el.locationPlace.children[1].style.marginBottom = '0.7rem';
    });

    el.locationDetectButton.addEventListener('click', pickLocationDetectMethod);
    el.postButton.addEventListener('click', createPost);
  }

  function createPost() {
    if (loc.lat === null || loc.lon === null || el.description.value.trim() === '') {
      formMsg.showError(el.createPostMsg, 'Please provide all required fields');
      return;
    }

    console.log(loc.lat);
    console.log(loc.lon);
    console.log(el.description.value);
    console.log(el.onlineResource.value);
    console.log(el.onlineImage.value);
    console.log(el.filePicker.getPhotob64());
  }

  function pickLocationDetectMethod() {
    formMsg.clear(el.createPostMsg);
    if (el.locationDetect.children[0].children[0].checked) {
      navigator.geolocation.getCurrentPosition(successNavCallback, failCallback);
      function successNavCallback(position) {
        loc.lat = position.coords.latitude;
        loc.lon = position.coords.longitude;
      }
      function failCallback() {
        console.log("geolocation error");
      }
    }
    else {
      locationSearch();
    }
  }

  function locationSearch() {
    var state = {
      xhr: null,
      xhrResponse: null
    };

    var place = el.locationPlace.children[1].children[1];
    var country = el.locationPlace.children[0].children[1];
    var input = LocationSearch.createInput('', place, country);
    state.xhr = state.xhr = ajaxRequest('GET', nominatimAPI.url + input, null, successCallback, failCallback);

    function successCallback() {
      state.xhrResponse = JSON.parse(state.xhr.responseText)[0];
      loc.lat = state.xhrResponse.lat;
      loc.lon = state.xhrResponse.lon;
    }

    function failCallback() {
      console.log(state.xhr.responseText);
    }
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