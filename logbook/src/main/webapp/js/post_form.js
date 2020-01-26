'use strict';

var PostForm = (function() {
  var state = {
    lastDetectionMethod: null
  };

  var data = {
    username: null,
    loc: {
      lat: null,
      lon: null
    }
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
    data.loc.lat = null;
    data.loc.lon = null;
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
    var locationDetect = document.getElementById('post-form-location-choose');
    el.geolocationRadio = locationDetect.children[0].children[0];
    el.placeRadio = locationDetect.children[2].children[0];
    el.locationDetectButton = document.getElementById('post-form-detect-button');
    el.locationPlace = document.getElementById('post-form-country-hidden');
    el.country = el.locationPlace.children[0].children[1];
    el.place = el.locationPlace.children[1].children[1];
    el.postButton = document.getElementById('post-button').children[0];
    el.locationDetectMsg = document.getElementById('post-form-detect-msg');
    el.postFormPhoto = document.getElementById('post-form-photo-parent');

    if (!navigator.geolocation) {
      el.geolocationRadio.innerHTML = 'Geolocation not supported';
      el.geolocationRadio.disabled = true;
      el.placeRadio.checked = true;
      selectPlaceInit();
    }

    addListeners();
  }

  function addListeners() {
    el.placeRadio.addEventListener('click', function() {
      Requests.cancelExcept(null);
      selectPlaceInit();
    });

    el.postButton.addEventListener('click', createPost);
    formSubmit.enable(el.postButton);

    el.description.addEventListener('input', function() {
      formMsg.clear(el.createPostMsg);
    });

    el.onlineImageCheckbox.addEventListener('click', function() {
      el.photoToggle.toggle("onlineImage");
    });

    el.selectDiskPhotoButton.addEventListener('click', function() {
      el.filePicker.click(function() {
        var button = newElements.createCloseButton('remove-disk-photo-button');
        button.addEventListener('click', function() {
          el.filePicker.clearPhoto();
          el.postFormPhoto.innerHTML = '';
        });
        el.postFormPhoto.insertBefore(button, el.postFormPhoto.children[0]);
        el.photoToggle.toggle("diskPhoto");
      });
    });
    formButton.enable(el.selectDiskPhotoButton);

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
    el.locationDetectButton.addEventListener('click', locationSearchInit);

    if (navigator.geolocation) {
      formButton.enable(el.locationDetectButton);
      el.geolocationRadio.addEventListener('click', function () {
        formButton.enable(el.locationDetectButton);
        data.loc.lat = null;
        data.loc.lon = null;
        el.locationPlace.style.display = 'none';
        el.place.value = '';
        el.country.value = '';
        if (state.lastDetectionMethod !== 'geolocation') {
          Requests.cancelExcept(null);
          formMsg.clear(el.locationDetectMsg);
        }
        state.lastDetectionMethod = 'geolocation';
      });
    }
  }

  function selectPlaceInit() {
    data.loc.lat = null;
    data.loc.lon = null;
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

    if (data.loc.lat === null || data.loc.lon === null || el.description.value.trim() === '') {
      formMsg.showError(el.createPostMsg, 'Please provide all required fields');
      return;
    }

    disableInputs();
    var loader = newElements.createLoader("images/loader.gif");
    formMsg.showElement(el.createPostMsg, loader);

    var formData = new FormData();
    formData.append("action", "CreatePost");
    formData.append("latitude", data.loc.lat);
    formData.append("longitude", data.loc.lon);
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

  function locationSearchInit() {
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
    var loader = newElements.createLoader("images/loader.gif");
    formMsg.showElement(el.locationDetectMsg, loader);

    navigator.geolocation.getCurrentPosition(successNavCallback, failCallback);
    function successNavCallback(position) {
      formButton.enable(el.locationDetectButton);
      data.loc.lat = String(position.coords.latitude);
      data.loc.lon = String(position.coords.longitude);
      formMsg.showOK(el.locationDetectMsg, '(' + fourDecimal(data.loc.lat) + ', ' + fourDecimal(data.loc.lon) + ')');
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
        data.loc.lat = response.lat;
        data.loc.lon = response.lon;
        formMsg.showOK(el.locationDetectMsg, '(' + fourDecimal(data.loc.lat) + ', ' + fourDecimal(data.loc.lon) + ')');
      }
      else {
        formButton.enable(el.locationDetectButton);
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

  function fourDecimal(string) {
    return 0.001 * Math.round(parseFloat(string) * 1000)
  }
  return {
    init: init
  };
}());