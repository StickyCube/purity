import {ErrorTypes} from '../../constants.js';

export default function valueWhitelist () {
  return {
    name: 'values',
    error: ErrorTypes.Invalid,
    when: function (AST, expectations) {
      return Array.isArray(expectations.values);
    },
    test: function (AST, expectations) {
      return expectations.values.includes(AST.value);
    }
  };
}
