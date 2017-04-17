import declareType from './utils/declareType.js';
import composeMixins from './utils/composeMixins.js';
import typeChecked from './mixins/typeChecked.js';
import requiredValue from './mixins/requiredValue.js';
import arrayLike from './mixins/arrayLike.js';
import {Type} from '../constants.js';

export default declareType({
  ignore: function (AST, expectations) {
    return (
      AST.type === Type.NIL &&
      !expectations.required
    );
  },
  mixins: composeMixins(
    typeChecked(Type.ARRAY),
    requiredValue(),
    arrayLike()
  )
});
