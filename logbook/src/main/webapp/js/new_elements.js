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

  function createInvalidValueMsg(text) {
    var msg = document.createElement('div');
    msg.innerHTML = text;
    msg.className = 'invalid-value';
    return msg;
  }

  function createAccountDetails(response, dataNames, skipEmpty) {
    var div = document.createElement('div');
    Object.keys(response).forEach(function(key, index) {
      if (skipEmpty !== true || response[key] !== '') {
        var msg = document.createElement('p');
        if (dataNames !== null) {
          msg.innerHTML = dataNames[key] + ': ';
        }
        else {
          msg.innerHTML = key + ': ';
        }
        msg.style.fontWeight = 'bold';
        msg.style.whiteSpace = 'nowrap';
        var span = document.createElement('span');
        span.innerHTML = response[key];
        span.style.fontWeight = 'normal';
        msg.appendChild(span);

        div.appendChild(msg);
      }
    });
    return div;
  }

  function createSelectPage(pages) {
    var select = document.createElement('select');
    var option = null;
    for (var i = 1; i <= pages; i++) {
      option = document.createElement('option');
      option.value = String(i);
      option.innerHTML = String(i);
      select.appendChild(option);
    }
    select.children[0].selected = true;

    var div = document.createElement('div');
    div.id = 'userlist-select';

    div.appendChild(select);
    return div;
  }

  function createImgButton(imageUrl, width) {
    var button = document.createElement('button');
    button.type = 'button';
    button.classList = "signin-photo-button next-button";
    button.style.width = width;
    var img = document.createElement('img');
    img.src = imageUrl;
    img.alt = "";
    button.appendChild(img);
    return button;
  }

  function createUserListContainer(pages) {
    if (!pages) {
      pages = 1;
    }
    var div = document.createElement('div');
    div.id = 'userlist-parent';

    var header = document.createElement('header');
    var headerH2 = document.createElement('h2');
    headerH2.innerHTML = 'Users';
    header.appendChild(headerH2);

    var listWithHeader = document.createElement('div');
    listWithHeader.appendChild(header);

    var prevButton = newElements.createImgButton('images/left.png', '3rem');
    var nextButton = newElements.createImgButton('images/right.png', '3rem');
    var selectPages = createSelectPage(pages);
    var buttonSection = document.createElement('div');
    buttonSection.id = 'userlist-nav';
    buttonSection.appendChild(prevButton);
    buttonSection.appendChild(selectPages);
    buttonSection.appendChild(nextButton);

    div.appendChild(listWithHeader);
    div.appendChild(buttonSection);
    return div;
  }

  return {
    createMapButton: createMapButton,
    createSignInPhotoSection: createSignInPhotoSection,
    createSignUpPhotoSection: createSignUpPhotoSection,
    createLoader: createLoader,
    createSignBarButton: createSignBarButton,
    createInvalidValueMsg: createInvalidValueMsg,
    createAccountDetails: createAccountDetails,
    createSelectPage: createSelectPage,
    createImgButton: createImgButton,
    createUserListContainer: createUserListContainer
  };
}());