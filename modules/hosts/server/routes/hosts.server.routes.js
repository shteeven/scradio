'use strict';

/**
 * Module dependencies.
 */
var hostsPolicy = require('../policies/hosts.server.policy'),
  hosts = require('../controllers/hosts.server.controller');

module.exports = function (app) {
  // Hosts collection routes
  app.route('/api/hosts').all(hostsPolicy.isAllowed)
    .get(hosts.list)
    .post(hosts.create);

  // Single host routes
  app.route('/api/hosts/:hostId').all(hostsPolicy.isAllowed)
    .get(hosts.read)
    .put(hosts.update)
    .delete(hosts.delete);

  // Finish by binding the host middleware
  app.param('hostId', hosts.hostByID);
};
