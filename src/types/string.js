import Type from 'constants/Type.js';
import declareType from 'utils/declareType.js';
import composeMixins from 'utils/composeMixins.js';
import valueType from 'mixins/valueType.js';
import requiredValue from 'mixins/requiredValue.js';
import arrayLike from 'mixins/arrayLike.js';
import regexpMatch from 'mixins/regexpMatch.js';

export default declareType({
  ignore: function (AST, expectations) {
    return (
      AST.type === Type.NIL &&
      !expectations.required
    );
  },
  mixins: composeMixins(
    requiredValue(),
    valueType(Type.STRING),
    arrayLike(),
    regexpMatch()
  )
});
