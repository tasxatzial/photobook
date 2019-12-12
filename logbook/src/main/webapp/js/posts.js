'use strict';

var ShowPosts = (function() {
  var el = {
    postsSection: null
  };

  var data = {
    username: null
  };

  function init(username) {
    data.username = username;
    el.postsSection = newElements.createPostsSection(username);
    var nonav = document.getElementById('no-nav');
    if (username === false) {
      nonav.innerHTML = '';
      nonav.appendChild(el.postsSection);
    }
    else {
      var accountParent = document.getElementById('account-parent');
      accountParent.removeChild(accountParent.children[2]);
      accountParent.appendChild(el.postsSection);
    }
    if (!username) {
      var newPostButton = el.postsSection.children[0].children[0];
      newPostButton.addEventListener('click', function() {
        PostForm.init(username);
      });
    }

    getPosts();
  }

  function getPosts() {
    var state = {
      xhr: null,
      xhrResponse: null
    };

    var formData = new FormData();
    formData.append("action", "GetPosts");
    if (data.username === false) {
      formData.append('username', '0');
    }
    else {
      formData.append('username', data.username);
    }
    state.xhr = ajaxRequest('POST', 'Main', formData, successCallback, failCallback);

    function successCallback() {
      state.xhrResponse = JSON.parse(state.xhr.responseText);
      var shortPost = null;
      Object.keys(state.xhrResponse).forEach(function(key,index) {
        shortPost = newElements.createShortPost(state.xhrResponse[key]);
        el.postsSection.children[0].appendChild(shortPost);
      });
    }

    function failCallback() {

    }
  }

  return {
    init: init
  };
}());

