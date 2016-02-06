'use strict';

const DataTypeValidator = require('./data-type-validator');
const ValidationError = require('./validation-error');
const DataTransform = require('./data-transform');
const Schema = require('./schema');

let Types = require('./known-types').Types;

function isNan (val) {
  return (val !== val) || (typeof val !== 'number');
}

module.exports.ValidationError = ValidationError;

module.exports.createDataType = function (config) {
  if (!config.aliases) {
    throw new Error('options.aliases is required');
  }

  if (!config.aliases.length) {
    throw new Error('options.aliases requires at least one alias');
  }

  DataTypeValidator.define(config);
};

module.exports.createTransform = function (operator, config) {
  if (!config.restrict) {
    config.restrict = [Types.Any];
  }

  if (!Array.isArray(config.restrict)) {
    config.restrict = [config.restrict];
  }

  DataTransform.define(operator, config);
};

module.exports.Types = Types;
module.exports.Schema = Schema;

/**
 * Define Data Types
 */

// === Any
Types.Any = Symbol('Any');
module.exports.createDataType({
  aliases: [Types.Any]
});

// === String
Types.String = String;
module.exports.createDataType({
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
module.exports.createDataType({
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
module.exports.createDataType({
  checkType: val => typeof val === 'boolean',
  aliases: [Types.Boolean],
  assertions: {
    $eq: (act, opt) => act === opt,
    $neq: (act, opt) => act !== opt
  }
});

// === Date
Types.Date = Date;
module.exports.createDataType({
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

let transform = module.exports.createTransform;

// === String transformations
transform('$cast', {
  restrict: [String],
  transform: v => `${v}`
});

transform('$uppercase', {
  restrict: [String],
  transform: v => v.toUpperCase()
});

transform('$lowercase', {
  restrict: [String],
  transform: v => v.toLowerCase()
});

transform('$replace', {
  restrict: [String],
  transform: function () {
    var args = [...arguments];
    var val = args.shift();
    return val.replace(...args);
  }
});

transform('$substring', {
  restrict: [String],
  transform: function () {
    var args = [...arguments];
    var val = args.shift();
    return val.substring(...args);
  }
});

transform('$substr', {
  restrict: [String],
  transform: function () {
    var args = [...arguments];
    var val = args.shift();
    return val.substr(...args);
  }
});

// === Number transformations
transform('$cast', {
  restrict: [Number],
  transform: v => {
    let parsed = parseFloat(v);
    return isNan(parsed)
      ? 0
      : parsed;
  }
});

transform('$toprecision', {
  restrict: [Number],
  transform: (v, n) => parseFloat(v.toPrecision(n))
});

transform('$tofixed', {
  restrict: [Number],
  transform: (v, n) => parseFloat(v.toFixed(n))
});

transform('$inc', {
  restrict: [Number],
  transform: (v, n) => v + n
});

transform('$dec', {
  restrict: [Number],
  transform: (v, n) => v + n
});

transform('$mul', {
  restrict: [Number],
  transform: (v, n) => v * n
});

transform('$div', {
  restrict: [Number],
  transform: (v, n) => v / n
});

transform('$mod', {
  restrict: [Number],
  transform: (v, n) => v % n
});

// === Boolean transformations
transform('$cast', {
  restrict: [Boolean],
  transform: v => !!v
});

transform('$not', {
  restrict: [Boolean],
  transform: v => !v
});

// === Date transformations
transform('$cast', {
  restrict: [Date],
  transform: v => new Date(v)
});
