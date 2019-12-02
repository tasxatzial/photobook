'use strict';

/* Prompts the user with a file select dialog. Reads the selected file
and if it is a jpg/png image, it displays it on the DOM.

Accepts an input type element and an empty container that will be used
for displaying the image. To trigger the file selection
dialog, the click() method must be called with an argument
that is the function that will be called when the image
has finished loading on the DOM */
var PhotoPicker = function(photoContainer, fileInput) {
  var state = {
    photob64: null,
    callback: null
  };

  function click(callback) {
    state.callback = callback;
    fileInput.click();
  }

  /* only png/jpg files are valid */
  function isValidImage(photo) {
    var type = photo.split(',')[0];
    var png = /data:image\/png/;
    var jpeg = /data:image\/jpeg/;
    var jpg = /data:image\/jpg/;
    return png.test(type) || jpeg.test(type) || jpg.test(type);
  }

  /* read and draw the specified file inside the photoContainer */
  function displayImage(file) {
    
    /* read the selected file as base64 */
    var reader = new FileReader();
    reader.readAsDataURL(file,'UTF-8');

    /* fires when reading is done */
    reader.onload = function(event) {
      state.photob64 = event.target.result;

      /* only png/jpg files will be displayed */
      if (!isValidImage(state.photob64.split(',')[0])) {
        photoContainer.innerHTML = 'Invalid format';
        state.photob64 = null;
        state.callback();
        return;
      }

      /* create the image element and add it to DOM */
      var img = document.createElement('img');
      photoContainer.innerHTML = '';
      photoContainer.appendChild(img);

      /* fires after the image has been added to the DOM */
      img.onload = function() {
        state.callback();
      };

      /* specifying the src must be done after defining the onload event */
      img.src = state.photob64;
    };
  }


  function getPhotob64() {
    return state.photob64;
  }

  function clearPhoto() {
    state.photob64 = null;
    photoContainer.innerHTML = '';
  }

  (function init() {

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

    /* fires when a file is selected */
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
    getPhotob64: getPhotob64
  };
};