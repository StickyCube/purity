'use strict';

var Promise = require('./utils').Promise;
var ValidatonError = require('./validation-error');

class AbstractValidator {

  constructor (options) {
    this.options = options || {};
  }

  error (type) {
    let err = new ValidatonError({
      type: type,
      path: this.options.path || ''
    });

    return Promise.reject(err);
  }
}

module.exports = AbstractValidator;
