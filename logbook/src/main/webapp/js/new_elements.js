'use strict';

/**
 * The methods of this object are used to create some of the HTML elements.
 * @type {{
 * createLoader: (function(*): HTMLImageElement),
 * createGearButton: (function(*=): HTMLButtonElement),
 * createFullWindowButton: (function(*): HTMLButtonElement),
 * showFullWindowMsg: showFullWindowMsg,
 * createFullWindow: (function(*): HTMLDivElement),
 * createSignBarButton: (function(*, *, *=): HTMLButtonElement),
 * createCloseButton: (function(*=): HTMLButtonElement),
 * createSignupSummary: (function(*, *): HTMLDivElement),
 * createYesNoButtons: (function(*): HTMLDivElement),
 * createBlueButton: (function(*, *): HTMLDivElement),
 * createKeyValue: (function(*, *=, *=): HTMLParagraphElement),
 * createArrowButton: (function(*): HTMLButtonElement),
 * createSelectPage: (function(*, *): HTMLDivElement)
 * }}
 */
var newElements = (function NewElements() {

  /**
   * Returns a distinct large blue button.
   * @param value The text of the button element
   * @param id The id of the returned element
   * @returns {HTMLDivElement}
   */
  function createBlueButton(value, id) {
    var div = document.createElement('div');
    div.className = 'sign-button';
    div.id = id;

    var input = document.createElement('input');
    input.type = 'button';
    input.value = value;

    div.appendChild(input);

    return div;
  }

  /**
   * Creates a spinning loader.
   * @param pathToFile
   * @returns {HTMLImageElement}
   */
  function createLoader(pathToFile) {
    var loader = document.createElement('img');
    loader.src = pathToFile;
    loader.className = 'loader';

    return loader;
  }

  /**
   * Creates a button for the top navigation bar.
   * @param value The text of the button element
   * @param id The id of the button element
   * @param pathToFile The path to the image shown next to the button text
   * @returns {HTMLButtonElement}
   */
  function createSignBarButton(value, id, pathToFile) {
    var button = document.createElement('button');
    button.className = 'navbar-button';
    button.id = id;

    var cont = document.createElement('div');
    cont.className = 'test-div';
    if (pathToFile) {
      var img = document.createElement('img');
      img.src = pathToFile;
      img.className = 'option-button';
      cont.appendChild(img);
    }

    var div = document.createElement('div');
    div.className = 'navbar-button-text';
    div.innerHTML = value;
    cont.appendChild(div);
    button.appendChild(cont);
    return button;
  }

  /**
   * Creates an element from the specified key/value. The element looks like:
   * Key (bold font): value (normal font)
   * @param key
   * @param value
   * @param append
   * @returns {HTMLParagraphElement}
   */
  function createKeyValue(key, value, append) {
    var span = document.createElement('span');
    if (append) {
      span.innerHTML = '';
      span.appendChild(value);
    }
    else {
      span.innerHTML = value;
    }
    span.className = 'normal-font-weight';

    var msg = document.createElement('p');
    msg.innerHTML = key + ': ';
    msg.className = 'bold-font-weight';
    msg.appendChild(span);

    return msg;
  }

  /**
   * Creates the element that shows a summary of the info that the user entered during signup.
   * @param response A server response, that is an object that contains the info
   * @param dataNames An array that maps the response keys to human readable text
   * @returns {HTMLDivElement}
   */
  function createSignupSummary(response, dataNames) {
    var div = document.createElement('div');
    for (var i = 0; i < dataNames.length; i++) {
      if (response[dataNames[i][0]] !== undefined) {
        var msg = createKeyValue(dataNames[i][1], response[dataNames[i][0]]);
        div.appendChild(msg);
      }
    }
    return div;
  }

  /**
   * Creates a dropdown element that selects a page.
   * @param pages The total number of pages
   * @param id The id of the returned element
   * @returns {HTMLDivElement}
   */
  function createSelectPage(pages, id) {
    var select = document.createElement('select');
    select.className = "sign-tofill";

    var option = null;
    for (var i = 1; i <= pages; i++) {
      option = document.createElement('option');
      option.value = String(i);
      option.innerHTML = String(i);
      select.appendChild(option);
    }
    select.children[0].selected = true;

    var div = document.createElement('div');
    div.id = id;
    div.appendChild(select);

    return div;
  }

  /**
   * Creates a button that shows an arrow image.
   * @param imageUrl The src attribute of the arrow image
   * @returns {HTMLButtonElement}
   */
  function createArrowButton(imageUrl) {
    var img = document.createElement('img');
    img.src = imageUrl;
    img.alt = "";

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'transparent-button';
    button.appendChild(img);

    return button;
  }

  /**
   * Creates an element that shows a yes/no button.
   * @param id The id of the returned element
   * @returns {HTMLDivElement}
   */
  function createYesNoButtons(id) {
    var yesButton = document.createElement('button');
    yesButton.innerHTML = 'Yes';
    yesButton.className = 'yes-no-button';
    yesButton.id = id + '-yes-button';
    formButton.enable(yesButton);

    var noButton = document.createElement('button');
    noButton.innerHTML = 'No';
    noButton.className = 'yes-no-button';
    noButton.id = id + '-no-button';
    formButton.enable(noButton);

    var text = document.createElement('div');
    text.innerHTML = 'Please confirm';
    text.id = id + '-text';

    var div = document.createElement('div');
    div.id = id;

    div.appendChild(text);
    div.appendChild(yesButton);
    div.appendChild(noButton);

    return div;
  }

  function createOptionButton(id) {
    var img = document.createElement('img');

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'transparent-button option-button';
    button.id = id;
    button.appendChild(img);

    return button;
  }

  /**
   * Creates a button that shows a gear icon.
   * @param id
   * @returns {HTMLButtonElement}
   */
  function createGearButton(id) {
    var button = createOptionButton(id);
    button.children[0].src = "images/settings.svg";
    button.children[0].alt = "Options";

    return button;
  }

  /**
   * Creates a button that shows a X (close) icon.
   * @param id
   * @returns {HTMLButtonElement}
   */
  function createCloseButton(id) {
    var button = createOptionButton(id);
    button.children[0].src = "images/close.svg";
    button.children[0].alt = "Remove";

    return button;
  }

  /**
   * Creates an element that has dimensions equal to the viewport dimensions.
   * @param text The text of the element
   * @returns {HTMLDivElement}
   */
  function createFullWindow(text) {
    var expired = document.createElement('div');
    expired.id = 'full-screen';

    var expiredMsg = document.createElement('p');
    expiredMsg.innerHTML = text;

    var expiredWindow = document.createElement('div');
    expiredWindow.id = 'full-window';
    expired.appendChild(expiredWindow);

    expiredWindow.appendChild(expiredMsg);

    return expired;
  }

  /**
   * Creates a button that is contained in the element returned by createFullWindow().
   * @param text The text of the button element
   * @returns {HTMLButtonElement}
   */
  function createFullWindowButton(text) {
    var button = document.createElement('button');
    button.innerHTML = text;
    button.id = 'full-window-button';
    formButton.enable(button);

    return button;
  }

  /**
   * Appends the element returned by createFullWindow() to the body element. This
   * essentially blocks the user interaction with every other element.
   * @param buttonText The text of the button element
   * @param text The text of the element returned by createFullWindow()
   * @param callback The function that will be called when the button is clicked
   */
  function showFullWindowMsg(buttonText, text, callback) {
    var button = newElements.createFullWindowButton(buttonText);

    if (callback) {
      button.addEventListener('click', callback);
    }

    var msg = newElements.createFullWindow(text);
    msg.children[0].appendChild(button);

    var body = document.getElementsByTagName('body')[0];
    body.id = 'full-body';
    document.getElementsByTagName('body')[0].appendChild(msg);
  }

  return {
    createLoader: createLoader,
    createSignBarButton: createSignBarButton,
    createSignupSummary: createSignupSummary,
    createYesNoButtons: createYesNoButtons,
    createBlueButton: createBlueButton,
    createArrowButton: createArrowButton,
    createSelectPage: createSelectPage,
    createKeyValue: createKeyValue,
    createGearButton: createGearButton,
    createCloseButton: createCloseButton,
    createFullWindow: createFullWindow,
    createFullWindowButton: createFullWindowButton,
    showFullWindowMsg: showFullWindowMsg
  };
}());