'use strict';

module.exports.isSchema = function (value) {
  const Schema = require('./schema');
  return value instanceof Schema;
};

module.exports.isArray = function (value) {
  return Array.isArray(value);
};

module.exports.isPlainObject = function (value) {
  return value != null && value.constructor === Object;
};

module.exports.isNan = function (value) {
  return (value !== value) || (typeof value !== 'number');
};

module.exports.isEndpoint = function (value) {
  return (typeof value === 'object') && ('$type' in value);
};

module.exports.Promise = require('es6-promise').Promise;
module.exports.Map = require('es6-map');
