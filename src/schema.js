'use strict';

const SchemaValidator = require('./schema-validator');
const Promise = require('./utils').Promise;

class Schema {
  constructor (definition, options) {
    this.validator = new SchemaValidator(definition, options);
  }

  _validateUsingCallback (data, done) {
    this.validator.validate(data)
      .catch(err => done(err))
      .then(result => done(null, result.value));
  }

  _validateUsingPromise (data) {
    return new Promise((resolve, reject) => {
      this._validateUsingCallback(data, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });
  }

  validate (data, done) {
    return arguments.length === 2
      ? this._validateUsingCallback(data, done)
      : this._validateUsingPromise(data);
  }
}

module.exports = Schema;
