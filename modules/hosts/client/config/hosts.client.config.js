'use strict';

// Configuring the Hosts module
angular.module('hosts').run(['Menus',
  function (Menus) {
    // Add the hosts dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Hosts',
      state: 'hosts',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'hosts', {
      title: 'List Hosts',
      state: 'hosts.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'hosts', {
      title: 'Create Hosts',
      state: 'hosts.create',
      roles: ['user']
    });
  }
]);
