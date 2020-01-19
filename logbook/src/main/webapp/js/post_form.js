'use strict';

var PostForm = (function() {
  var state = {
    lastDetectionMethod: null
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
    geolocationRadio: null,
    placeRadio: null,
    country: null,
    place: null,
    onlineImage: null,
    onlineImageCheckbox: null,
    selectDiskPhotoButton: null,
    photoToggle: null
  };

  function init(username) {
    loc.lat = null;
    loc.lon = null;
    state.lastDetectionMethod = null;

    data.username = username;

    el.createPostMsg = document.getElementById('sign-process-msg');
    el.description = document.getElementById('post-form-description');
    el.onlineResource = document.getElementById('post-form-online-page');
    el.selectOnlinePhoto = document.getElementById('select-online-photo');
    el.onlineImage = el.selectOnlinePhoto.children[1];
    el.onlineImageCheckbox = el.selectOnlinePhoto.children[0].children[0];
    el.photoToggle = PhotoToggler();
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
    el.postButton = document.getElementById('post-button').children[0];
    el.locationDetectMsg = document.getElementById('post-form-detect-msg');


    if (!navigator.geolocation) {
      el.geolocationRadio.innerHTML = 'Geolocation not supported';
      el.geolocationRadio.disabled = true;
      el.placeRadio.checked = true;
      selectPlace();
    }

    formButton.enable(el.selectDiskPhotoButton);
    formSubmit.enable(el.postButton);

    addListeners();
  }

  function addListeners() {
    el.description.addEventListener('input', function() {
      formMsg.clear(el.createPostMsg);
    });

    el.onlineImageCheckbox.addEventListener('click', function() {
      el.photoToggle.toggle("onlineImage");
    });

    el.selectDiskPhotoButton.addEventListener('click', function() {
      el.filePicker.click(function() {
        el.photoToggle.toggle("diskPhoto");
      });
    });

    function addPlaceInputListeners() {
      formMsg.clear(el.createPostMsg);
      formMsg.clear(el.locationDetectMsg);
      if (el.country.value !== '' && el.place.value.trim() !== '') {
        formButton.enable(el.locationDetectButton);
      }
      else {
        formButton.disable(el.locationDetectButton);
      }
    }

    el.country.addEventListener('input', addPlaceInputListeners);
    el.place.addEventListener('input', addPlaceInputListeners);

    if (navigator.geolocation) {
      formButton.enable(el.locationDetectButton);
      el.geolocationRadio.addEventListener('click', function () {
        loc.lat = null;
        loc.lon = null;
        el.locationPlace.style.display = 'none';
        el.place.value = '';
        el.country.value = '';
        if (state.lastDetectionMethod !== 'geolocation') {
          formMsg.clear(el.locationDetectMsg);
        }
        state.lastDetectionMethod = 'geolocation';
      });
    }

    el.placeRadio.addEventListener('click', selectPlace);

    el.locationDetectButton.addEventListener('click', locationDetectMethod);
    el.postButton.addEventListener('click', createPost);
  }

  function selectPlace() {
    loc.lat = null;
    loc.lon = null;
    formButton.disable(el.locationDetectButton);
    el.locationPlace.style.display = 'block';
    if (state.lastDetectionMethod !== 'place') {
      formMsg.clear(el.locationDetectMsg);
    }
    state.lastDetectionMethod = 'place';
  }

  function PhotoToggler() {
    var state = {
      onlineImage: false
    };

    function hideOnlineImage() {
      state.onlineImage = false;
      el.onlineImageCheckbox.checked = false;
      el.onlineImage.style.display = 'none';
      el.selectOnlinePhoto.className = '';
      el.onlineImage.value = '';
    }

    function toggle(what) {
      if (what === "diskPhoto") {
        hideOnlineImage();
      }
      else if (what === "onlineImage") {
        if (state.onlineImage) {
          hideOnlineImage();
        } else {
          state.onlineImage = true;
          el.onlineImageCheckbox.checked = true;
          el.onlineImage.style.display = 'inline-block';
          el.selectOnlinePhoto.className = 'sign-child';
          el.filePicker.clearPhoto();
        }
      }
    }

    return {
      toggle: toggle
    };
  }

  function createPost() {
    Requests.cancelExcept(null);
    el.postButton.scrollIntoView();

    if (loc.lat === null || loc.lon === null || el.description.value.trim() === '') {
      formMsg.showError(el.createPostMsg, 'Please provide all required fields');
      return;
    }

    disableInputs();
    var loader = newElements.createLoader("images/loader.gif");
    formMsg.showElement(el.createPostMsg, loader);

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

    var ID = Requests.add(ajaxRequest('POST', 'Main', formData, successCallback, failCallback));

    function successCallback() {
      if (JSON.parse(Requests.get(ID).responseText).ERROR) {
        Logout.showExpired();
        return;
      }
      Posts.init(data.username);
    }

    function failCallback() {
      enableInputs();
      console.log(Requests.get(ID).responseText);
    }
  }

  function locationDetectMethod() {
    formMsg.clear(el.createPostMsg);
    formButton.disable(el.locationDetectButton);
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
      formButton.enable(el.locationDetectButton);
      loc.lat = String(position.coords.latitude);
      loc.lon = String(position.coords.longitude);
      formMsg.showOK(el.locationDetectMsg, '(' + loc.lat.substring(0, loc.lat.length - 4) + ', ' + loc.lon.substring(0, loc.lon.length - 4) + ')');
    }
    function failCallback() {
      formButton.enable(el.locationDetectButton);
      formMsg.showError(el.locationDetectMsg, "Error");
    }
  }

  function locationSearch() {
    Requests.cancelExcept(null);
    var loader = newElements.createLoader("images/loader.gif");
    formMsg.showElement(el.locationDetectMsg, loader);

    var input = LocationSearch.createInput('', el.place, el.country);
    var ID = Requests.add(ajaxRequest('GET', nominatimAPI.url + input, null, successCallback, failCallback));

    function successCallback() {
      formButton.enable(el.locationDetectButton);
      var response = JSON.parse(Requests.get(ID).responseText)[0];
      if (response) {
        loc.lat = response.lat;
        loc.lon = response.lon;
        formMsg.showOK(el.locationDetectMsg, '(' + loc.lat.substring(0, loc.lat.length - 4) + ', ' + loc.lon.substring(0, loc.lon.length - 4) + ')');
      }
      else {
        formMsg.showError(el.locationDetectMsg, 'Not found');
      }
    }

    function failCallback() {
      formButton.enable(el.locationDetectButton);
      console.log(Requests.get(ID).responseText);
    }
  }

  function enableInputs() {
    formSubmit.enable(el.postButton);
    formInput.enable(el.description);
    el.geolocationRadio.disabled = false;
    el.placeRadio.disabled = false;
    formButton.enable(el.locationDetectButton);
    formInput.enable(el.country);
    formInput.enable(el.place);
    formInput.enable(el.onlineResource);
    el.onlineImageCheckbox.disabled = false;
    formInput.enable(el.onlineImage);
    formButton.enable(el.selectDiskPhotoButton);
  }

  function disableInputs() {
    formSubmit.disable(el.postButton);
    formInput.disable(el.description);
    el.geolocationRadio.disabled = true;
    el.placeRadio.disabled = true;
    formButton.disable(el.locationDetectButton);
    formInput.disable(el.country);
    formInput.disable(el.place);
    formInput.disable(el.onlineResource);
    el.onlineImageCheckbox.disabled = true;
    formInput.disable(el.onlineImage);
    formButton.disable(el.selectDiskPhotoButton);
  }

  return {
    init: init
  };
}());