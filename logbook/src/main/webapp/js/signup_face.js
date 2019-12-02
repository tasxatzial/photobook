'use strict';

/*  face recognition controller */
var signUpFace = function () {

  var state = {

    /* hidden photo section that appears when checkbox is clicked */
    photoSection: null,

    photoSectionVisible: false,
    uploadMsgParent: null,
    uploadButton: null,
    photoParent: null,
    selectButton: null,

    /* class that controls the select photo button and the display
    of the image */
    photoPicker: null,
  
    /* face++ object */
    facePlus: null,

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

    formMsg.showOK(state.uploadMsgParent, 'Success');
    formButton.disable(state.uploadButton);
    formInput.enable(username);
    formButton.enable(state.selectButton);
    checkBox.disabled = false;
  }

  /* called from task setID or addFace when they fail, the errMsg is
  the error message provided by the corresponding function.
  Will return immediately if:
  1) the task that called it is not the first task that failed ->
  photo uploading result: fail */
  function taskFail(errMsg) {
    if (!state.fail) {
      state.fail = true;

      formMsg.showError(state.uploadMsgParent, state.facePlus.shortMsg(errMsg));
      formInput.enable(username);
      formButton.enable(state.selectButton);
      formButton.enable(state.uploadButton);
      checkBox.disabled = false;
    }
  }

  /* called when ajax request for detect succeeds. calls setID & addFace,
  each will make an extra ajax request */
  function detectSuccess() {
    var faceToken = tasks.detect.getToken();
    if (!faceToken) {
      formMsg.showError(state.uploadMsgParent, 'No face detected');
      formButton.enable(state.selectButton);
      formInput.enable(username);
      checkBox.disabled = false;
    }
    else {
      state.ended = false;
      state.fail = false;
      tasks.setID = state.facePlus.setID(username.value, faceToken, taskSuccess, taskFail);
      tasks.addFace = state.facePlus.addFace(faceToken, taskSuccess, taskFail);
    }
  }

  /* called when ajax request for detect fails -> photo uploading result: fail */
  function detectFail() {
    formInput.enable(username);
    formButton.enable(state.selectButton);
    formButton.enable(state.uploadButton);
    checkBox.disabled = false;
    formMsg.showError(state.uploadMsgParent, state.facePlus.shortMsg(tasks.detect.getErrorMsg()));
  }

  /* the first request to the face++ service, called every time
  the upload button is clicked */
  function detect() {
    var photo = state.photoPicker.getPhotob64();
    var loader = newElements.createLoader('images/loader.gif');
    formMsg.showElement(state.uploadMsgParent, loader);
    formInput.disable(username);
    formButton.disable(state.selectButton);
    formButton.disable(state.uploadButton);
    checkBox.disabled = true;
    tasks.detect = state.facePlus.detect(photo, detectSuccess, detectFail);
  }

  /* called every time the select photo button is clicked */
  function pickNewImage() {

    /* pass a callback that will be called in case:
    1) The selected photo is not an accepted format
    2) The selected photo is loaded on the DOM */
    state.photoPicker.click(function(){
      formMsg.clear(state.uploadMsgParent);
      var photo = state.photoPicker.getPhotob64();
      if (photo) {
        formButton.enable(state.uploadButton);
      }
    });
  }

  /* called every time user clicks the checkbox/label */
  function toggleControl() {

    /* initialize the photo section once */
    if (!state.photoSection) {
      state.facePlus = new FaceAPI();
      state.photoSection = newElements.createSignUpPhotoSection();
      photoSectionParent.appendChild(state.photoSection);
      state.selectButton = document.getElementById('signup-pick-photo-button');
      state.uploadButton = document.getElementById('signup-upload-photo-button');
      state.uploadButton.addEventListener('click', detect);
      state.uploadMsgParent = document.getElementById('signup-upload-photo-msg');
      state.photoParent = document.getElementById('signup-photo-parent');
      var fileInput = document.getElementById('file-input');
      state.photoPicker = new PhotoPicker(state.photoParent, fileInput);
      state.selectButton.addEventListener('click', pickNewImage);
      formButton.enable(state.selectButton);
    }

    /* toggle the visibility of the photo section */
    if (state.photoSectionVisible) {
      initphotoSection();
      photoSectionParent.removeChild(state.photoSection);
      state.photoSectionVisible = false;
    }
    else {
      photoSectionParent.appendChild(state.photoSection);
      state.photoSectionVisible = true;
    }
  }

  /* initializes the photo section. This happens when:
  1) user types a username
  2) user clicks the checkbox/label to hide the photo section */
  function initphotoSection() {
    formMsg.clear(state.uploadMsgParent);
    formButton.disable(state.uploadButton);
    formButton.enable(state.selectButton);
    state.photoPicker.clearPhoto();
  }

  /* check if username value permits to access the photo section.
  called every time user types in username box */
  function usernameCheck() {
    if (state.photoSectionVisible) {
      initphotoSection();
      photoSectionParent.removeChild(state.photoSection);
      state.photoSectionVisible = false;
      checkBox.checked = false;
    }
    checkBox.disabled = !usernameRegex.test(username.value);
  }

  var username = document.getElementById('signup-username');
  var checkBox = document.querySelector('#signup-photo-section input');
  var photoSectionParent = document.getElementById('signup-photo-section');
  var usernameRegex = new RegExp(username.pattern);

  username.addEventListener('input', usernameCheck);
  checkBox.addEventListener('click', toggleControl);

  if (checkBox.checked) { //firefox remembers its state when page is reloaded
    checkBox.checked = false;
  }
  if (usernameRegex.test(username.value)) {
    checkBox.disabled = false;
  }
};