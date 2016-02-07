'use strict';

import { Map, Promise, clone, isArray, isFunction } from './utils';

import AbstractValidator from './abstract-validator';
import { ValidationResult } from './validation-result';
import { resolveIdForAlias, createNewType } from './data-types';

let cache = new Map();

class DataValidator extends AbstractValidator {

  constructor (definition, config, options) {
    super(options);

    this.definition = definition;
    this.config = config;

    this.assertions = this.setupAssertions();
    this.transforms = this.setupTransforms();
  }

  checkType (value) {
    return this.config.checkType
      ? this.config.checkType(value)
      : true;
  }

  validate (data, opt) {
    let options = clone(opt);

    options.path = this.options.path;

    return data == null
      ? this.validateMissing(data, options)
      : this.validateData(data, options);
  }

  setupAssertions () {
    let assertions = this.config.assertions || {};
    return Object
      .keys(assertions)
      .filter(key => key in this.definition)
      .reduce((arr, key) => {
        let opts = this.definition[key];
        let fn = assertions[key];
        return [{ opts: opts, fn: fn }, ...arr];
      }, []);
  }

  setupTransforms () {
    let transforms = this.definition.$transform;

    if (!transforms) {
      return [];
    }

    if (!isArray(transforms)) {
      return [transforms];
    }

    return transforms.filter(isFunction);
  }

  getDefaultValue () {
    let defaultValue = this.definition.$default;
    return typeof defaultValue === 'function'
      ? defaultValue()
      : defaultValue;
  }

  validateMissing (data, options) {
    const isRequired = !!this.definition.$required;
    const hasDefault = ('$default' in this.definition);
    let result = null;

    if (isRequired && !hasDefault) {
      return this.error('missing');
    }

    options.value = hasDefault
      ? this.getDefaultValue()
      : data;

    result = new ValidationResult(options);

    return Promise.resolve(result);
  }

  validateData (data, options) {
    const isCorrectType = this.checkType(data);

    if (!isCorrectType) return this.error('invalid');

    return this
      .applyAssertions(data)
      .then(() => {
        options.value = this.transform(data);
        return new ValidationResult(options);
      });
  }

  applyAssertions (data) {
    let assertions = this.assertions;

    for (let i = 0; i < assertions.length; i += 1) {
      let assertion = assertions[i];
      let assert = assertion.fn;
      let opts = assertion.opts;

      if (!assert(data, opts)) {
        return this.error('invalid');
      }
    }

    return Promise.resolve();
  }

  transform (data) {
    return this.transforms.reduce((data, next) => next(data), data);
  }

  static create (definition, options) {
    if (typeof definition !== 'object') {
      definition = { $type: definition };
    }

    let type = definition.$type;
    let id = resolveIdForAlias(type);
    let config = cache.get(id);

    if (!config) {
      throw new Error(`Data type could not be found for the alias: ${type}`);
    }

    if (!options.path) {
      options.path = '';
    }

    return new DataValidator(definition, config, options);
  }

  static define (config) {
    let id = null;

    id = createNewType(config.aliases);
    cache.set(id, config);
  }
}

module.exports = DataValidator;
