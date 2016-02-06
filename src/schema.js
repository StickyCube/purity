'use strict';

const ok = require('ok-js');

const SchemaValidator = require('./schema-validator');
const Promise = require('./utils').Promise;

class Schema {
  constructor (definition, options) {
    // throw new Error('fewfefwf');
    this._validator = new SchemaValidator(definition, options);
    this._isPuritySchema_ = true;
  }

  _validateUsingCallback (data, done, opt) {
    this._validator.validate(data, opt)
      .catch(done)
      .then(r => done(null, r.value));
  }

  _validateUsingPromise (data, opt) {
    return new Promise((resolve, reject) => {
      this._validateUsingCallback(data, (e, r) => e ? reject(e) : resolve(r), opt);
    });
  }

  test () {
    let opt = { skip: 'transform' };
    return arguments.length === 2
      ? this._validateUsingCallback(...arguments, opt)
      : this._validateUsingPromise(...arguments, opt);
  }

  transform () {
    let opt = { skip: 'test' };
    return arguments.length === 2
      ? this._validateUsingCallback(...arguments, opt)
      : this._validateUsingPromise(...arguments, opt);
  }

  validate () {
    return arguments.length === 2
      ? this._validateUsingCallback(...arguments)
      : this._validateUsingPromise(...arguments);
  }

  toMiddleware (opts) {
    return (req, res, next) => {
      let target = opts.target || 'body';
      this.validate(req[target], function (err, res) {
        if (err) return next(err);
        ok.set(req, target, res);
        return next();
      });
    };
  }
}

module.exports = function (definition, options) {
  return new Schema(definition, options);
};
