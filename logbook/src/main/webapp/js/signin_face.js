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
    submit: null,
    uploadPhotoButton: null
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
    formButton.enable(el.uploadPhotoButton);
    formMsg.showError(el.uploadMsgParent, FaceAPI.shortMsg(tasks.search.getErrorMsg()));
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
      el.uploadPhotoButton = el.photoSection.childNodes[1];
      el.uploadMsgParent = el.photoSection.childNodes[2];
      el.photoPicker = new PhotoPicker(photoParent, fileInput);
    }

    /* trigger the click and pass postSelectPhoto() to photoPicker click function so that it
    is called after the image has finished loading */
    el.photoPicker.click(function () {
        state.photoSectionVisible = true;
        if (!el.photoPicker.getPhotob64()) {
          formButton.disable(el.uploadPhotoButton);
        }
        else {
          formButton.enable(el.uploadPhotoButton);
        }
        formMsg.clear(el.uploadMsgParent);
        formMsg.clear(el.signinMsg);
        el.form.insertBefore(el.photoSection, el.passwordParent);
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
   * Removes everything in the image section (triggered by the user typing a username).
   */
  function resetPhotoSection() {
    if (state.photoSectionVisible) {
      state.photoSectionVisible = false;
      el.form.removeChild(el.photoSection);
      formMsg.clear(el.uploadMsgParent);
      formButton.enable(el.uploadPhotoButton);
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

    var uploadPhotoButton = document.createElement('button');
    uploadPhotoButton.innerHTML = 'Upload';
    uploadPhotoButton.className = 'sign-internal-button';
    uploadPhotoButton.id = 'signin-upload-button';
    uploadPhotoButton.addEventListener('click', function () {
      var photo = el.photoPicker.getPhotob64();
      uploadPhoto(photo);
    });
    formButton.enable(uploadPhotoButton);

    var section = document.createElement('div');
    section.id = 'signin-photo-section';
    section.className = 'sign-child';
    section.appendChild(photoContainer);
    section.appendChild(uploadPhotoButton);
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
    el.submit = document.querySelector('#signin-button button');
    el.signinMsg = document.getElementById('signin-process-msg');
    el.photoPicker = null;

    state.photoSectionVisible = false;
    formButton.enable(el.photoButton);
    el.photoButton.addEventListener('click', selectPhoto);
    el.username.addEventListener('input', resetPhotoSection);
  }
  
  return {
    init: init
  };
}());