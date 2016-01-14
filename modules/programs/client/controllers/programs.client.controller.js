'use strict';

// Programs controller
angular.module('programs').controller('ProgramsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Programs',
  function ($scope, $stateParams, $location, Authentication, Programs) {
    $scope.authentication = Authentication;

    // Create new Program
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'programForm');

        return false;
      }

      // Create new Program object
      var program = new Programs({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      program.$save(function (response) {
        $location.path('programs/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Program
    $scope.remove = function (program) {
      if (program) {
        program.$remove();

        for (var i in $scope.programs) {
          if ($scope.programs[i] === program) {
            $scope.programs.splice(i, 1);
          }
        }
      } else {
        $scope.program.$remove(function () {
          $location.path('programs');
        });
      }
    };

    // Update existing Program
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'programForm');

        return false;
      }

      var program = $scope.program;

      program.$update(function () {
        $location.path('programs/' + program._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Programs
    $scope.find = function () {
      $scope.programs = Programs.query();
    };

    // Find existing Program
    $scope.findOne = function () {
      $scope.program = Programs.get({
        programId: $stateParams.programId
      });
    };
  }
]);
