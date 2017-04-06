import Type from 'constants/Type.js';
import {ErrorTypes} from 'constants/Errors.js';

export default function requiredValue () {
  return {
    name: 'required',
    error: ErrorTypes.RequiredValue,
    when: function (AST, expectations) {
      return expectations.required;
    },
    test: function (AST, expectations) {
      return AST.type !== Type.NIL;
    }
  };
}
