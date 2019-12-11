'use strict';

var ShowPosts = (function() {
  var el = {
    postsSection: null
  };

  function init(username) {
    el.postsSection = newElements.createPostsSection(username);
    var nonav = document.getElementById('no-nav');
    if (username === false) {
      nonav.innerHTML = '';
      nonav.appendChild(el.postsSection);
    }
    else {
      el.postsSection.children[0].style.padding = '0';
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

    getPosts(username);
  }

  function getPosts(username) {
    var state = {
      xhr: null
    };

    var data = new FormData();
    data.append("action", "GetPosts");

  }

  return {
    init: init
  };
}());

