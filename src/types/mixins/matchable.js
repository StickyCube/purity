import {ErrorTypes} from '../../constants.js';

export default function matchable () {
  return {
    name: 'match',
    error: ErrorTypes.Invalid,
    when: function (AST, expectations) {
      return isRegExp(expectations.match);
    },
    test: function (AST, expectations) {
      return expectations.match.test(AST.value);
    }
  };
}

function isRegExp (value) {
  return (
    value != null &&
    value.constructor === RegExp
  );
}
