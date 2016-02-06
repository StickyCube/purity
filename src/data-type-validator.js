'use strict';

const AbstractValidator = require('./abstract-validator');
const ValidationResult = require('./validation-result');
const DataTransform = require('./data-transform');
const knownTypes = require('./known-types');
const utils = require('./utils');
const Promise = utils.Promise;
const Map = utils.Map;

let cache = new Map();

class DataTypeValidator extends AbstractValidator {

  constructor (definition, config, options) {
    super(options);

    this.definition = definition;
    this.config = config;

    this.transform = this.setupTransforms();
    this.assertions = this.setupAssertions();
  }

  checkType (value) {
    return this.config.checkType
      ? this.config.checkType(value)
      : true;
  }

  validate (data, opt) {
    let options = utils.clone(opt);

    options.path = this.options.path;

    return data == null
      ? this.validateMissing(data, options)
      : this.validateData(data, options);
  }

  setupTransforms () {
    let transform = this.definition.$transform || [];
    let type = this.definition.$type;
    let id = knownTypes.resolve(type);
    return DataTransform.parse(transform, id);
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
    const skipTest = (options.skip === 'test');
    const skipTransform = (options.skip === 'transform');

    let result = null;

    if (!isCorrectType) return this.error('invalid');

    return new Promise((resolve, reject) => {
      if (skipTest) {
        options.value = this.transform.evaluate(data);
        result = new ValidationResult(options);
        return resolve(result);
      }

      this
        .applyAssertions(data)
        .catch(reject)
        .then(() => {
          options.value = skipTransform ? data : this.transform.evaluate(data);
          result = new ValidationResult(options);
          resolve(result);
        });
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

  static create (definition, options) {
    if (typeof definition !== 'object') {
      definition = { $type: definition };
    }

    let type = definition.$type;
    let id = knownTypes.resolve(type);
    let config = cache.get(id);

    if (!config) {
      throw new Error(`Data type could not be found for the alias: ${type}`);
    }

    if (!options.path) {
      options.path = '';
    }

    return new DataTypeValidator(definition, config, options);
  }

  static define (config) {
    let id = null;

    config.aliases.forEach(alias => {
      if (knownTypes.resolve(alias)) throw new Error(`A type with alias ${alias} is already defined`);
    });

    id = knownTypes.put(config.aliases);
    cache.set(id, config);
  }
}

module.exports = DataTypeValidator;
