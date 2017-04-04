import {Types} from '../Constants.js';
import declareType from './declareType.js';
import {valueType, requiredValue, minLength, maxLength, regexpMatch} from './expectations.js';
import {ignoreIfNotRequired} from './utils.js';

export default declareType({
  ignore: ignoreIfNotRequired,
  specs: [
    requiredValue(),
    valueType(Types.STRING),
    minLength(),
    maxLength(),
    regexpMatch()
  ]
});
