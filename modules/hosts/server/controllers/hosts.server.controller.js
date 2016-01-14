'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Host = mongoose.model('Host'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a host
 */
exports.create = function (req, res) {
  var host = new Host(req.body);
  host.user = req.user;

  host.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(host);
    }
  });
};

/**
 * Show the current host
 */
exports.read = function (req, res) {
  res.json(req.host);
};

/**
 * Update a host
 */
exports.update = function (req, res) {
  var host = req.host;

  host.title = req.body.title;
  host.content = req.body.content;

  host.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(host);
    }
  });
};

/**
 * Delete an host
 */
exports.delete = function (req, res) {
  var host = req.host;

  host.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(host);
    }
  });
};

/**
 * List of Hosts
 */
exports.list = function (req, res) {
  Host.find().sort('-created').populate('user', 'displayName').exec(function (err, hosts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hosts);
    }
  });
};

/**
 * Host middleware
 */
exports.hostByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Host is invalid'
    });
  }

  Host.findById(id).populate('user', 'displayName').exec(function (err, host) {
    if (err) {
      return next(err);
    } else if (!host) {
      return res.status(404).send({
        message: 'No host with that identifier has been found'
      });
    }
    req.host = host;
    next();
  });
};
