'use strict';

const squish = require('object-squish');
const ok = require('ok-js');

const utils = require('./utils');
const Promise = utils.Promise;

const ValidationResult = require('./validation-result');
const DataTypeValidator = require('./data-type-validator');
const AbstractValidator = require('./abstract-validator');

class SchemaValidator extends AbstractValidator {
  constructor (definition, options) {
    super(options);

    this.definition = null;
    this.validators = null;

    this.definition = this.getDefinition(definition);

    this.compile();
  }

  getDefinition (definition) {
    if (utils.isArray(definition)) {
      // if we have an array, set the array flag and keep going
      this.options.isArray = true;
      return this.getDefinition(definition.pop());
    }

    if (utils.isSchema(definition)) {
      // if it's a schema, set the array flag and keep going
      if (definition._validator.options.isArray) {
        this.options.isArray = true;
      }
      return this.getDefinition(definition._validator.definition);
    }

    if (!utils.isPlainObject(definition)) {
      definition = { $type: definition };
    }

    return definition;
  }

  createPromises (data, opt) {
    let paths = Object.keys(this.validators);

    opt = opt || {};

    return data.reduce((promises, data, index) => {
      return paths.map(path => {
        let validator = this.validators[path];
        let value = ok.get(data, path || null);
        let options = {
          index: this.options.isArray ? index : null,
          skip: opt.skip || null
        };
        return validator.validate(value, options);
      }).concat(promises);
    }, []);
  }

  compile () {
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

  validate (data, opt) {
    let array = utils.isArray(data);

    if (array !== !!this.options.isArray) {
      return this.error('invalid');
    }

    if (!array) {
      data = [data];
    }

    let promises = this.createPromises(data, opt);

    return new Promise((resolve, reject) => {
      return Promise.all(promises)
        .catch(reject)
        .then(results => {
          let result = this.inflate(results);
          let opt = { value: result, path: this.options.path };
          let value = new ValidationResult(opt);
          resolve(value);
        });
    });
  }

  inflate (results) {
    return this.options.isArray
      ? ValidationResult.inflateArray(results)
      : ValidationResult.inflateObject(results);
  }
}

module.exports = SchemaValidator;
