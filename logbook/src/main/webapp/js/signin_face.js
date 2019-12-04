'use strict';

/*  face recognition control */
var SignInFace = (function () {

  var tasks = {
    search: null,
    analyze: null
  };

  var el = {
    /* object that controls the select photo button and the display of the image on the DOM */
    photoPicker: null,

    uploadMsgParent: null,

    /* hidden photo section that appears when photo button is clicked */
    photoSection: null,

    photoSectionVisible: false,

    username: null,
    passwordParent: null,
    form: null,
    photoButton: null,
    submit: null
  };
  
  /* called after ajax request for analyze succeeds */
  function analyzeSuccess() {
    var emotion = tasks.analyze.getEmotion();
    if (emotion) {
      el.uploadMsgParent.innerHTML = FaceAPI.emotionReply(emotion);
    }
    else {
      formMsg.clear(el.uploadMsgParent);
    }
  }

  /* called after ajax request for analyze fails, error message
  can be ignored */
  function analyzePhotoFail() {
    formMsg.clear(el.uploadMsgParent);
  }

  /* the second call to face++ service.
  called after ajax request for search succeeds */
  function analyze() {
    var token = tasks.search.getToken();
    tasks.analyze = FaceAPI.analyze('emotion', token, analyzeSuccess, analyzePhotoFail);
  }

  /* called after ajax request for search succeeds */
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

  /* called after ajax request for search fails */
  function searchPhotoFail() {
    formInput.enable(el.username);
    formButton.enable(el.photoButton);
    formSubmit.enable(el.submit);
    formMsg.showError(el.uploadMsgParent, FaceAPI.shortMsg(tasks.search.getErrorMsg()));
  }

  /* called after the selected image has been displayed on the DOM */
  function postSelectPhoto() {
    var photo = el.photoPicker.getPhotob64();
    el.photoSectionVisible = true;
    el.form.insertBefore(el.photoSection, el.passwordParent);
    formMsg.clear(el.uploadMsgParent);
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

  /* called each time user clicks the select photo button */
  function selectPhoto() {

    /* initialize once */
    if (!el.photoPicker) {
      el.photoSection = newElements.createSignInPhotoSection();
      var fileInput = document.getElementById('file-input');
      var photoParent = el.photoSection.childNodes[0];
      el.uploadMsgParent = el.photoSection.childNodes[1];
      el.photoPicker = new PhotoPicker(photoParent, fileInput);
    }

    /* pass postSelectPhoto() to photoPicker click function so that it
    is called after the DOM has finished loading the selected image */
    el.photoPicker.click(postSelectPhoto);
  }

  /* removes the hidden photo section if user types and a previous photo
  has been used */
  function resetPhotoSection() {
    if (el.photoSectionVisible) {
      el.photoSectionVisible = false;
      el.form.removeChild(el.photoSection);
      formMsg.clear(el.uploadMsgParent);
      el.photoPicker.clearPhoto();
    }
  }

  function init() {
    el.username = document.getElementById('signin-username');
    el.password = document.getElementById('signin-password');
    el.passwordParent = document.getElementById('signin-password-parent');
    el.form = document.getElementById('signin-content');
    el.photoButton = document.getElementsByClassName('signin-photo-button')[0];
    el.submit = document.querySelector('#signin-button input');

    formButton.enable(el.photoButton);
    el.photoButton.addEventListener('click', selectPhoto);
    el.username.addEventListener('input', resetPhotoSection);
  }
  
  return {
    init: init
  };
}());