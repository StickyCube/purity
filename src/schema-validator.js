'use strict';

const squish = require('object-squish');
const ok = require('ok-js');
const utils = require('./utils');
const Promise = utils.Promise;

const ValidationResult = require('./validation-result');
const ValidationError = require('./validation-error');
const DataTypeValidator = require('./data-type-validator');

class SchemaValidator {
  constructor (definition, options) {
    this.definition = null;
    this.validators = null;

    this.options = options || {};

    this.definition = this._getDefinition(definition);

    this._compile();
  }

  _getDefinition (definition) {
    if (utils.isArray(definition)) {
      // if we have an array, set the array flag and keep going
      this.options.isArray = true;
      return this._getDefinition(definition.pop());
    }

    if (utils.isSchema(definition)) {
      // if it's a schema, set the array flag and keep going
      if (definition.validator.options.isArray) {
        this.options.isArray = true;
      }
      return this._getDefinition(definition.validator.definition);
    }

    if (!utils.isPlainObject(definition)) {
      definition = { $type: definition };
    }

    return definition;
  }

  _createPromises (data) {
    let paths = Object.keys(this.validators);

    return data.reduce((promises, data, index) => {
      return paths.map(path => {
        let validator = this.validators[path];
        let value = ok.get(data, path || null);
        let idx = this.options.isArray ? index : null;
        return validator.validate(value, { index: idx });
      }).concat(promises);
    }, []);
  }

  _compile () {
    let flattened = utils.isEndpoint(this.definition)
      ? { '': this.definition }
      : squish(this.definition, { stopWhen: utils.isEndpoint });
    let paths = Object.keys(flattened);

    this.validators = paths.reduce((validators, path) => {
      let value = flattened[path];

      validators[path] = utils.isSchema(value) || utils.isArray(value)
        ? new SchemaValidator(value, { path: path })
        : DataTypeValidator.create(value, { path: path });

      return validators;
    }, {});
  }

  validate (data) {
    let array = utils.isArray(data);

    if (array !== !!this.options.isArray) {
      let err = new ValidationError({
        type: 'invalid',
        path: this.options.path || ''
      });
      return Promise.reject(err);
    }

    if (!array) {
      data = [data];
    }

    let promises = this._createPromises(data);
    // let deferred = Promise.defer();

    return Promise.all(promises)
      // .catch(err => deferred.reject(err))
      .then(results => {
        let result = this.inflate(results);
        let opt = { value: result, path: this.options.path };
        return new ValidationResult(opt);
      });
  }

  inflate (results) {
    return this.options.isArray
      ? ValidationResult.inflateArray(results)
      : ValidationResult.inflateObject(results);
  }
}

module.exports = SchemaValidator;
