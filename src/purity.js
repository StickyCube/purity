'use strict';

import { isNan, ensureArray } from './utils';

import SchemaObject from './schema';
import { Types, defineType } from './data-types';

export { Types };
export { ValidationError } from './validation-error';

export function Schema () {
  return new SchemaObject(...arguments);
}

export function createDataType (opts) {
  opts.aliases = ensureArray(opts.aliases);

  if (!opts.aliases.length) {
    throw new Error('options.aliases requires at least one alias');
  }

  defineType(opts);
}

/**
 * Define Data Types
 */

// === Any
createDataType({
  aliases: [Types.Any]
});

// === String
createDataType({
  checkType: v => typeof v === 'string',
  cast: v => `${v}`,
  aliases: [Types.String, String],
  assertions: {
    $minlength: (act, opt) => act.length >= opt,
    $maxlength: (act, opt) => act.length <= opt,
    $fixedwidth: (act, opt) => act.length === opt,
    $regex: (act, opt) => opt.test(act)
  }
});

// === Number
createDataType({
  checkType: v => !isNan(v),
  cast: v => parseFloat(v),
  aliases: [Types.Number, Number],
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
createDataType({
  checkType: v => (typeof v === 'boolean'),
  cast: v => !!v,
  aliases: [Types.Boolean, Boolean],
  assertions: {
    $eq: (act, opt) => act === opt,
    $neq: (act, opt) => act !== opt
  }
});

// === Date
createDataType({
  checkType: v => {
    return (v instanceof Date) && v.toString() !== 'Invalid Date';
  },
  cast: v => new Date(v),
  aliases: [Types.Date, Date],
  assertions: {
    $gt: (act, opt) => act > opt,
    $lt: (act, opt) => act < opt
  }
});
