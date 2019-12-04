'use strict';

/*  face recognition controller */
var SignUpFace = (function () {

  var state = {
    photoSectionVisible: false,

    /* class that controls the select photo button and the display of the image */
    photoPicker: null,

    /* true when setID or addFace fail */
    fail: false,

    /* true when setID or addFace finish (either fail or succeed) */
    ended: false
  };

  var tasks = {
    detect: null,
    setID: null,
    addFace: null
  };

  var el = {
    username: null,
    checkBox: null,
    photoSectionParent: null,

    /* hidden photo section that appears when checkbox is clicked */
    photoSection: null,

    uploadMsgParent: null,
    uploadButton: null,
    photoParent: null,
    selectButton: null
  };

  /* called from task setID or addFace when they succeed.
  Will return immediately if:
  1) the other task has failed -> photo uploading result: fail
  2) the other task has not finished -> photo uploading result:
  will be determined by the other task */
  function taskSuccess() {
    if (!state.ended || state.fail) {
      state.ended = true;
      return;
    }

    formMsg.showOK(el.uploadMsgParent, 'Success');
    formButton.enable(el.selectButton);
    formButton.disable(el.uploadButton);
    formInput.enable(el.username);
  }

  /* called from task setID or addFace when they fail, the errMsg is
  the error message provided by the corresponding function.
  Will return immediately if:
  1) the task that called it is not the first task that failed ->
  photo uploading result: fail */
  function taskFail(errMsg) {
    if (!state.fail) {
      state.fail = true;

      formMsg.showError(el.uploadMsgParent, FaceAPI.shortMsg(errMsg));
      formInput.enable(el.username);
      formButton.enable(el.selectButton);
      formButton.enable(el.uploadButton);
      el.checkBox.disabled = false;
    }
  }

  /* called when ajax request for detect succeeds. calls setID & addFace,
  each will make an extra ajax request */
  function detectSuccess() {
    var faceToken = tasks.detect.getToken();
    if (!faceToken) {
      formMsg.showError(el.uploadMsgParent, 'No face detected');
      formButton.enable(el.selectButton);
      formInput.enable(el.username);
      el.checkBox.disabled = false;
    }
    else {
      state.ended = false;
      state.fail = false;
      tasks.setID = FaceAPI.setID(el.username.value, faceToken, taskSuccess, taskFail);
      tasks.addFace = FaceAPI.addFace(faceToken, taskSuccess, taskFail);
    }
  }

  /* called when ajax request for detect fails -> photo uploading result: fail */
  function detectFail() {
    formInput.enable(el.username);
    formButton.enable(el.selectButton);
    formButton.enable(el.uploadButton);
    el.checkBox.disabled = false;
    formMsg.showError(el.uploadMsgParent, FaceAPI.shortMsg(tasks.detect.getErrorMsg()));
  }

  /* the first request to the face++ service, called every time
  the upload button is clicked */
  function detect() {
    var photo = state.photoPicker.getPhotob64();
    var loader = newElements.createLoader('images/loader.gif');
    formMsg.showElement(el.uploadMsgParent, loader);
    formInput.disable(el.username);
    formButton.disable(el.selectButton);
    formButton.disable(el.uploadButton);
    el.checkBox.disabled = true;
    tasks.detect = FaceAPI.detect(photo, detectSuccess, detectFail);
  }

  /* called every time the select photo button is clicked */
  function pickNewImage() {

    /* pass a callback that will be called in case:
    1) The selected photo is not an accepted format
    2) The selected photo is loaded on the DOM */
    state.photoPicker.click(function(){
      formMsg.clear(el.uploadMsgParent);
      var photo = state.photoPicker.getPhotob64();
      if (photo) {
        formButton.enable(el.uploadButton);
      }
    });
  }

  /* called every time user clicks the checkbox/label */
  function toggleControl() {

    /* initialize the photo section once */
    if (!el.photoSection) {
      el.photoSection = newElements.createSignUpPhotoSection();
      el.photoSectionParent.appendChild(el.photoSection);
      el.selectButton = document.getElementById('signup-pick-photo-button');
      el.uploadButton = document.getElementById('signup-upload-photo-button');
      el.uploadButton.addEventListener('click', detect);
      el.uploadMsgParent = document.getElementById('signup-upload-photo-msg');
      el.photoParent = document.getElementById('signup-photo-parent');
      var fileInput = document.getElementById('file-input');
      state.photoPicker = new PhotoPicker(el.photoParent, fileInput);
      el.selectButton.addEventListener('click', pickNewImage);
      formButton.enable(el.selectButton);
    }

    /* toggle the visibility of the photo section */
    if (state.photoSectionVisible) {
      initphotoSection();
      el.photoSectionParent.removeChild(el.photoSection);
      state.photoSectionVisible = false;
    }
    else {
      el.photoSectionParent.appendChild(el.photoSection);
      state.photoSectionVisible = true;
    }
  }

  /* initializes the photo section. This happens when:
  1) user types a username
  2) user clicks the checkbox/label to hide the photo section */
  function initphotoSection() {
    formMsg.clear(el.uploadMsgParent);
    formButton.disable(el.uploadButton);
    formButton.enable(el.selectButton);
    state.photoPicker.clearPhoto();
  }

  /* check if username value permits to access the photo section.
  called every time user types in username box */
  function usernameCheck(usernameRegex) {
    if (state.photoSectionVisible) {
      initphotoSection();
      el.photoSectionParent.removeChild(el.photoSection);
      state.photoSectionVisible = false;
      el.checkBox.checked = false;
    }
    el.checkBox.disabled = !usernameRegex.test(el.username.value);
  }

  function init() {
    state.photoSectionVisible = false;
    el.username = document.getElementById('signup-username');
    el.checkBox = document.querySelector('#signup-photo-section input');
    el.photoSectionParent = document.getElementById('signup-photo-section');
    var usernameRegex = new RegExp(el.username.pattern);

    el.username.addEventListener('input', function () {
      usernameCheck(usernameRegex);
    });
    el.checkBox.addEventListener('click', toggleControl);

    if (el.checkBox.checked) { //firefox remembers its state when page is reloaded
      el.checkBox.checked = false;
    }
    if (usernameRegex.test(el.username.value)) {
      el.checkBox.disabled = false;
    }
  }
  
  return {
    init: init
  };
}());