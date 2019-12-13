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
      el.postsSection.children[0].style.paddingLeft = '0';
      el.postsSection.children[0].style.paddingRight = '0';
      var accountParent = document.getElementById('account-parent');
      accountParent.children[2].innerHTML = '';
      accountParent.children[2].appendChild(el.postsSection);
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
        shortPost = newElements.createShortPost(state.xhrResponse[key], showFullPost);
        el.postsSection.children[0].appendChild(document.createElement('hr'));
        el.postsSection.children[0].appendChild(shortPost);
      });
    }

    function failCallback() {
      console.log(state.xhr.responseText);
    }
  }

  function showFullPost(fullPost) {
    el.postsSection.children[0].innerHTML = '';
    el.postsSection.children[0].appendChild(fullPost);
    window.scrollTo(0, 0);
  }

  return {
    init: init
  };
}());