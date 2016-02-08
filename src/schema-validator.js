'use strict';

import squish from 'object-squish';
import ok from 'ok-js';

import {
  Promise,
  isArray,
  isSchema,
  isPlainObject,
  isEndpoint,
  clone
} from './utils';

import AbstractValidator from './abstract-validator';
import ValidationResult from './validation-result';

import { createTypeValidator } from './data-types';

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
      return this.getDefinition(definition.shift());
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
        let index = this.options.isArray ? idx : null;
        let validator = this.validators[path];
        let value = ok.get(data, path || null);
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

      if (isSchema(value) || isArray(value)) {
        validators[path] = new SchemaValidator(value, { path: path });
      } else {
        validators[path] = createTypeValidator(value, { path: path });
      }

      return validators;
    }, {});
  }

  validate (data, opt) {
    let array = isArray(data);
    let options = clone(opt);

    if (array !== !!this.options.isArray) {
      return this.error('invalid');
    }

    if (!array) {
      data = [data];
    }

    let promises = this.createPromises(data);

    return Promise.all(promises).then(results => {
      options.value = this.inflate(results);
      options.path = this.options.path;
      return new ValidationResult(options);
    });
  }

  inflate (results) {
    return this.options.isArray
      ? ValidationResult.inflateArray(results)
      : ValidationResult.inflateObject(results);
  }
}
