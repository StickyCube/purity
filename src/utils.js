'use strict';

module.exports.isSchema = function (value) {
  return value instanceof require('./schema');
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
