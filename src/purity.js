'use strict';

let DataTypeValidator = require('./data-type-validator');
let Schema = require('./schema');

module.exports.Schema = Schema;

module.exports.Types = DataTypeValidator.Types;
module.exports.defineDataType = DataTypeValidator.define;

// === define buit in types
let stringType = require('./types/string-type');
let numberType = require('./types/number-type');
let booleanType = require('./types/boolean-type');
let dateType = require('./types/date-type');

DataTypeValidator.define('String', stringType);
DataTypeValidator.define('Number', numberType);
DataTypeValidator.define('Boolean', booleanType);
DataTypeValidator.define('Date', dateType);
