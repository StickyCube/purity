import {ErrorTypes} from '../../constants.js';

export default function arithmeticComparators () {
  return [
    {
      name: 'gt',
      error: ErrorTypes.Invalid,
      when: function (AST, expectations) {
        return typeof expectations.gt === 'number';
      },
      test: function (AST, expectations) {
        return AST.value > expectations.gt;
      }
    },
    {
      name: 'gte',
      error: ErrorTypes.Invalid,
      when: function (AST, expectations) {
        return typeof expectations.gte === 'number';
      },
      test: function (AST, expectations) {
        return AST.value >= expectations.gte;
      }
    },
    {
      name: 'lt',
      error: ErrorTypes.Invalid,
      when: function (AST, expectations) {
        return typeof expectations.lt === 'number';
      },
      test: function (AST, expectations) {
        return AST.value < expectations.lt;
      }
    },
    {
      name: 'lte',
      error: ErrorTypes.Invalid,
      when: function (AST, expectations) {
        return typeof expectations.lte === 'number';
      },
      test: function (AST, expectations) {
        return AST.value <= expectations.lte;
      }
    }
  ];
}
