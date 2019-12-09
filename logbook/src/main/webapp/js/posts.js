'use strict';

var ShowPosts = (function() {
  function init(userPosts, canPost) {
    var postsSection = newElements.createPostsSection(canPost);
    var nonav = document.getElementById('no-nav');
    if (!userPosts) {
      nonav.innerHTML = '';
      nonav.appendChild(postsSection);
    }
    else {
      var accountParent = document.getElementById('account-parent');
      accountParent.removeChild(accountParent.children[2]);
      accountParent.appendChild(postsSection);
    }
  }

  return {
    init: init
  };
}());