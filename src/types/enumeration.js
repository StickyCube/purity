import {Errors} from '../Constants.js';
import declareType from './declareType.js';
import {ignoreIfNotRequired} from './utils.js';
import {requiredValue} from './expectations.js';

export default declareType({
  defaultExpectations: {
    values: []
  },
  specs: [
    {
      name: 'values',
      error: Errors.InvalidValueError,
      when: function (AST, expectations) {
        return Array.isArray(expectations.values);
      },
      test: function (AST, expectations) {
        return expectations.values.includes(AST.value);
      }
    }
  ]
});
