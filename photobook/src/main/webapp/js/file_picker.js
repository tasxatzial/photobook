'use strict';

/**
 * Prompts the user with a file select dialog. Reads the selected file
   and if it is a jpg/png image, it displays it on the DOM.

   Accepts an input type element and an empty container that will be used for displaying the image.
   To trigger the file selection dialog, the click() method must be called with an argument
   that is the function that will be called when the image has finished loading.
 * @param photoContainer
 * @param fileInput
 * @returns {{getPhotob64: (function(): null), clearPhoto: clearPhoto, click: click}}
 * @constructor
 */
function PhotoPicker(photoContainer, fileInput) {
  var state = {
    photob64: null,
    callback: null
  };

  /**
   * Called after the image has finished loading.
   * @param callback
   */
  function click(callback) {
    if (typeof callback === 'function') {
      state.callback = callback;
    }
    fileInput.click();
  }

  /**
   * Checks whether the specified photo is valid (png/jpg files are valid). The photo should be in base64 format.
   * @param photo
   * @returns {boolean}
   */
  function isValidImage(photo) {
    var type = photo.split(',')[0];
    var png = /data:image\/png/;
    var jpeg = /data:image\/jpeg/;
    var jpg = /data:image\/jpg/;
    return png.test(type) || jpeg.test(type) || jpg.test(type);
  }

  /**
   * Reads the specified image file and puts it inside the photoContainer element.
   * @param file
   */
  function displayImage(file) {
    
    /* read the selected image and store it in base64 format */
    var reader = new FileReader();
    reader.readAsDataURL(file);

    /* called when reading of the image is finished */
    reader.onload = function(event) {
      state.photob64 = event.target.result;

      /* we want to accept only png/jpg files */
      if (!isValidImage(state.photob64.split(',')[0])) {
        photoContainer.innerHTML = 'Invalid format';
        state.photob64 = null;
        if (state.callback) {
          state.callback();
        }
        return;
      }

      /* create the image element and add it to the DOM */
      var img = document.createElement('img');
      photoContainer.innerHTML = '';
      photoContainer.appendChild(img);

      /* fires after the image has been added to the DOM */
      img.onload = function() {
        if (state.callback) {
          state.callback();
        }
      };

      /* specifying the src must be done after defining the onload event */
      img.src = state.photob64;
    };
  }

  /**
   * Returns the base64 representation of the selected image.
   * @returns {null}
   */
  function getPhotob64() {
    return state.photob64;
  }

  /**
   * Removes the photo from the DOM.
   */
  function clearPhoto() {
    state.photob64 = null;
    photoContainer.innerHTML = '';
  }

  (function init() {
    state.photob64 = null;
    state.callback = null;

    /* necessary so that the onchange event fires if the same
    file is selected twice in a row. This is necessary in the following scenario:
    1) There is an image visible in the photo section.
    2) User types something -> photo section is now hidden.
    3) User selects the same image again.
    If we do not reset the value when user clicks the select photo button,
    the onchange event won't fire, therefore the image won't be displayed */
    fileInput.onclick = function() {
      this.value = null; 
    };

    /* called when a file is selected */
    fileInput.onchange = function(event) {
      var file = event.target.files[0];
      if (file) { //when OK is pressed
        displayImage(file);
      }
    };
  }());

  return {
    clearPhoto: clearPhoto,
    click: click,
    getPhotob64: getPhotob64,
  };
}