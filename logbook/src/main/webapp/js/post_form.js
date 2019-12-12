'use strict';

var PostForm = (function() {
  var state = {
    xhr: null,
    xhrResponse: null,
    lastDetectionMethod: null,
  };

  var data = {
    username: null
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
    createPostMsg: null,
    description: null,
    onlineResource: null,
    postButton: null,
    selectDiskPhoto: null,
    locationDetectButton: null,
    onlinePhotoToggle: null,
    geolocationRadio: null,
    placeRadio: null,
    country: null,
    place: null,
    onlineImage: null,
    onlineImageCheckbox: null,
    selectDiskPhotoButton: null
  };

  function init(username) {
    var nonav = document.getElementById('no-nav');
    data.username = username;

    var formData = new FormData();
    formData.append("action", "GetPostForm");
    state.xhr = ajaxRequest('POST', 'Main', formData, successCallback, failCallback);

    function successCallback() {
      var postFormSection = newElements.createPostFormSection();
      postFormSection.children[0].innerHTML = state.xhr.responseText;
      if (username === false) {
        nonav.innerHTML = '';
        nonav.appendChild(postFormSection);
      }
      else {
        var accountParent = document.getElementById('account-parent');
        accountParent.removeChild(accountParent.children[2]);
        accountParent.appendChild(postFormSection);
      }

      el.createPostMsg = document.getElementById('signupin-msg');
      el.description = document.getElementById('post-form-description');
      el.onlineResource = document.getElementById('post-form-online-page');
      el.selectOnlinePhoto = document.getElementById('select-online-photo');
      el.onlineImage = el.selectOnlinePhoto.children[1];
      el.onlineImageCheckbox = el.selectOnlinePhoto.children[0].children[0];
      el.selectDiskPhoto = document.getElementById('select-disk-photo');
      el.selectDiskPhotoButton = el.selectDiskPhoto.children[0];
      el.filePicker = new PhotoPicker(el.selectDiskPhoto.children[2], el.selectDiskPhoto.children[1]);
      var locationDetect = document.querySelector('.post-form-options');
      el.geolocationRadio = locationDetect.children[0].children[0];
      el.placeRadio = locationDetect.children[2].children[0];
      el.locationDetectButton = document.getElementById('post-form-detect-button');
      el.locationPlace = document.getElementById('post-form-country-hidden');
      el.country = el.locationPlace.children[0].children[1];
      el.place = el.locationPlace.children[1].children[1];
      el.onlinePhotoToggle = OnlinePhotoToggle();
      el.postButton = document.getElementById('post-button');
      el.locationDetectMsg = document.getElementById('post-form-detect-msg');

      if (!navigator.geolocation) {
        el.geolocationRadio.innerHTML = 'Geolocation not supported';
        el.geolocationRadio.disabled = true;
        el.placeRadio.checked = true;
      }

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

    el.onlineImageCheckbox.addEventListener('click', function() {
      el.onlinePhotoToggle.toggle();
    });

    function addPlaceInputListeners() {
      formMsg.clear(el.createPostMsg);
      formMsg.clear(el.locationDetectMsg);
      if (el.country.value !== '' && el.place.value.trim() !== '') {
        el.locationDetectButton.disabled = false;
      }
      else {
        el.locationDetectButton.disabled = true;
      }
    }

    el.country.addEventListener('input', addPlaceInputListeners);
    el.place.addEventListener('input', addPlaceInputListeners);

    el.selectDiskPhotoButton.addEventListener('click', function() {
      el.filePicker.click(function() {
        el.onlineImage.style.display = 'none';
        el.onlineImageCheckbox.checked = false;
        el.selectOnlinePhoto.className = '';
      });
    });

    if (navigator.geolocation) {
      el.geolocationRadio.addEventListener('click', function () {
        loc.lat = null;
        loc.lon = null;
        el.locationDetectButton.disabled = false;
        el.locationPlace.style.display = 'none';
        el.place.value = '';
        el.country.value = '';
        if (state.lastDetectionMethod !== 'geolocation') {
          formMsg.clear(el.locationDetectMsg);
        }
        state.lastDetectionMethod = 'geolocation';
      });
    }

    el.placeRadio.addEventListener('click', function() {
      loc.lat = null;
      loc.lon = null;
      el.locationDetectButton.disabled = true;
      el.locationPlace.style.display = 'block';
      if (state.lastDetectionMethod !== 'place') {
        formMsg.clear(el.locationDetectMsg);
      }
      state.lastDetectionMethod = 'place';
    });

    el.locationDetectButton.addEventListener('click', pickLocationDetectMethod);
    el.postButton.addEventListener('click', createPost);
  }

  function createPost() {
    var state = {
      xhr: null
    };

    if (loc.lat === null || loc.lon === null || el.description.value.trim() === '') {
      formMsg.showError(el.createPostMsg, 'Please provide all required fields');
      return;
    }

    var formData = new FormData();
    formData.append("action", "CreatePost");
    formData.append("latitude", loc.lat);
    formData.append("longitude", loc.lon);
    formData.append("description", el.description.value);
    formData.append("resourceURL", el.onlineResource.value);
    formData.append("imageURL", el.onlineImage.value);
    if (el.filePicker.getPhotob64()) {
      formData.append("imageBase64", el.filePicker.getPhotob64());
    }
    else {
      formData.append("imageBase64", '');
    }

    state.xhr = ajaxRequest('POST', 'Main', formData, successCallback, failCallback);

    function successCallback() {
      ShowPosts.init(data.username);
    }

    function failCallback() {
      console.log(state.xhr.responseText);
    }
  }

  function pickLocationDetectMethod() {
    formMsg.clear(el.createPostMsg);
    if (navigator.geolocation && el.geolocationRadio.checked) {
      geolocationSearch();
    }
    else {
      locationSearch();
    }
  }

  function geolocationSearch() {
    navigator.geolocation.getCurrentPosition(successNavCallback, failCallback);
    function successNavCallback(position) {
      loc.lat = position.coords.latitude;
      loc.lon = position.coords.longitude;
      formMsg.showOK(el.locationDetectMsg, '(' + loc.lat + ', ' + loc.lon + ')');
    }
    function failCallback() {
      formMsg.showError(el.locationDetectMsg, "Error");
    }
  }

  function locationSearch() {
    var state = {
      xhr: null,
      xhrResponse: null
    };

    var input = LocationSearch.createInput('', el.place, el.country);
    state.xhr = state.xhr = ajaxRequest('GET', nominatimAPI.url + input, null, successCallback, failCallback);

    function successCallback() {
      state.xhrResponse = JSON.parse(state.xhr.responseText)[0];
      if (state.xhrResponse) {
        loc.lat = state.xhrResponse.lat;
        loc.lon = state.xhrResponse.lon;
        formMsg.showOK(el.locationDetectMsg, '(' + loc.lat + ', ' + loc.lon + ')');
      }
      else {
        formMsg.showError(el.locationDetectMsg, 'Not found');
      }
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
        el.onlineImage.style.display = 'none';
        el.selectOnlinePhoto.className = '';
        el.onlineImage.value = '';
      } else {
        state.checked = true;
        el.onlineImage.style.display = 'inline-block';
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