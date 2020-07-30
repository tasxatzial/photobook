'use strict';

/**
 * Functions related to the face recognition on the signin page.
 * @type {{init: init}}
 */
var SignInFace = (function () {
  var tasks = {
    search: null,
    analyze: null
  };

  var state = {
    photoSectionVisible: false
  };
  
  var el = {
    /* object that controls the select photo button and the display of the image on the DOM */
    photoPicker: null,

    uploadMsgParent: null,
    signinMsg: null,

    /* hidden photo section that appears when photo button is clicked */
    photoSection: null,

    username: null,
    password: null,
    passwordParent: null,
    form: null,
    photoButton: null,
    submit: null
  };

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
    formMsg.showError(el.uploadMsgParent, FaceAPI.shortMsg(tasks.search.getErrorMsg()));
  }

  /**
   * Called after the selected image has finished loading. Then a request to the face++ search face
   * service is triggered.
   */
  function postSelectPhoto() {
    var photo = el.photoPicker.getPhotob64();
    state.photoSectionVisible = true;
    el.form.insertBefore(el.photoSection, el.passwordParent);
    formMsg.clear(el.uploadMsgParent);
    formMsg.clear(el.signinMsg);
    if (photo) {
      var loader = newElements.createLoader('images/loader.gif');
      formMsg.showElement(el.uploadMsgParent, loader);
      formInput.disable(el.username);
      formButton.disable(el.photoButton);
      formSubmit.disable(el.submit);
      el.username.value = '';
      el.password.value = '';
      tasks.search = FaceAPI.search(photo, searchPhotoSuccess, searchPhotoFail);
    }
  }

  /**
   * Called each time the user clicks the select image button.
   */
  function selectPhoto() {

    /* initialize once */
    if (!el.photoPicker) {
      el.photoSection = createSignInPhotoSection();
      var fileInput = document.getElementById('file-input');
      var photoParent = el.photoSection.childNodes[0];
      el.uploadMsgParent = el.photoSection.childNodes[1];
      el.photoPicker = new PhotoPicker(photoParent, fileInput);
    }

    /* trigger the click and pass postSelectPhoto() to photoPicker click function so that it
    is called after the image has finished loading */
    el.photoPicker.click(postSelectPhoto);
  }

  /**
   * Removes everything in the image section (triggered by the user typing a username).
   */
  function resetPhotoSection() {
    if (state.photoSectionVisible) {
      state.photoSectionVisible = false;
      el.form.removeChild(el.photoSection);
      formMsg.clear(el.uploadMsgParent);
      el.photoPicker.clearPhoto();
    }
  }

  /**
   * Creates all the elements that appear on the page after the user has selected an image.
   * @returns {HTMLDivElement}
   */
  function createSignInPhotoSection() {
    var photoContainer = document.createElement('div');
    photoContainer.id = 'signin-photo-parent';

    var uploadMsg = document.createElement('div');
    uploadMsg.className = 'sign-process-msg';

    var section = document.createElement('div');
    section.id = 'signin-photo-section';
    section.className = 'sign-child';
    section.appendChild(photoContainer);
    section.appendChild(uploadMsg);

    return section;
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
    el.submit = document.querySelector('#signin-button input');
    el.signinMsg = document.getElementById('sign-process-msg');
    el.photoSection = null;
    el.uploadMsgParent = null;

    state.photoSectionVisible = false;
    formButton.enable(el.photoButton);
    el.photoButton.addEventListener('click', selectPhoto);
    el.username.addEventListener('input', resetPhotoSection);
  }
  
  return {
    init: init
  };
}());