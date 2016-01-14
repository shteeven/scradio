'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Host = mongoose.model('Host'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, host;

/**
 * Host routes tests
 */
describe('Host CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new host
    user.save(function () {
      host = {
        title: 'Host Title',
        content: 'Host Content'
      };

      done();
    });
  });

  it('should be able to save an host if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new host
        agent.post('/api/hosts')
          .send(host)
          .expect(200)
          .end(function (hostSaveErr, hostSaveRes) {
            // Handle host save error
            if (hostSaveErr) {
              return done(hostSaveErr);
            }

            // Get a list of hosts
            agent.get('/api/hosts')
              .end(function (hostsGetErr, hostsGetRes) {
                // Handle host save error
                if (hostsGetErr) {
                  return done(hostsGetErr);
                }

                // Get hosts list
                var hosts = hostsGetRes.body;

                // Set assertions
                (hosts[0].user._id).should.equal(userId);
                (hosts[0].title).should.match('Host Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an host if not logged in', function (done) {
    agent.post('/api/hosts')
      .send(host)
      .expect(403)
      .end(function (hostSaveErr, hostSaveRes) {
        // Call the assertion callback
        done(hostSaveErr);
      });
  });

  it('should not be able to save an host if no title is provided', function (done) {
    // Invalidate title field
    host.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new host
        agent.post('/api/hosts')
          .send(host)
          .expect(400)
          .end(function (hostSaveErr, hostSaveRes) {
            // Set message assertion
            (hostSaveRes.body.message).should.match('Title cannot be blank');

            // Handle host save error
            done(hostSaveErr);
          });
      });
  });

  it('should be able to update an host if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new host
        agent.post('/api/hosts')
          .send(host)
          .expect(200)
          .end(function (hostSaveErr, hostSaveRes) {
            // Handle host save error
            if (hostSaveErr) {
              return done(hostSaveErr);
            }

            // Update host title
            host.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing host
            agent.put('/api/hosts/' + hostSaveRes.body._id)
              .send(host)
              .expect(200)
              .end(function (hostUpdateErr, hostUpdateRes) {
                // Handle host update error
                if (hostUpdateErr) {
                  return done(hostUpdateErr);
                }

                // Set assertions
                (hostUpdateRes.body._id).should.equal(hostSaveRes.body._id);
                (hostUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of hosts if not signed in', function (done) {
    // Create new host model instance
    var hostObj = new Host(host);

    // Save the host
    hostObj.save(function () {
      // Request hosts
      request(app).get('/api/hosts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single host if not signed in', function (done) {
    // Create new host model instance
    var hostObj = new Host(host);

    // Save the host
    hostObj.save(function () {
      request(app).get('/api/hosts/' + hostObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', host.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single host with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/hosts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Host is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single host which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent host
    request(app).get('/api/hosts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No host with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an host if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new host
        agent.post('/api/hosts')
          .send(host)
          .expect(200)
          .end(function (hostSaveErr, hostSaveRes) {
            // Handle host save error
            if (hostSaveErr) {
              return done(hostSaveErr);
            }

            // Delete an existing host
            agent.delete('/api/hosts/' + hostSaveRes.body._id)
              .send(host)
              .expect(200)
              .end(function (hostDeleteErr, hostDeleteRes) {
                // Handle host error error
                if (hostDeleteErr) {
                  return done(hostDeleteErr);
                }

                // Set assertions
                (hostDeleteRes.body._id).should.equal(hostSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an host if not signed in', function (done) {
    // Set host user
    host.user = user;

    // Create new host model instance
    var hostObj = new Host(host);

    // Save the host
    hostObj.save(function () {
      // Try deleting host
      request(app).delete('/api/hosts/' + hostObj._id)
        .expect(403)
        .end(function (hostDeleteErr, hostDeleteRes) {
          // Set message assertion
          (hostDeleteRes.body.message).should.match('User is not authorized');

          // Handle host error error
          done(hostDeleteErr);
        });

    });
  });

  it('should be able to get a single host that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new host
          agent.post('/api/hosts')
            .send(host)
            .expect(200)
            .end(function (hostSaveErr, hostSaveRes) {
              // Handle host save error
              if (hostSaveErr) {
                return done(hostSaveErr);
              }

              // Set assertions on new host
              (hostSaveRes.body.title).should.equal(host.title);
              should.exist(hostSaveRes.body.user);
              should.equal(hostSaveRes.body.user._id, orphanId);

              // force the host to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the host
                    agent.get('/api/hosts/' + hostSaveRes.body._id)
                      .expect(200)
                      .end(function (hostInfoErr, hostInfoRes) {
                        // Handle host error
                        if (hostInfoErr) {
                          return done(hostInfoErr);
                        }

                        // Set assertions
                        (hostInfoRes.body._id).should.equal(hostSaveRes.body._id);
                        (hostInfoRes.body.title).should.equal(host.title);
                        should.equal(hostInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Host.remove().exec(done);
    });
  });
});
