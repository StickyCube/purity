import {Type} from '../constants.js';
import declareType from './utils/declareType.js';
import composeMixins from './utils/composeMixins.js';
import typeChecked from './mixins/typeChecked.js';
import requiredValue from './mixins/requiredValue.js';
import arrayLike from './mixins/arrayLike.js';
import matchable from './mixins/matchable.js';

export default declareType({
  ignore: function (AST, expectations) {
    return (
      AST.type === Type.NIL &&
      !expectations.required
    );
  },
  mixins: composeMixins(
    requiredValue(),
    typeChecked(Type.STRING),
    arrayLike(),
    matchable()
  )
});
