'use strict';

const ValidationResult = require('./validation-result');
const ValidationError = require('./validation-error');
const DataTransform = require('./data-transform');
const knownTypes = require('./known-types');
const utils = require('./utils');
const Promise = utils.Promise;
const Map = utils.Map;

let cache = new Map();

class DataTypeValidator {

  constructor (definition, config, options) {
    this.definition = definition;
    this.config = config;
    this.options = options;

    this.transform = this._setupTransforms();
    this.assertions = this._setupAssertions();
  }

  checkType (value) {
    return this.config.checkType
      ? this.config.checkType(value)
      : true;
  }

  validate (data, opt) {
    opt = opt || {};

    let options = {
      index: opt.index,
      path: this.options.path
    };

    return data == null
      ? this._validateMissing(data, options)
      : this._validateData(data, options);
  }

  _setupTransforms () {
    let transform = this._option('$transform') || [];
    let type = this._option('$type');
    let id = knownTypes.resolve(type);
    return DataTransform.parse(transform, id);
  }

  _setupAssertions () {
    let assertions = this.config.assertions || {};
    return Object
      .keys(assertions)
      .filter(key => this._hasOption(key))
      .reduce((arr, key) => {
        let opts = this._option(key);
        let fn = assertions[key];
        return [{ opts: opts, fn: fn }, ...arr];
      }, []);
  }

  _hasOption (name) {
    return name in this.definition;
  }

  _option (name) {
    return this.definition[name];
  }

  _getDefaultValue () {
    let defaultValue = this._option('$default');
    return typeof defaultValue === 'function'
      ? defaultValue()
      : defaultValue;
  }

  _validationError (type) {
    return new ValidationError({
      type: type,
      path: this.options.path
    });
  }

  _validateMissing (data, options) {
    let isRequired = !!this._option('$required');
    let hasDefault = this._hasOption('$default');
    let err;

    if (hasDefault) {
      options.value = this._getDefaultValue();
    } else if (isRequired) {
      err = this._validationError('missing');
    } else {
      options.value = data;
    }

    return err
      ? Promise.reject(err)
      : Promise.resolve(new ValidationResult(options));
  }

  _validateData (data, options) {
    if (this._option('$cast')) {
      data = this.cast(data);
    }

    return new Promise((resolve, reject) => {
      this
        ._applyAssertions(data)
        .catch(reject)
        .then(() => {
          options.value = this.transform.evaluate(data);
          resolve(new ValidationResult(options));
        });
    });
  }

  _applyAssertions (data) {
    if (!this.checkType(data)) {
      return Promise.reject(this._validationError('invalid'));
    }

    let assertions = this.assertions;

    for (let i = 0; i < assertions.length; i += 1) {
      let assertion = assertions[i];
      let assert = assertion.fn;
      let opts = assertion.opts;

      if (!assert(data, opts)) {
        return Promise.reject(this._validationError('invalid'));
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
    config.aliases.forEach(alias => {
      if (knownTypes.resolve(alias)) throw new Error(`A type with alias ${alias} is already defined`);
    });

    let id = knownTypes.put(config.aliases);
    cache.set(id, config);
  }
}

module.exports = DataTypeValidator;
