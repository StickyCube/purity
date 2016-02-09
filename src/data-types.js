
import { Map, ensureArray } from './utils';
import DataValidator from './data-validator';

let validators = new Map();

export const Types = {
  Any: Symbol('any'),
  String: Symbol('string'),
  Number: Symbol('number'),
  Boolean: Symbol('boolean'),
  Date: Symbol('date')
};

export function defineType (options) {
  let Type = class extends DataValidator {

    constructor () {
      super(...arguments);
      this.constraints = this.setupConstraints(options.constraints);
      this.transforms = this.setupTransforms();
    }

    check (v) {
      return (options.check || super.check)(v);
    }

    cast (v) {
      return (options.cast || super.cast)(v);
    }

  };

  let aliases = ensureArray(options.aliases);

  if (!aliases.length) {
    throw new Error(`options.aliases is required when defining a data type`);
  }

  aliases.forEach(alias => {
    if (validators.has(alias)) {
      throw new Error(`A data type with alias ${alias} already exists`);
    } else {
      validators.set(alias, Type);
    }
  });
}

export function createTypeValidator (definition, options) {
  if (typeof definition !== 'object') {
    definition = { $type: definition };
  }

  let type = definition.$type;
  let Validator = validators.get(type);

  if (!Validator) {
    throw new Error(`Data type could not be found for the alias: ${type}`);
  }

  if (!options.path) {
    options.path = '';
  }

  return new Validator(definition, options);
}
