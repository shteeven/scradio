'use strict';

// Setting up route
angular.module('hosts').config(['$stateProvider',
  function ($stateProvider) {
    // Hosts state routing
    $stateProvider
      .state('hosts', {
        abstract: true,
        url: '/hosts',
        template: '<ui-view/>'
      })
      .state('hosts.list', {
        url: '',
        templateUrl: 'modules/hosts/client/views/list-hosts.client.view.html'
      })
      .state('hosts.create', {
        url: '/create',
        templateUrl: 'modules/hosts/client/views/create-host.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('hosts.view', {
        url: '/:hostId',
        templateUrl: 'modules/hosts/client/views/view-host.client.view.html'
      })
      .state('hosts.edit', {
        url: '/:hostId/edit',
        templateUrl: 'modules/hosts/client/views/edit-host.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
