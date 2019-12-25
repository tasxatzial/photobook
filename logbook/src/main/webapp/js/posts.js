'use strict';

var ShowPosts = (function() {
  var obj = {
    mapObj: null
  };

  var el = {
    postsSection: null,
    loader: null
  };

  var data = {
    username: null
  };

  function init(username) {
    data.username = username;
    el.postsSection = newElements.createPostsSection(username);
    var nonav = document.getElementById('no-nav');

    if (username === false) {
      el.postsSection.children[0].className = 'parent-in-main';
      nonav.innerHTML = '';
      nonav.appendChild(el.postsSection);
    }
    else {
      el.postsSection.children[0].className = 'parent-in-myaccount';
      var accountSubsection = document.getElementById('account-subsection');
      accountSubsection.innerHTML = '';
      accountSubsection.appendChild(el.postsSection);
    }

    if (username === false || username === null) {
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
    if (data.username === null) {
      formData.append('owner', '1');
    }
    else if (data.username !== false) {
      formData.append('username', data.username);
    }

    var loaderParent = document.getElementById('posts-loader');
    var loader = newElements.createLoader("images/loader.gif");
    loaderParent.appendChild(loader);

    state.xhr = ajaxRequest('POST', 'Main', formData, successCallback, failCallback);
    function successCallback() {
      state.xhrResponse = JSON.parse(state.xhr.responseText);
      if (state.xhrResponse.ERROR) {
        logout();
        return;
      }

      loaderParent.removeChild(loader);
      var shortPost = null;
      Object.keys(state.xhrResponse).forEach(function(key,index) {
        shortPost = newElements.createShortPost(state.xhrResponse[key], showFullPost, obj.mapObj);
        el.postsSection.children[0].appendChild(document.createElement('hr'));
        el.postsSection.children[0].appendChild(shortPost);
      });
    }

    function failCallback() {
      loaderParent.removeChild(loader);
      console.log(state.xhr.responseText);
    }
  }

  function showFullPost(fullPost, mapObj) {
    obj.mapObj = mapObj;
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
      if (JSON.parse(state.xhr.responseText).ERROR) {
        logout();
        return;
      }

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