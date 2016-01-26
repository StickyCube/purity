'use strict';

let SchemaValidator = require('./schema-validator');

module.exports =
class Schema {
  constructor (definition, options) {
    this.schema = new SchemaValidator(definition, options);
  }

  _validateUsingCallback (data, done) {
    this.schema.validate(data)
      .catch(err => done(err))
      .then(result => done(null, result.value));
  }

  _validateUsingPromise (data) {
    let deferred = Promise.defer();

    this._validateUsingCallback(data, (err, res) => {
      if (err) return deferred.reject(err);
      deferred.resolve(res);
    });

    return deferred.promise;
  }

  validate (data, done) {
    return arguments.length === 2
      ? this._validateUsingCallback(data, done)
      : this._validateUsingPromise(data);
  }
};
