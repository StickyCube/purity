import {ErrorTypes} from '../../constants.js';

export default function typeChecked (expectedType) {
  return {
    name: '$',
    error: ErrorTypes.Invalid,
    when: function () {
      return true;
    },
    test: function (AST) {
      return AST.type === expectedType;
    }
  };
}
