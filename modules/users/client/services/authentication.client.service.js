'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',

  function ($window) {
    var auth = {
      user: $window.user
    };

    function replaceAll(str, find, replace) {
      if (typeof str === 'string') {
        return str.replace(new RegExp(find, 'g'), replace);
      }
    }
    if (auth.user.profileImageURL){
      auth.user.profileImageURL = replaceAll(auth.user.profileImageURL, '&#x2F;', '/');
    }

    return auth;
  }
]);
