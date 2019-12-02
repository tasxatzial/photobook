'use strict';

var newElements = (function NewElements() {

  function createMapButton() {
    var button = document.createElement('button');
    button.type = 'button';
    button.id = 'signup-show-map-button';
    button.innerHTML = 'Show map';
    button.className = 'sign-internal-button';
    return button;
  }

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

  function createSignInPhotoSection() {
    var section = document.createElement('div');
    section.id = 'signin-photo-section';
    section.className = 'sign-child';

    var photoContainer = document.createElement('div');
    photoContainer.id = 'signin-photo-parent';

    var uploadMsg = document.createElement('div');
    uploadMsg.className = 'sign-process-msg';

    section.appendChild(photoContainer);
    section.appendChild(uploadMsg);
    return section;
  }

  function createLoader(pathToFile) {
    var loader = document.createElement('img');
    loader.src = pathToFile;
    loader.className = 'loader';
    return loader;
  }

  function createSignBarButton(value, id) {
    var button = document.createElement('input');
    button.type = 'button';
    button.className = 'navbar-button';
    button.value = value;
    button.id = id;
    return button;
  }

  return {
    createMapButton: createMapButton,
    createSignInPhotoSection: createSignInPhotoSection,
    createSignUpPhotoSection: createSignUpPhotoSection,
    createLoader: createLoader,
    createSignBarButton: createSignBarButton
  };
}());