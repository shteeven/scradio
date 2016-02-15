'use strict';

// Programs controller
angular.module('programs').controller('ProgramsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Programs',
  function ($scope, $stateParams, $location, Authentication, Programs) {
    $scope.authentication = Authentication;
    $scope.program = {};

    // Remove existing Program
    function remove(program) {
      if (program) {
        // TODO: does this take an array of program objects?
        program.$remove(function () {
          for (var i in $scope.programs) {
            if ($scope.programs[i] === program) {
              $scope.programs.splice(i, 1);
            }
          }
        });
      } else {
        // TODO: verify that this does not remove all programs
        // if it does, delete it. This is too risky
        $scope.program.$remove(function () {
          $location.path('programs');
        });
      }
    }

    // Find a list of Programs
    function find() {
      $scope.programs = Programs.query();
    }

    // Find existing Program
    function findOne() {
      $scope.program = Programs.get({
        programId: $stateParams.programId
      });
    }

    function clearFields() {
      $scope.program.title = '';
      $scope.program.content = '';
      $scope.program.profileImageURL = '';
      $scope.program.images = '';
      $scope.program.social = {
        mixcloud: '',
        twitter: '',
        facebook: '',
        homepage: ''
      };
      $scope.program.categories = '';
      $scope.program.description = {
        en: '',
        kr: ''
      };
      $scope.program.starId = [];
    }

    // Create new Program
    function create(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'programForm');
        return false;
      }

      // Create new Program object
      var program = new Programs({
        title: $scope.program.title,
        profileImageURL: $scope.program.profileImageURL,
        images: $scope.program.images,
        social: $scope.program.social,
        categories: $scope.program.categories,
        description: {
          en: $scope.program.description.en,
          kr: $scope.program.description.kr
        },
        starId: $scope.program.starId
      });

      // Redirect after save
      program.$save(function (response) {
        // Clear form fields
        clearFields();
        $location.path('programs/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    }

    // Update existing Program
    function update(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'programForm');
        return false;
      }

      var program = $scope.program;

      program.$update(function () {

        $location.path('programs/' + program._id);

        // Clear form fields
        $scope.clearFields();

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    }


    $scope.remove = remove;
    $scope.find = find;
    $scope.findOne = findOne;
    $scope.clearFields = clearFields;
    $scope.create = create;
    $scope.update = update;

    //init vars
    clearFields();
  }
]);
