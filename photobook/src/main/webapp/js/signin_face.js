'use strict';

/**
 * Functions related to the face recognition on the signin page.
 * @type {{init: init}}
 */
var SignInFace = (function () {
  var tasks = null;
  var state = null;
  var el = null;

  function runInit() {
    tasks = {
      search: null,
      analyze: null
    };
    state = {
      photoSectionVisible: false
    };
    el = {
      /* object that controls the select photo button and the display of the image on the DOM */
      photoPicker: null,

      /* photo section that appears when photo button is clicked */
      photoSection: null,

      username: null,
      password: null,
      passwordParent: null,
      form: null,
      photoButton: null,
      submit: null,
      uploadPhotoButton: null,
      uploadMsgParent: null,
      signinMsg: null,
    };
  }

  /**
   * Called after the request for analyze emotion has detected an emotion with confidence > 80.
   */
  function analyzeSuccess() {
    var emotion = tasks.analyze.getEmotion();
    if (emotion) {
      el.uploadMsgParent.innerHTML = FaceAPI.emotionReply(emotion);
    }
    else {
      formMsg.clear(el.uploadMsgParent);
    }
  }

  /**
   * Called after the request for analyze emotion has not detected any emotion with confidence > 80
   * (error message can be ignored).
   */
  function analyzePhotoFail() {
    formMsg.clear(el.uploadMsgParent);
  }

  /**
   * Analyzes the emotion of a face token, called only if the search face has succeeded.
   */
  function analyze() {
    var token = tasks.search.getToken();
    tasks.analyze = FaceAPI.analyze('emotion', token, analyzeSuccess, analyzePhotoFail);
  }

  /**
   * Called after the request for search face returned a face token.
   */
  function searchPhotoSuccess() {
    formInput.enable(el.username);
    formButton.enable(el.photoButton);
    formSubmit.enable(el.submit);

    /* assume a person is identified when confidence > 75 */
    if (tasks.search.getConfidence() > 75) {
      el.username.value = tasks.search.getUserID();
      analyze();
    }
    else {
      formMsg.showError(el.uploadMsgParent, 'Nothing found');
    }
  }

  /**
   * Called after the request for search face did not find a face.
   */
  function searchPhotoFail() {
    formInput.enable(el.username);
    formButton.enable(el.photoButton);
    formSubmit.enable(el.submit);
    formButton.enable(el.uploadPhotoButton);
    formMsg.showError(el.uploadMsgParent, FaceAPI.shortMsg(tasks.search.getErrorMsg()));
  }

  /**
   * Called each time the user clicks the select image button.
   */
  function selectPhoto() {

    /* trigger the click and pass postSelectPhoto() to photoPicker click function so that it
    is called after the image has finished loading */
    el.photoPicker.click(function () {
      createSignInPhotoSection();
      if (!el.photoPicker.getPhotob64()) {
        formButton.disable(el.uploadPhotoButton);
      }
      else {
        formButton.enable(el.uploadPhotoButton);
      }
    });
  }

  function uploadPhoto(photo) {
    if (photo) {
      formMsg.showElement(el.uploadMsgParent, Init.loader);
      formInput.disable(el.username);
      formButton.disable(el.photoButton);
      formSubmit.disable(el.submit);
      formButton.disable(el.uploadPhotoButton);
      el.username.value = '';
      el.password.value = '';
      tasks.search = FaceAPI.search(photo, searchPhotoSuccess, searchPhotoFail);
    }
  }

  /**
   * Creates all the elements that appear on the page after the user has selected an image.
   * @returns {HTMLDivElement}
   */
  function createSignInPhotoSection() {
    if (el.uploadPhotoButton) {
      el.photoSection.removeChild(el.uploadPhotoButton);
      el.photoSection.removeChild(el.uploadMsgParent);
    }

    el.uploadMsgParent = document.createElement('div');
    el.uploadMsgParent.className = 'sign-process-msg';

    el.uploadPhotoButton = document.createElement('button');
    el.uploadPhotoButton.innerHTML = 'Upload';
    el.uploadPhotoButton.className = 'sign-internal-button';
    el.uploadPhotoButton.id = 'signin-upload-button';
    el.uploadPhotoButton.addEventListener('click', function () {
      var photo = el.photoPicker.getPhotob64();
      uploadPhoto(photo);
    });
    formButton.enable(el.uploadPhotoButton);

    el.photoSection.appendChild(el.uploadPhotoButton);
    el.photoSection.appendChild(el.uploadMsgParent);
    el.photoSection.classList.add('display-flex');
  }

  /**
   * Signin form initializations.
   */
  function init() {
    el.username = document.getElementById('signin-username');
    el.password = document.getElementById('signin-password');
    el.passwordParent = document.getElementById('signin-password-parent');
    el.form = document.getElementById('signin-content');
    el.photoButton = document.getElementsByClassName('signin-photo-button')[0];
    el.submit = document.querySelector('#signin-button button');
    el.signinMsg = document.getElementById('signin-process-msg');
    el.photoSection = document.getElementById('signin-photo-section');
    el.photoContainer = document.getElementById('signin-photo-parent');
    el.fileInput = document.getElementById('file-input');
    el.photoPicker = new PhotoPicker(el.photoSection.children[0], el.fileInput);
    el.uploadMsgParent = null;
    el.uploadPhotoButton = null;

    formButton.enable(el.photoButton);
    el.photoButton.addEventListener('click', selectPhoto);
    el.username.addEventListener('input', function () {
      if (el.uploadPhotoButton) {
        el.photoSection.removeChild(el.uploadPhotoButton);
        el.photoSection.removeChild(el.uploadMsgParent);
        el.uploadPhotoButton = null;
        el.uploadMsgParent = null;
        el.photoContainer.innerHTML = '';
        el.photoSection.classList.remove('display-flex');
      }
    });
  }
  
  return {
    init: init,
    runInit: runInit
  };
}());