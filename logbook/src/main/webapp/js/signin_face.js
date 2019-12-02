/*  face recognition control */
var signIn = function () {
  var state = {

    /* object that controls the select photo button and the display
    of the image on the DOM */
    photoPicker: null,

    /* face++ object */
    facePlus: null,

    uploadMsgParent: null,

    /* hidden photo section that appears when photo button is clicked */
    photoSection: null,

    photoSectionVisible: false
  };

  var tasks = {
    search: null,
    analyze: null
  };

  /* called after ajax request for analyze succeeds */
  function analyzeSuccess() {
    var emotion = tasks.analyze.getEmotion();
    if (emotion) {
      state.uploadMsgParent.innerHTML = state.facePlus.emotionReply(emotion);
    }
    else {
      formMsg.clear(state.uploadMsgParent);
    }
  }

  /* called after ajax request for analyze fails, error message
  can be ignored */
  function analyzePhotoFail() {
    formMsg.clear(state.uploadMsgParent);
  }

  /* the second call to face++ service.
  called after ajax request for search succeeds */
  function analyze() {
    var token = tasks.search.getToken();
    tasks.analyze = state.facePlus.analyze('emotion', token, analyzeSuccess, analyzePhotoFail);
  }

  /* called after ajax request for search succeeds */
  function searchPhotoSuccess() {
    formInput.enable(username);
    formButton.enable(photoButton);
    formSubmit.enable(submit);

    /* assume a person is identified when confidence > 75 */
    if (tasks.search.getConfidence() > 75) {
      username.value = tasks.search.getUserID();
      analyze();
    }
    else {
      username.value = '';
      formMsg.showError(state.uploadMsgParent, 'Nothing found');
    }
  }

  /* called after ajax request for search fails */
  function searchPhotoFail() {
    formInput.enable(username);
    formButton.enable(photoButton);
    formSubmit.enable(submit);
    formMsg.showError(state.uploadMsgParent, state.facePlus.shortMsg(tasks.search.getErrorMsg()));
  }

  /* called after the selected image has been displayed on the DOM */
  function postSelectPhoto() {
    var photo = state.photoPicker.getPhotob64();
    state.photoSectionVisible = true;
    form.insertBefore(state.photoSection, passwordParent);
    formMsg.clear(state.uploadMsgParent);
    if (photo) {
      var loader = newElements.createLoader('images/loader.gif');
      formMsg.showElement(state.uploadMsgParent, loader);
      formInput.disable(username);
      formButton.disable(photoButton);
      formSubmit.disable(submit);
      tasks.search = state.facePlus.search(photo, searchPhotoSuccess, searchPhotoFail);
    }
  }

  /* called each time user clicks the select photo button */
  function selectPhoto() {

    /* initialize once */
    if (!state.photoPicker) {
      state.photoSection = newElements.createSignInPhotoSection();
      var fileInput = document.getElementById('file-input');
      var photoParent = state.photoSection.childNodes[0];
      state.uploadMsgParent = state.photoSection.childNodes[1];
      state.facePlus = new FaceAPI();
      state.photoPicker = new PhotoPicker(photoParent, fileInput);
    }

    /* pass postSelectPhoto() to photoPicker click function so that it
    is called after the DOM has finished loading the selected image */
    state.photoPicker.click(postSelectPhoto);
  }

  /* removes the hidden photo section if user types and a previous photo
  has been used */
  function resetPhotoSection() {
    if (state.photoSectionVisible) {
      state.photoSectionVisible = false;
      form.removeChild(state.photoSection);
      formMsg.clear(state.uploadMsgParent);
      state.photoPicker.clearPhoto();
    }
  }

  var username = document.getElementById('signin-username');
  var passwordParent = document.getElementById('signin-password-parent');
  var form = document.getElementById('signin');
  var photoButton = document.getElementById('signin-photo-button');
  var submit = document.querySelector('#signin-button input');

  formButton.enable(photoButton);
  photoButton.addEventListener('click', selectPhoto);
  username.addEventListener('input', resetPhotoSection);
};