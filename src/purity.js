'use strict';

import { isNan } from './utils';
import { Types } from './data-types';

import SchemaObject from './schema';
import DataValidator from './data-validator';

export { Types };
export { ValidationError } from './validation-error';

export function Schema () {
  return new SchemaObject(...arguments);
}

export function createDataType (opts) {
  if (!opts.aliases) {
    throw new Error('options.aliases is required');
  }

  if (!opts.aliases.length) {
    throw new Error('options.aliases requires at least one alias');
  }

  DataValidator.define(opts);
}

/**
 * Define Data Types
 */

// === Any
Types.Any = Symbol('Any');
createDataType({
  aliases: [Types.Any]
});

// === String
Types.String = String;
createDataType({
  checkType: v => typeof v === 'string',
  cast: v => `${v}`,
  aliases: [Types.String],
  assertions: {
    $minlength: (act, opt) => act.length >= opt,
    $maxlength: (act, opt) => act.length <= opt,
    $fixedwidth: (act, opt) => act.length === opt,
    $regex: (act, opt) => opt.test(act)
  }
});

// === Number
Types.Number = Number;
createDataType({
  checkType: v => !isNan(v),
  cast: v => parseFloat(v),
  aliases: [Types.Number],
  assertions: {
    $gt: (act, opt) => act > opt,
    $gte: (act, opt) => act >= opt,
    $lt: (act, opt) => act < opt,
    $lte: (act, opt) => act <= opt,
    $eq: (act, opt) => act === opt,
    $neq: (act, opt) => act !== opt
  }
});

// === Boolean;
Types.Boolean = Boolean;
createDataType({
  checkType: v => (typeof v === 'boolean'),
  cast: v => !!v,
  aliases: [Types.Boolean],
  assertions: {
    $eq: (act, opt) => act === opt,
    $neq: (act, opt) => act !== opt
  }
});

// === Date
Types.Date = Date;
createDataType({
  checkType: v => {
    return (v instanceof Date) && v.toString() !== 'Invalid Date';
  },
  cast: v => new Date(v),
  aliases: [Types.Date],
  assertions: {
    $gt: (act, opt) => act > opt,
    $lt: (act, opt) => act < opt
  }
});
