import {ErrorTypes} from 'constants/Errors.js';

export default function valueType (expectedType) {
  return {
    name: '$',
    error: ErrorTypes.InvalidValue,
    when: function () {
      return true;
    },
    test: function (AST) {
      return AST.type === expectedType;
    }
  };
}
