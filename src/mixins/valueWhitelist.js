import {ErrorTypes} from 'constants/Errors.js';

export default function valueWhitelist () {
  return {
    name: 'values',
    error: ErrorTypes.InvalidValue,
    when: function (AST, expectations) {
      return Array.isArray(expectations.values);
    },
    test: function (AST, expectations) {
      return expectations.values.includes(AST.value);
    }
  };
}
