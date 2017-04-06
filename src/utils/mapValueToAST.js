import Type from 'constants/Type.js';

export default function mapValueToAST (value, info = {}) {
  return {
    value: value,
    info: info,
    type: getTypeForValue(value)
  };
}

function getTypeForValue (value) {
  if (value == null || isNan(value)) {
    return Type.NIL;
  }

  if (typeof value === 'string') {
    return Type.STRING;
  }

  if (typeof value === 'number') {
    return Type.NUMBER;
  }

  if (typeof value === 'boolean') {
    return Type.BOOLEAN;
  }

  if (Array.isArray(value)) {
    return Type.ARRAY;
  }

  return Type.OBJECT;
}

function isNan (value) {
  return value !== value; // eslint-disable-line no-self-compare
}
