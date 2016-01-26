'use strict';

let ValidationResult = require('./validation-result');
let DataValidationError = require('./data-validation-error');

class DataTypeValidator {
  static _createClass (opt) {
    return class extends DataTypeValidator {
      constructor () {
        super(...arguments);
        this.assertions = opt.assertions || {};
        this.mutators = opt.mutators || {};
      }

      checkType () {
        return typeof opt.checkType === 'function'
          ? opt.checkType(...arguments)
          : super.checkType(...arguments);
      }

      cast () {
        return typeof opt.cast === 'function'
          ? opt.cast(...arguments)
          : super.cast(...arguments);
      }
    };
  }

  static _getTypeWithAlias (alias) {
    let types = DataTypeValidator._types;

    for (let i = 0; i < types.length; i += 1) {
      let type = types[i];

      if (type.alias === alias) {
        return type.Validator;
      }
    }

    return null;
  }

  static create (definition, path) {
    if (typeof definition !== 'object') {
      definition = { $type: definition };
    }

    let type = definition.$type;
    let Validator = DataTypeValidator._getTypeWithAlias(type);

    if (!Validator) {
      throw new Error(`Data type could not be found for the alias: ${type}`);
    }

    return new Validator(definition, path || '');
  }

  static define (name, options) {
    let types = DataTypeValidator._types;
    let Types = DataTypeValidator.Types;

    if (name in Types) {
      throw new Error(`A data type with name: ${name} is already defined.`);
    }

    let id = Symbol(name);
    let Validator = DataTypeValidator._createClass(options);

    options.aliases = options.aliases || [];
    options.aliases.push(name);
    options.aliases.push(id);

    Types[name] = id;

    options.aliases.forEach(alias => {
      // throw if the alias is in use
      let alreadyExists = DataTypeValidator._getTypeWithAlias(alias);

      if (alreadyExists) {
        throw new Error(`A type with alias ${alias} is already defined`);
      }

      types.push({ alias: alias, Validator: Validator });
    });

    return Validator;
  }

  constructor (definition, path) {
    this.path = path || '';
    this.definition = definition;
    this.assertions = {};
    this.mutators = {};
  }

  checkType () {
    return true;
  }

  cast (v) {
    return v;
  }

  validate (data, opt) {
    opt = opt || {};

    let options = {
      index: opt.index,
      path: this.path
    };

    return data == null
      ? this._validateMissing(data, options)
      : this._validateData(data, options);
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
    return DataValidationError.create(type, { path: this.path });
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
    if (!this._hasOption('$cast') || this._option('$cast')) {
      data = this.cast(data);
    }

    let deferred = Promise.defer();

    this
      ._applyAssertions(data)
      .catch(err => deferred.reject(err))
      .then(() => {
        options.value = this._applyMutators(data);
        deferred.resolve(new ValidationResult(options));
      });

    return deferred.promise;
  }

  _applyAssertions (data) {
    let err;

    if (!this.checkType(data)) {
      err = this._validationError('invalid');
      return Promise.reject(err);
    }

    let assertions = Object
      .keys(this.assertions)
      .filter(key => this._hasOption(key));

    for (let i = 0; i < assertions.length; i += 1) {
      let key = assertions[i];
      let assert = this.assertions[key];
      let opts = this._option(key);

      if (!assert(data, opts)) {
        err = this._validationError('invalid');
        return Promise.reject(err);
      }
    }

    return Promise.resolve();
  }

  _applyMutators (data) {
    let value = data;
    let mutators = Object
      .keys(this.mutators)
      .filter(key => this._hasOption(key));

    for (let i = 0; i < mutators.length; i += 1) {
      let key = mutators[i];
      let mutate = this.mutators[key];
      let opts = this._option(key);
      value = mutate(value, opts);
    }

    return value;
  }
}

DataTypeValidator._types = [];

DataTypeValidator.Types = {};

module.exports = DataTypeValidator;
