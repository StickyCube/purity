import {ErrorTypes, Type} from '../../constants.js';

export default function requiredValue () {
  return {
    name: 'required',
    error: ErrorTypes.Required,
    when: function (AST, expectations) {
      return expectations.required;
    },
    test: function (AST, expectations) {
      return AST.type !== Type.NIL;
    }
  };
}
