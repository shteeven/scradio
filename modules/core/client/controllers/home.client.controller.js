'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.alerts = [
      { number: 20408, icon:{ glyph:'glyphicon-user', type:'btn-success' }, caption:'Total Customers' },
      { number: 8382, icon:{ glyph:'glyphicon-calendar', type:'btn-primary' }, caption:'Upcoming Events' },
      { number: 527, icon:{ glyph:'glyphicon-edit', type:'btn-success' }, caption:'New Customers in 2014' },
      { number: 85000, icon:{ glyph:'glyphicon-record', type:'btn-info' }, caption:'Emails Sent' },
      { number: 268, icon:{ glyph:'glyphicon-eye-open', type:'btn-warning' }, caption:'Follow Ups Required' },
      { number: 348, icon:{ glyph:'glyphicon-flag', type:'btn-danger' }, caption:'Referrals to Moderate' }
    ];

  }
]);
