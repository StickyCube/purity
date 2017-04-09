import {ErrorTypes} from '../../constants.js';

export default function arrayLike () {
  return [
    {
      name: 'maxlength',
      error: ErrorTypes.Invalid,
      when: function (AST, expectations) {
        return expectations.maxlength > 0;
      },
      test: function (AST, expectations) {
        return AST.value.length <= expectations.maxlength;
      }
    },
    {
      name: 'minlength',
      error: ErrorTypes.Invalid,
      when: function (AST, expectations) {
        return expectations.minlength >= 0;
      },
      test: function (AST, expectations) {
        return AST.value.length >= expectations.minlength;
      }
    }
  ];
}
