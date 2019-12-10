'use strict';

var ShowPosts = (function() {
  var el = {
    postsSection: null
  };

  function init(userPosts, canPost) {
    el.postsSection = newElements.createPostsSection(canPost);
    var nonav = document.getElementById('no-nav');
    if (!userPosts) {
      nonav.innerHTML = '';
      nonav.appendChild(el.postsSection);
    }
    else {
      el.postsSection.children[0].style.padding = '0';
      var accountParent = document.getElementById('account-parent');
      accountParent.removeChild(accountParent.children[2]);
      accountParent.appendChild(el.postsSection);
    }
    if (canPost) {
      var newPostButton = el.postsSection.children[0].children[0];
      newPostButton.addEventListener('click', function() {
        PostForm.init(userPosts);
      });
    }
  }
  return {
    init: init
  };
}());

