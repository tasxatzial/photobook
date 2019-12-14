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

    var loader = newElements.createLoader("images/loader.gif");
    el.postsSection.children[0].children[2].appendChild(loader);

    state.xhr = ajaxRequest('POST', 'Main', formData, successCallback, failCallback);
    function successCallback() {
      el.postsSection.children[0].children[2].removeChild(loader);
      state.xhrResponse = JSON.parse(state.xhr.responseText);
      var shortPost = null;
      Object.keys(state.xhrResponse).forEach(function(key,index) {
        shortPost = newElements.createShortPost(state.xhrResponse[key], showFullPost);
        el.postsSection.children[0].appendChild(document.createElement('hr'));
        el.postsSection.children[0].appendChild(shortPost);
      });
    }

    function failCallback() {
      el.postsSection.children[0].children[2].removeChild(loader);
      console.log(state.xhr.responseText);
    }
  }

  function showFullPost(fullPost) {
    el.postsSection.children[0].innerHTML = '';
    el.postsSection.children[0].appendChild(fullPost);
    window.scrollTo(0, 0);

    var deleteButton = document.getElementById('delete-post-button');
    if (deleteButton) {
      deleteButton.children[0].addEventListener('click', function () {
        deletePost(fullPost);
      });
    }
  }

  function deletePost(fullPost) {
    var state = {
      xhr: null
    };

    var postID = fullPost.id.substring(6);
    var username = fullPost.username;

    var formData = new FormData();
    formData.append("action", "DeletePost");
    formData.append("postID", postID);
    formData.append("username", username);

    state.xhr = ajaxRequest('POST', "Main", formData, successCallback, failCallback);

    function successCallback() {
      ShowPosts.init(data.username);
    }

    function failCallback() {
      var deleteMsg = document.getElementById('delete-post-msg');
      formMsg.showError(deleteMsg, 'Error');
    }
  }

  return {
    init: init
  };
}());