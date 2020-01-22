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

  function createSignBarButton(value, id) {
    var button = document.createElement('input');
    button.type = 'button';
    button.className = 'navbar-button';
    button.value = value;
    button.id = id;

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

    var noButton = document.createElement('button');
    noButton.innerHTML = 'No';
    noButton.className = 'yes-no-button';
    noButton.id = id + '-no-button';

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

  return {
    createLoader: createLoader,
    createSignBarButton: createSignBarButton,
    createSignupSummary: createSignupSummary,
    createYesNoButtons: createYesNoButtons,
    createBlueButton: createBlueButton,
    createArrowButton: createArrowButton,
    createSelectPage: createSelectPage,
    createKeyValue: createKeyValue
  };
}());