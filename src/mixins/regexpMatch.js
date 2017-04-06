import {ErrorTypes} from 'constants/Errors.js';

export default function regexpMatch () {
  return {
    name: 'match',
    error: ErrorTypes.InvalidValue,
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
