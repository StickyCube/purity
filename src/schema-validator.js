'use strict';

import squish from 'object-squish';
import ok from 'ok-js';

import {
  Promise,
  isArray,
  isSchema,
  isPlainObject,
  isEndpoint
} from './utils';

import AbstractValidator from './abstract-validator';
import DataValidator from './data-validator';

import {
  ValidationResult,
  inflateObject,
  inflateArray
} from './validation-result';

export default class SchemaValidator extends AbstractValidator {
  constructor (definition, options) {
    super(options);

    this.definition = null;
    this.validators = null;

    this.definition = this.getDefinition(definition);

    this.compile();
  }

  getDefinition (definition) {
    if (isArray(definition)) {
      // if we have an array, set the array flag and keep going
      this.options.isArray = true;
      return this.getDefinition(definition.pop());
    }

    if (isSchema(definition)) {
      // if it's a schema, set the array flag and keep going
      if (definition._validator.options.isArray) {
        this.options.isArray = true;
      }
      return this.getDefinition(definition._validator.definition);
    }

    if (!isPlainObject(definition)) {
      definition = { $type: definition };
    }

    return definition;
  }

  createPromises (data) {
    let paths = Object.keys(this.validators);

    return data.reduce((promises, data, idx) => {
      return paths.map(path => {
        let validator = this.validators[path];
        let value = ok.get(data, path || null);
        let index = this.options.isArray ? idx : null;
        let options = { index: index, cast: this.options.cast };
        return validator.validate(value, options);
      }).concat(promises);
    }, []);
  }

  compile () {
    let flattened = isEndpoint(this.definition)
      ? { '': this.definition }
      : squish(this.definition, { stopWhen: isEndpoint });
    let paths = Object.keys(flattened);

    this.validators = paths.reduce((validators, path) => {
      let value = flattened[path];

      validators[path] = isSchema(value) || isArray(value)
        ? new SchemaValidator(value, { path: path })
        : DataValidator.create(value, { path: path });

      return validators;
    }, {});
  }

  validate (data) {
    let array = isArray(data);

    if (array !== !!this.options.isArray) {
      return this.error('invalid');
    }

    if (!array) {
      data = [data];
    }

    let promises = this.createPromises(data);

    return Promise.all(promises).then(results => {
      let result = this.inflate(results);
      let options = { value: result, path: this.options.path };
      return new ValidationResult(options);
    });
  }

  inflate (results) {
    return this.options.isArray
      ? inflateArray(results)
      : inflateObject(results);
  }
}
