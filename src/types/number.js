import Type from 'constants/Type.js';
import declareType from 'utils/declareType.js';
import composeMixins from 'utils/composeMixins.js';
import valueType from 'mixins/valueType.js';
import requiredValue from 'mixins/requiredValue.js';
import arithmeticComparators from 'mixins/arithmeticComparators.js';

export default declareType({
  ignore: function (AST, expectations) {
    return (
      AST.type === Type.NIL &&
      !expectations.required
    );
  },
  mixins: composeMixins(
    valueType(Type.NUMBER),
    requiredValue(),
    arithmeticComparators()
  )
});
