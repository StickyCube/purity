'use strict';

import { Promise, clone, isArray, isFunction, ensureArray } from './utils';

import AbstractValidator from './abstract-validator';
import ValidationResult from './validation-result';

class DataValidator extends AbstractValidator {

  constructor (definition, options) {
    super(options);
    this.definition = definition;
  }

  checkType () {
    return true;
  }

  cast (v) {
    return v;
  }

  setupAssertions (assertions) {
    return Object
      .keys(assertions || {})
      .filter(key => key in this.definition)
      .reduce((arr, key) => {
        let opts = this.definition[key];
        let fn = assertions[key];
        return [{ opts: opts, fn: fn }, ...arr];
      }, []);
  }

  setupTransforms () {
    return ensureArray(this.definition.$transform).filter(isFunction);
  }

  validate (data, opt) {
    let options = clone(opt);

    options.path = this.options.path;

    return data == null
      ? this.validateMissing(data, options)
      : this.validateData(data, options);
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

    options.required = isRequired;

    result = new ValidationResult(options);

    return Promise.resolve(result);
  }

  validateData (data, options) {
    let shouldCast;

    if ('$cast' in this.definition) {
      shouldCast = !!this.definition.$cast;
    } else {
      shouldCast = !!options.cast;
    }

    if (shouldCast) {
      data = this.cast(data);
    }

    if (!this.checkType(data)) return this.error('invalid');

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
}

module.exports = DataValidator;
