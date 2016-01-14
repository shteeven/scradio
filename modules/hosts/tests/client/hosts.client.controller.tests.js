'use strict';

(function () {
  // Hosts Controller Spec
  describe('Hosts Controller Tests', function () {
    // Initialize global variables
    var HostsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Hosts,
      mockHost;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Hosts_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Hosts = _Hosts_;

      // create mock host
      mockHost = new Hosts({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Host about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Hosts controller.
      HostsController = $controller('HostsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one host object fetched from XHR', inject(function (Hosts) {
      // Create a sample hosts array that includes the new host
      var sampleHosts = [mockHost];

      // Set GET response
      $httpBackend.expectGET('api/hosts').respond(sampleHosts);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.hosts).toEqualData(sampleHosts);
    }));

    it('$scope.findOne() should create an array with one host object fetched from XHR using a hostId URL parameter', inject(function (Hosts) {
      // Set the URL parameter
      $stateParams.hostId = mockHost._id;

      // Set GET response
      $httpBackend.expectGET(/api\/hosts\/([0-9a-fA-F]{24})$/).respond(mockHost);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.host).toEqualData(mockHost);
    }));

    describe('$scope.create()', function () {
      var sampleHostPostData;

      beforeEach(function () {
        // Create a sample host object
        sampleHostPostData = new Hosts({
          title: 'An Host about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Host about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Hosts) {
        // Set POST response
        $httpBackend.expectPOST('api/hosts', sampleHostPostData).respond(mockHost);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the host was created
        expect($location.path.calls.mostRecent().args[0]).toBe('hosts/' + mockHost._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/hosts', sampleHostPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock host in scope
        scope.host = mockHost;
      });

      it('should update a valid host', inject(function (Hosts) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/hosts\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/hosts/' + mockHost._id);
      }));

      it('should set scope.error to error response message', inject(function (Hosts) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/hosts\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(host)', function () {
      beforeEach(function () {
        // Create new hosts array and include the host
        scope.hosts = [mockHost, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/hosts\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockHost);
      });

      it('should send a DELETE request with a valid hostId and remove the host from the scope', inject(function (Hosts) {
        expect(scope.hosts.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.host = mockHost;

        $httpBackend.expectDELETE(/api\/hosts\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to hosts', function () {
        expect($location.path).toHaveBeenCalledWith('hosts');
      });
    });
  });
}());
