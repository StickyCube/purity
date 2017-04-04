import {Errors, Types} from '../Constants.js';

export function valueType (expectedType) {
  return {
    name: '$',
    error: Errors.TypeMismatchError,
    when: function () {
      return true;
    },
    test: function (AST) {
      return AST.type === expectedType;
    }
  };
}

export function requiredValue () {
  return {
    name: 'required',
    error: Errors.RequiredFieldError,
    when: function (AST, expectations) {
      return expectations.required;
    },
    test: function (AST, expectations) {
      return AST.type !== Types.NIL;
    }
  };
}

export function minLength () {
  return {
    name: 'minlength',
    error: Errors.OutOfBoundsError,
    when: function (AST, expectations) {
      return expectations.minlength >= 0;
    },
    test: function (AST, expectations) {
      return AST.value.length >= expectations.minlength;
    }
  };
}

export function maxLength () {
  return {
    name: 'maxlength',
    error: Errors.OutOfBoundsError,
    when: function (AST, expectations) {
      return expectations.maxlength > 0;
    },
    test: function (AST, expectations) {
      return AST.value.length <= expectations.maxlength;
    }
  };
}

export function regexpMatch () {
  return {
    name: 'match',
    error: Errors.InvalidValueError,
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
