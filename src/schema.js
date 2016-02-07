'use strict';

import { Promise } from './utils';

import SchemaValidator from './schema-validator';

export default class {
  constructor (definition, options) {
    this._validator = new SchemaValidator(definition, options);
    this._isPuritySchema_ = true;
  }

  _validateUsingCallback (data, done) {
    this._validator.validate(data)
      .catch(done)
      .then(r => done(null, r.value));
  }

  _validateUsingPromise (data, opt) {
    return new Promise((resolve, reject) => {
      this._validateUsingCallback(data, (e, r) => e ? reject(e) : resolve(r));
    });
  }

  validate () {
    return arguments.length === 2
      ? this._validateUsingCallback(...arguments)
      : this._validateUsingPromise(...arguments);
  }
}
