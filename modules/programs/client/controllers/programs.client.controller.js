'use strict';

// Programs controller
angular.module('programs').controller('ProgramsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Programs',
  function ($scope, $stateParams, $location, Authentication, Programs) {
    $scope.authentication = Authentication;

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

    function clearFields(program) {
      program.title = '';
      program.content = '';
      program.profileImageURL = '';
      program.images = '';
      program.social = {
        mixcloud: '',
        twitter: '',
        facebook: '',
        homepage: ''
      };
      program.categories = '';
      program.description =  {
        en: '',
        kr: ''
      };
      program.starId = [];
    }

    $scope.findOne = findOne;
    $scope.find = find;
    $scope.remove = remove;
    $scope.clearFields = clearFields;

  }
]);


angular.module('programs').controller('ProgramsCreateController', ['$scope', '$location', 'Authentication', 'Programs', 'FileUploader',
  function ($scope, $location, Authentication, Programs, FileUploader) {
    $scope.authentication = Authentication;
    $scope.clearFields = $scope.$parent.clearFields;
    $scope.program = {};

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
      console.log(program);

      // Redirect after save
      program.$save(function (response) {
        // Clear form fields
        // SCOPE SHOULD BE DESTROYED ON REDIRECT
        //$scope.clearFields($scope.);

        $location.path('programs/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    }

    $scope.create = create;

    // initialize controller vars
    $scope.clearFields($scope.program);

  }
]);

angular.module('programs').controller('ProgramsEditController', ['$scope', '$stateParams', '$location', 'Authentication', 'Programs', 'FileUploader',
  function ($scope, $stateParams, $location, Authentication, Programs, FileUploader) {
    $scope.authentication = Authentication;
    $scope.findOne = $scope.$parent.findOne;
    $scope.clearFields = $scope.$parent.clearFields;
    $scope.program = {};

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

    $scope.update = update;

    // init data
    $scope.clearFields($scope.program); //TODO: repeat????
    $scope.findOne();

  }
]);
