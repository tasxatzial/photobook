'use strict';

var newElements = (function NewElements() {

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

  function createLoader(pathToFile) {
    var loader = document.createElement('img');
    loader.src = pathToFile;
    loader.className = 'loader';

    return loader;
  }

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

  function createGearButton(id) {
    var button = createOptionButton(id);
    button.children[0].src = "images/settings.svg";
    button.children[0].alt = "Options";

    return button;
  }

  function createCloseButton(id) {
    var button = createOptionButton(id);
    button.children[0].src = "images/close.svg";
    button.children[0].alt = "Remove";

    return button;
  }

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

  function createFullWindowButton() {
    var button = document.createElement('button');
    button.innerHTML = 'OK';
    button.id = 'full-window-button';
    formButton.enable(button);

    return button;
  }

  function showFullWindowMsg(type, text, callback) {
    var button = newElements.createFullWindowButton();
    if (callback) {
      button.addEventListener('click', callback);
    }

    var msg = null;
    if (type === 0) {
      msg = newElements.createFullWindow('Your session has expired');
    }
    else {
      msg = newElements.createFullWindow(text);
    }
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