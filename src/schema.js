'use strict';

const ok = require('ok-js');

const ValidationError = require('./validation-error');
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

  middleware (opt) {
    opt = opt || {};
    opt.target = opt.target || 'body';

    let middleware = (req, res, next) => {
      let data = ok.get(req, opt.target);
      this
        .validate(data)
        .catch(e => {
          let err = new ValidationError({
            type: e.type,
            path: e.path,
            isMiddleware: true
          });
          next(err);
        })
        .then(res => {
          ok.set(req, opt.target, res);
          next();
        });
    };

    return middleware;
  }
}

module.exports = Schema;
