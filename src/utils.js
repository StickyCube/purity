'use strict';

module.exports.isSchema = function (value) {
  return value && value._isPuritySchema_;
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

module.exports.clone = function (obj) {
  let copy = {};
  let orig = obj || {};

  for (let key in orig) {
    copy[key] = orig[key];
  }

  return copy;
};

module.exports.Promise = require('es6-promise').Promise;
module.exports.Map = require('es6-map');
