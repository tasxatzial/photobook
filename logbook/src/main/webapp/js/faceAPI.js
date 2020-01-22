'use strict';

/*  face recognition that is based on faceplusplus service */
var FaceAPI = (function() {

  // Object that holds anything related with the facetPlusPlus REST API Service
  var faceAPI = {
    apiKey: 'l2jNgKbk1HXSR4vMzNygHXx2g8c_xT9c',
    apiSecret: '2T6XdZt4EYw-I7OhmZ6g1wtECl81e_Ip',
    app: 'hy359',
    // Detect
    // https://console.faceplusplus.com/documents/5679127
    detect: 'https://api-us.faceplusplus.com/facepp/v3/detect',  // POST
    // Set User ID
    // https://console.faceplusplus.com/documents/6329500
    setuserId: 'https://api-us.faceplusplus.com/facepp/v3/face/setuserid', // POST
    // Get User ID
    // https://console.faceplusplus.com/documents/6329496
    getDetail: 'https://api-us.faceplusplus.com/facepp/v3/face/getdetail', // POST
    // addFace
    // https://console.faceplusplus.com/documents/6329371
    addFace: 'https://api-us.faceplusplus.com/facepp/v3/faceset/addface', // POST
    // Search
    // https://console.faceplusplus.com/documents/5681455
    search: 'https://api-us.faceplusplus.com/facepp/v3/search', // POST
    // Create set of faces
    // https://console.faceplusplus.com/documents/6329329
    create: 'https://api-us.faceplusplus.com/facepp/v3/faceset/create', // POST
    // update
    // https://console.faceplusplus.com/documents/6329383
    update: 'https://api-us.faceplusplus.com/facepp/v3/faceset/update', // POST
    // removeface
    // https://console.faceplusplus.com/documents/6329376
    removeFace: 'https://api-us.faceplusplus.com/facepp/v3/faceset/removeface', // POST

    //https://console.faceplusplus.com/documents/6329465
    analyze: 'https://api-us.faceplusplus.com/facepp/v3/face/analyze'
  };

  /* common callback for all services */
  function failCallback(state, failFunc) {
    return function() {
      if (Requests.get(state.ID).responseText) {
        state.response =  JSON.parse(Requests.get(state.ID).responseText);
        if (state.response.error_message) {
          state.errMsg = state.response.error_message.split(':')[0];
        }
      }
      if (!state.errMsg) {
        state.errMsg = 'Error';
      }
      failFunc(state.errMsg);
    };
  }

  function detect(photoB64, successFunc, failFunc) {
    var state = {
      ID: null,
      xhr: null,
      response: null,
      faceToken: null,
      errMsg: null
    };
    function successCallback() {
      state.response = JSON.parse(Requests.get(state.ID).responseText);
      if (state.response.faces.length) {
        state.faceToken = state.response.faces[0].face_token;
      }
      successFunc();
    }
    function hasCompleted() {
      return state.response !== null;
    }
    function getToken() {
      return state.faceToken;
    }
    function getErrorMsg() {
      return state.errMsg;
    }
    var data = new FormData();
    data.append('api_key', faceAPI.apiKey);
    data.append('api_secret', faceAPI.apiSecret);
    data.append('image_base64', photoB64);
    state.ID = Requests.add(ajaxRequest('POST', faceAPI.detect, data, successCallback, failCallback(state, failFunc)));

    return {
      hasCompleted: hasCompleted,
      getToken: getToken,
      getErrorMsg: getErrorMsg
    };
  }

  function setID(userId, faceToken, successFunc, failFunc) {
    var state = {
      ID: null,
      response: null,
      errMsg: null
    };
    function successCallback() {
      state.response =  JSON.parse(Requests.get(state.ID).responseText);
      successFunc();
    }
    function hasCompleted() {
      return state.response !== null;
    }
    function getErrorMsg() {
      return state.errMsg;
    }
    var data = new FormData();
    data.append('api_key', faceAPI.apiKey);
    data.append('api_secret', faceAPI.apiSecret);
    data.append('face_token', faceToken);
    data.append('user_id', userId);
    state.ID = Requests.add(ajaxRequest('POST', faceAPI.setuserId, data, successCallback, failCallback(state, failFunc)));

    return {
      hasCompleted: hasCompleted,
      getErrorMsg: getErrorMsg
    };
  }

  function addFace(faceToken, successFunc, failFunc) {
    var state = {
      ID: null,
      response: null,
      errMsg: null
    };
    function successCallback() {
      state.response = JSON.parse(Requests.get(state.ID).responseText);
      successFunc();
    }
    function hasCompleted() {
      return state.response !== null;
    }
    function getErrorMsg() {
      return state.errMsg;
    }
    var data = new FormData();
    data.append('outer_id', faceAPI.app);
    data.append('api_key', faceAPI.apiKey);
    data.append('api_secret', faceAPI.apiSecret);
    data.append('face_tokens', faceToken);
    state.ID = Requests.add(ajaxRequest('POST', faceAPI.addFace, data, successCallback, failCallback(state, failFunc)));

    return {
      hasCompleted: hasCompleted,
      getErrorMsg: getErrorMsg
    };
  }

  function analyze(returnAttributes, faceTokens, successFunc, failFunc) {
    var state = {
      ID: null,
      response: null,
      errMsg: null,
      emotion: null
    };
    function successCallback() {
      state.response =  JSON.parse(Requests.get(state.ID).responseText);
      if (state.response.faces.length) {
        var emotions = state.response.faces[0].attributes['emotion'];
        var emotionValue = 0;
        var emotionKey = null;
        Object.keys(emotions).forEach(function(key,index) {
          if (emotions[key] > emotionValue) {
            emotionValue = emotions[key];
            emotionKey = key;
          }
        });
        if (emotionValue > 80) {
          state.emotion = {
            emotionKey: emotionKey,
            emotionValue: emotionValue
          };
        }
      }
      successFunc();
    }
    function getEmotion() {
      return state.emotion;
    }
    function hasCompleted() {
      return state.response !== null;
    }
    function getErrorMsg() {
      return state.errMsg;
    }

    var data = new FormData();
    data.append('api_key', faceAPI.apiKey);
    data.append('api_secret', faceAPI.apiSecret);
    data.append('face_tokens', faceTokens);
    data.append('return_attributes', returnAttributes);
    state.ID = Requests.add(ajaxRequest('POST', faceAPI.analyze, data, successCallback, failCallback(state, failFunc)));

    return {
      getEmotion: getEmotion,
      hasCompleted: hasCompleted,
      getErrorMsg: getErrorMsg
    };
  }

  function search(photoB64, successFunc, failFunc){
    var state = {
      ID: null,
      response: null,
      userID: null,
      faceToken: null,
      errMsg: null,
      confidence: null
    };
    function successCallback() {
      state.response = JSON.parse(Requests.get(state.ID).responseText);
      if (state.response.faces.length && state.response.results) {
        state.faceToken = state.response.faces[0].face_token;
        state.confidence = 0;
        for (var i = 0; i < state.response.results.length; i++) {
          if (state.response.results[i].confidence > state.confidence) {
            state.confidence = state.response.results[i].confidence;
            state.userID = state.response.results[i].user_id;
          }
        }
      }
      successFunc();
    }
    function hasCompleted() {
      return state.response !== null;
    }
    function getUserID() {
      return state.userID;
    }
    function getToken() {
      return state.faceToken;
    }
    function getErrorMsg() {
      return state.errMsg;
    }
    function getConfidence() {
      return state.confidence;
    }

    var data = new FormData();
    data.append('api_key', faceAPI.apiKey);
    data.append('api_secret', faceAPI.apiSecret);
    data.append('outer_id', faceAPI.app);
    data.append('image_base64', photoB64);
    state.ID = Requests.add(ajaxRequest('POST', faceAPI.search, data, successCallback, failCallback(state, failFunc)));

    return {
      hasCompleted: hasCompleted,
      getUserID: getUserID,
      getToken: getToken,
      getErrorMsg: getErrorMsg,
      getConfidence: getConfidence
    };
  }

  /* converts the server response error message to a simpler one */
  function shortMsg(msg) {
    switch(msg) {
      case 'IMAGE_ERROR_UNSUPPORTED_FORMAT':
        return 'Invalid format';
      case 'INVALID_IMAGE_SIZE':
        return 'Invalid dimensions';
      case 'IMAGE_FILE_TOO_LARGE':
        return 'Invalid size';
      case 'INTERNAL_ERROR':
        return 'Server error';
      default:
        return 'Error';
    }
  }

  /* returns a message for the emotion that has been detected */
  function emotionReply(emotion) {
    if (!emotion) {
      return '';
    }
    switch(emotion.emotionKey) {
      case 'anger':
        return 'Please, calm down!';
      case 'sadness':
        return 'I\'m Here for You';
      case 'disgust':
        return 'Don\'t let your feelings control your thinking';
      case 'fear':
        return 'Fear is only as deep as the mind allows';
      case 'happiness':
        return 'If you see someone without a smile give them one of yours';
      case 'surprise':
        return 'The wiser you become, the lesser you will be surprised!';
      default:
        return '';
    }
  }

  return {
    detect: detect,
    setID: setID,
    addFace: addFace,
    shortMsg: shortMsg,
    search: search,
    analyze: analyze,
    emotionReply: emotionReply
  };
}());