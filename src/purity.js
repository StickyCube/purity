'use strict';

const DataTypeValidator = require('./data-type-validator');
const DataTransform = require('./data-transform');
const Schema = require('./schema');

let Types = require('./known-types').Types;

function isNan (val) {
  return (val !== val) || (typeof val !== 'number');
}

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

// if env !== production
module.exports.DataTypeValidator = DataTypeValidator;
// endif

Types.Any = Symbol('Any');
module.exports.createDataType({
  aliases: [Types.Any]
});

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

Types.Boolean = Boolean;
module.exports.createDataType({
  checkType: val => typeof val === 'boolean',
  aliases: [Types.Boolean],
  assertions: {
    $eq: (act, opt) => act === opt,
    $neq: (act, opt) => act !== opt
  }
});

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
