'use strict';

//Hosts service used for communicating with the hosts REST endpoints
angular.module('hosts').factory('Hosts', ['$resource',
  function ($resource) {
    return $resource('api/hosts/:hostId', {
      hostId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
