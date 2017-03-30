import {Types, ErrorReasons} from './Constants.js';
import ResultFormatter from './ResultFormatter.js';

/**
 * Create a string type schema
 * @param {object} options
 * @param {boolean} options.strict
 * @param {boolean} options.required
 * @param {number} options.minlength
 * @param {number} options.maxlength
 */
export default function stringType (options = {}) {
  const formatter = ResultFormatter.create({ type: Types.STRING, options });

  return function stringValidator (AST) {
    if (AST.type === Types.NIL && options.required) {
      return formatter.error(ErrorReasons.VALUE_REQUIRED, AST);
    }

    if (AST.type === Types.NIL) {
      return formatter.success(AST);
    }

    if (AST.type !== Types.STRING) {
      return formatter.error(ErrorReasons.TYPE_MISMATCH, AST);
    }

    if (options.minlength >= 0 && AST.value.length < options.minlength) {
      return formatter.error(ErrorReasons.OUT_OF_RANGE, AST);
    }

    if (options.maxlength > 0 && AST.value.length > options.maxlength) {
      return formatter.error(ErrorReasons.OUT_OF_RANGE, AST);
    }

    return formatter.success(AST);
  };
}
