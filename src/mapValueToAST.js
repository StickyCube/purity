import {Types} from './Constants.js';

export default function mapValueToAST (value, info = {}) {
  return {
    value: value,
    info: info,
    type: getTypeForValue(value)
  };
}

function getTypeForValue (value) {
  if (value == null || isNan(value)) {
    return Types.NIL;
  }

  if (typeof value === 'string') {
    return Types.STRING;
  }

  if (typeof value === 'number') {
    return Types.NUMBER;
  }

  if (typeof value === 'boolean') {
    return Types.BOOLEAN;
  }

  if (Array.isArray(value)) {
    return Types.ARRAY;
  }

  return Types.OBJECT;
}

function isNan (value) {
  return value !== value; // eslint-disable-line no-self-compare
}
