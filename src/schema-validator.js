'use strict';

let squish = require('object-squish');
let ok = require('ok-js');

let ValidationResult = require('./validation-result');

let errors = require('./errors');
let dataTypes = require('./data-types');

function isEndpoint (val) {
  return (typeof val === 'object') && '$type' in val;
}

function isSchema (v) {
  let Schema = require('./schema');
  return v instanceof Schema;
}

module.exports =
class SchemaValidator {
  constructor (definition, options) {
    this.definition = null;
    this.validators = null;

    this.options = options || {};
    this.options.isArray = Array.isArray(definition);

    if (this.options.isArray) {
      definition = definition.shift();
    }

    this._setDefinition(definition);

    this._compile();
  }

  _setDefinition (definition) {
    if (isSchema(definition)) {
      definition = definition.schema.definition;
      this.options.isArray = this.options.isArray || definition.options.isArray;
    }

    if ((typeof definition !== 'object')) {
      definition = { '': { $type: definition } };
    }

    if (isEndpoint(definition)) {
      definition = { '': definition };
    }

    this.definition = definition;
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
    let flattened = squish(this.definition, { stopWhen: isEndpoint });
    let paths = Object.keys(flattened);

    this.validators = paths.reduce((validators, path) => {
      let value = flattened[path];

      validators[path] = isSchema(value) || Array.isArray(value)
        ? new SchemaValidator(value, { path: path })
        : dataTypes.create(value, path);

      return validators;
    }, {});
  }

  validate (data) {
    let isArray = Array.isArray(data);

    if (this.options.isArray !== isArray) {
      let err = errors.create('invalid', { path: this.options.path || '' });
      return Promise.reject(err);
    }

    if (!isArray) {
      data = [data];
    }

    let promises = this._createPromises(data);
    let deferred = Promise.defer();

    Promise.all(promises)
      .catch(err => deferred.reject(err))
      .then(results => {
        let result = this.inflate(results);
        let opt = { value: result, path: this.path };
        deferred.resolve(new ValidationResult(opt));
      });

    return deferred.promise;
  }

  inflate (results) {
    return this.options.isArray
      ? ValidationResult.inflateArray(results)
      : ValidationResult.inflateObject(results);
  }
};
