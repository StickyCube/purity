'use strict';

import { isNan, isArray } from './utils';
import { Types } from './data-types';

import SchemaObject from './schema';
import DataValidator from './data-validator';
import DataTransform from './data-transform';

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

export function createTransform (operator, opts) {
  if (!opts.restrict) {
    opts.restrict = [Types.Any];
  }

  if (!isArray(opts.restrict)) {
    opts.restrict = [opts.restrict];
  }

  DataTransform.define(operator, opts);
}

module.exports.Types = Types;

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
  checkType: val => typeof val === 'string',
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
  checkType: val => !isNan(val),
  aliases: [Number],
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
  checkType: val => typeof val === 'boolean',
  aliases: [Types.Boolean],
  assertions: {
    $eq: (act, opt) => act === opt,
    $neq: (act, opt) => act !== opt
  }
});

// === Date
Types.Date = Date;
createDataType({
  checkType: val => {
    return val instanceof Date && val.toString() !== 'Invalid Date';
  },
  aliases: [Types.Date],
  assertions: {
    $gt: (act, opt) => act > opt,
    $lt: (act, opt) => act < opt
  }
});

/**
 * Define Data Tranforms
 */

// === String transformations
createTransform('$cast', {
  restrict: [String],
  transform: v => `${v}`
});

createTransform('$uppercase', {
  restrict: [String],
  transform: v => v.toUpperCase()
});

createTransform('$lowercase', {
  restrict: [String],
  transform: v => v.toLowerCase()
});

createTransform('$replace', {
  restrict: [String],
  transform: function () {
    var args = [...arguments];
    var val = args.shift();
    return val.replace(...args);
  }
});

createTransform('$substring', {
  restrict: [String],
  transform: function () {
    var args = [...arguments];
    var val = args.shift();
    return val.substring(...args);
  }
});

createTransform('$substr', {
  restrict: [String],
  transform: function () {
    var args = [...arguments];
    var val = args.shift();
    return val.substr(...args);
  }
});

// === Number transformations
createTransform('$cast', {
  restrict: [Number],
  transform: v => {
    let parsed = parseFloat(v);
    return isNan(parsed)
      ? 0
      : parsed;
  }
});

createTransform('$toprecision', {
  restrict: [Number],
  transform: (v, n) => parseFloat(v.toPrecision(n))
});

createTransform('$tofixed', {
  restrict: [Number],
  transform: (v, n) => parseFloat(v.toFixed(n))
});

createTransform('$inc', {
  restrict: [Number],
  transform: (v, n) => v + n
});

createTransform('$dec', {
  restrict: [Number],
  transform: (v, n) => v + n
});

createTransform('$mul', {
  restrict: [Number],
  transform: (v, n) => v * n
});

createTransform('$div', {
  restrict: [Number],
  transform: (v, n) => v / n
});

createTransform('$mod', {
  restrict: [Number],
  transform: (v, n) => v % n
});

// === Boolean transformations
createTransform('$cast', {
  restrict: [Boolean],
  transform: v => !!v
});

createTransform('$not', {
  restrict: [Boolean],
  transform: v => !v
});

// === Date transformations
createTransform('$cast', {
  restrict: [Date],
  transform: v => new Date(v)
});
