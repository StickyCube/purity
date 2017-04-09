import {Type} from '../constants.js';
import declareType from './utils/declareType.js';
import composeMixins from './utils/composeMixins.js';
import typeChecked from './mixins/typeChecked.js';
import requiredValue from './mixins/requiredValue.js';
import arithmeticComparators from './mixins/arithmeticComparators.js';
import matchable from './mixins/matchable.js';

export default declareType({
  ignore: function (AST, expectations) {
    return (
      AST.type === Type.NIL &&
      !expectations.required
    );
  },
  mixins: composeMixins(
    typeChecked(Type.NUMBER),
    requiredValue(),
    arithmeticComparators(),
    matchable()
  )
});
