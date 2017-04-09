import declareType from './utils/declareType.js';
import composeMixins from './utils/composeMixins.js';
import valueWhitelist from './mixins/valueWhitelist.js';

export default declareType({
  defaultExpectations: {
    values: []
  },
  mixins: composeMixins(
    valueWhitelist()
  )
});
