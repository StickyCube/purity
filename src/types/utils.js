import {Types} from '../Constants.js';

export function ignoreIfNotRequired (AST, expectations) {
  return (
    AST.type === Types.NIL &&
    !expectations.required
  );
}
