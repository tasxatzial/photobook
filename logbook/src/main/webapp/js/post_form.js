'use strict';

/**
 * Functions related to creating new posts. Only functions related to the new post form are considered here.
 * @type {{init: init}}
 */
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
    photoToggle: null,
    locationDetectMsg: null,
    postFormPhoto: null,
    postFormContent: null,
    header: null
  };

  /**
   * Initializations after the form has been displayed.
   * @param username
   */
  function init(username) {
    var accountSection = document.getElementById('account-section');
    if (!accountSection) {
      Homepage.removeActive();
    }
    data.loc.lat = null;
    data.loc.lon = null;
    state.lastDetectionMethod = null;
    data.username = username;

    el.createPostMsg = document.getElementById('newpost-process-msg');
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
    var postFormParent = document.getElementById('post-form-parent');
    el.header = postFormParent.children[0].children[0];
    el.postFormContent = postFormParent.children[1];

    if (!navigator.geolocation) {
      el.geolocationRadio.innerHTML = 'Geolocation not supported';
      el.geolocationRadio.disabled = true;
      el.placeRadio.checked = true;
      selectPlaceInit();
    }

    addListeners();
  }

  /**
   * Adds all required listeners to the form.
   */
  function addListeners() {
    el.placeRadio.addEventListener('click', function() {
      Requests.cancelExcept(null);
      selectPlaceInit();
    });

    el.postButton.addEventListener('click', function() {
      this.blur();
      createPost();
    });
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

  /**
   * Changes the initial view when geolocation search is not supported.
   */
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

  /**
   * Changes the view when we choose between disk image selection and URL image selection.
   * @returns {{toggle: toggle}}
   * @constructor
   */
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

  /**
   * Creates a new post.
   */
  function createPost() {
    Requests.cancelExcept(null);
    Init.scrollTo(el.postButton);
    el.createPostMsg.classList.add('msg-open');

    if (data.loc.lat === null || data.loc.lon === null || el.description.value.trim() === '') {
      formMsg.showError(el.createPostMsg, 'Please provide all required fields');
      return;
    }

    disableInputs();

    formMsg.showElement(el.createPostMsg, Init.loader);

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
      Posts.init(data.username);
    }

    function failCallback() {
      enableInputs();
      if (Requests.get(ID).status === 401) {
        Logout.showExpired();
        return;
      }
      var info = null;
      if (Requests.get(ID).status === 500) {
        formMsg.showError(el.createPostMsg, 'Server error');
        Init.scrollTo(el.postButton);
      }
      else if (Requests.get(ID).status === 0) {
        formMsg.showError(el.createPostMsg, 'Unable to send request');
        Init.scrollTo(el.postButton);
      }
      else if (Requests.get(ID).status === 400) {
        var response = JSON.parse(Requests.get(ID).responseText);
        info = newElements.createSignupSummary(response, Init.postNames);
        el.postFormContent.innerHTML = '';
        el.postFormContent.appendChild(info);
        el.header.innerHTML = '400 - Bad Request';
      }
      else {
        formMsg.showError(el.createPostMsg, 'Error');
        Init.scrollTo(el.postButton);
      }
    }
  }

  /**
   * Selects either geolocation search or location search using the nominatim service. It then performs a search.
   */
  function locationSearchInit() {
    data.loc.lat = null;
    data.loc.lon = null;
    formMsg.clear(el.createPostMsg);
    formButton.disable(el.locationDetectButton);
    if (navigator.geolocation && el.geolocationRadio.checked) {
      geolocationSearch();
    }
    else {
      locationSearch();
    }
  }

  /**
   * Performs geolocation search.
   */
  function geolocationSearch() {
    formMsg.showElement(el.locationDetectMsg, Init.loader);
    navigator.geolocation.getCurrentPosition(successNavCallback, failCallback);
    function successNavCallback(position) {
      formButton.enable(el.locationDetectButton);
      data.loc.lat = String(position.coords.latitude);
      data.loc.lon = String(position.coords.longitude);
      formMsg.showOK(el.locationDetectMsg, '(' + parseFloat(data.loc.lat).toFixed(4) + ', ' + parseFloat(data.loc.lon).toFixed(4) + ')');
    }
    function failCallback() {
      formButton.enable(el.locationDetectButton);
      formMsg.showError(el.locationDetectMsg, "Error");
    }
  }

  /**
   * Performs location search using the nominatim service.
   */
  function locationSearch() {
    Requests.cancelExcept(null);
    formMsg.showElement(el.locationDetectMsg, Init.loader);

    var input = LocationSearch.createInput('', el.place, el.country);
    var ID = Requests.add(ajaxRequest('GET', nominatimAPI.url + input, null, successCallback, failCallback));

    function successCallback() {
      formButton.enable(el.locationDetectButton);
      var response = JSON.parse(Requests.get(ID).responseText)[0];
      if (response) {
        data.loc.lat = response.lat;
        data.loc.lon = response.lon;
        formMsg.showOK(el.locationDetectMsg, '(' + parseFloat(data.loc.lat).toFixed(4) + ', ' + parseFloat(data.loc.lon).toFixed(4) + ')');
      }
      else {
        formButton.enable(el.locationDetectButton);
        formMsg.showError(el.locationDetectMsg, 'Not found');
      }
    }

    function failCallback() {
      formButton.enable(el.locationDetectButton);
      formMsg.showError(el.locationDetectMsg, 'Error');
    }
  }

  /**
   * Enables all inputs. Called after an unsuccessful creation of new post.
   */
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

  /**
   * Disables all inputs. Called after the new post button has been clicked.
   */
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