'use strict';

/**
 * Functions related to the face recognition on the signup page.
 * @type {{init: init}}
 */
var SignUpFace = (function () {
  var state = null;
  var tasks = null;
  var el = null;

  function runInit() {
    state = {
      photoSectionVisible: false,

      /* class that controls the select photo button and the display of the image */
      photoPicker: null,

      /* true when setID or addFace fail */
      fail: false,

      /* true when setID or addFace finish (either fail or succeed) */
      ended: false
    };
    tasks = {
      detect: null,
      setID: null,
      addFace: null
    };
    el = {
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
  }

  /**
   * Called from faceAPI.js success callback functions of setID/addFace.
   * Will return immediately if:
   * 1) the other task (addFace/setID) has failed thus the result of photo uploading is already determined.
   * 2) the other task (addFace/setID) is not finished thus the result of photo uploading will be
   * determined by that task.
   */
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

  /**
   * Called from faceAPI.js fail callback functions of setID/addFace.
   * Will return immediately if the task that called it (setID/addFace) is not the first task that failed, that means
   * the first task that failed already determined the result of the photo uploading.
   * @param errMsg The error message provided by setID/addFace fail callback functions.
   */
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

  /**
   * Called when a face is detected in the uploaded photo. It then calls setID & addFace from faceAPI.js,
   each will make a new face++ request.
   */
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

  /**
   * Called when no face is detected in the uploaded photo.
   */
  function detectFail() {
    formInput.enable(el.username);
    formButton.enable(el.selectButton);
    formButton.enable(el.uploadButton);
    el.checkBox.disabled = false;
    formMsg.showError(el.uploadMsgParent, FaceAPI.shortMsg(tasks.detect.getErrorMsg()));
  }

  /**
   * The first request to the face++ service (detect face). It is called every time
   the upload button is clicked.
   */
  function detect() {
    var photo = state.photoPicker.getPhotob64();
    formMsg.showElement(el.uploadMsgParent, Init.loader);
    formInput.disable(el.username);
    formButton.disable(el.selectButton);
    formButton.disable(el.uploadButton);
    el.checkBox.disabled = true;
    Requests.cancelExcept(null);
    tasks.detect = FaceAPI.detect(photo, detectSuccess, detectFail);
  }

  /**
   * Triggers the file selection tool. Called every time the select photo button is clicked.
   */
  function pickNewImage() {

    /* pass a callback that will be called when:
    1) The selected photo is not an accepted format.
    2) The selected photo is loaded successfully. */
    state.photoPicker.click(function(){
      formMsg.clear(el.uploadMsgParent);
      var photo = state.photoPicker.getPhotob64();
      if (photo) {
        formButton.enable(el.uploadButton);
      }
    });
  }

  /**
   * Toggles the visibility of the photo section each time the user clicks the checkbox.
   */
  function toggleControl() {

    /* initialize the photo section once */
    if (!el.photoSection) {
      el.photoSection = createSignUpPhotoSection();
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

  /**
   * Initializes (hides) the photo section. This happens when:
   * 1) The username field is changed.
   * 2) The user clicks the checkbox and the photo section is already visible.
   */
  function initphotoSection() {
    formMsg.clear(el.uploadMsgParent);
    formButton.disable(el.uploadButton);
    formButton.enable(el.selectButton);
    state.photoPicker.clearPhoto();
  }

  /**
   * Checks if the username pattern permits to associate it with a face. If yes, the checkbox is enabled.
   * If no, the photo section is removed from DOM and the checkbox is disabled.
   * This function is called every time the username input field is changed.
   * @param usernameRegex
   */
  function usernameCheck(usernameRegex) {
    if (state.photoSectionVisible) {
      initphotoSection();
      el.photoSectionParent.removeChild(el.photoSection);
      state.photoSectionVisible = false;
      el.checkBox.checked = false;
    }
    el.checkBox.disabled = !usernameRegex.test(el.username.value);
  }

  /**
   * Creates all the elements that appear in the photo section after the checkbox has been clicked (checked = true).
   * @returns {HTMLDivElement}
   */
  function createSignUpPhotoSection() {
    var selectButton = document.createElement('button');
    selectButton.id = 'signup-pick-photo-button';
    selectButton.disabled = true;
    selectButton.type = 'button';
    selectButton.className = 'sign-internal-button';
    selectButton.innerHTML = 'Choose photo';

    var input = document.createElement('input');
    input.id = 'file-input';
    input.type = 'file';
    input.name = 'name';
    input.style.display = 'none';

    var uploadButton = document.createElement('button');
    uploadButton.id = 'signup-upload-photo-button';
    uploadButton.disabled = true;
    uploadButton.type = 'button';
    uploadButton.innerHTML = 'Upload photo';
    uploadButton.className = 'sign-internal-button';

    var divButtons = document.createElement('div');
    divButtons.id = 'signup-photo-control-buttons';
    divButtons.appendChild(selectButton);
    divButtons.appendChild(input);
    divButtons.appendChild(uploadButton);

    var uploadMsg = document.createElement('div');
    uploadMsg.id = 'signup-upload-photo-msg';
    uploadMsg.className="sign-process-msg";

    var controls = document.createElement('div');
    controls.id = 'signup-photo-controls';
    controls.appendChild(divButtons);
    controls.appendChild(uploadMsg);

    var divPhoto = document.createElement('div');
    divPhoto.id = 'signup-photo-parent';

    var divContent = document.createElement('div');
    divContent.id = 'signup-photo-section-hidden';
    divContent.appendChild(controls);
    divContent.appendChild(divPhoto);
    return divContent;
  }

  /**
   * Initializations after the signup form has loaded.
   */
  function init() {
    state.photoSectionVisible = false;
    el.username = document.getElementById('signup-username');
    el.checkBox = document.querySelector('#signup-photo-section input');
    el.photoSectionParent = document.getElementById('signup-photo-section');
    el.photoSection = null;
    el.uploadMsgParent = null;
    el.uploadButton = null;
    el.photoParent = null;
    el.selectButton = null;
    var usernameRegex = new RegExp(el.username.pattern);

    el.username.addEventListener('input', function () {
      usernameCheck(usernameRegex);
    });
    el.checkBox.addEventListener('click', toggleControl);

    /* uncheck the checkbox on the page. This is due to browsers remembering its state when the page is reloaded */
    if (el.checkBox.checked) {
      el.checkBox.checked = false;
    }
    if (usernameRegex.test(el.username.value)) {
      el.checkBox.disabled = false;
    }
  }
  
  return {
    init: init,
    runInit: runInit
  };
}());