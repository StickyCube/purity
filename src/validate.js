import {ValidationError} from './Constants.js';
import mapValueToAST from './mapValueToAST.js';

export default function validate (schema, data, options = {}) {
  const AST = mapValueToAST(data);
  const {result, errors} = schema(AST);
  const error = formatError(errors, options);

  return new Promise(function (resolve, reject) {
    return error
      ? reject(error)
      : resolve(result);
  });
}

function formatError (errors, options) {
  if (isEmpty(errors)) {
    return null;
  }

  const message = options.formatErrorMessage
    ? options.formatErrorMessage(errors)
    : defaultErrorMessageFormatter(errors);

  const error = new ValidationError(message);

  error.errors = errors;

  return error;
}

function isEmpty (value) {
  return (
    value == null ||
    value.length === 0
  );
}

function defaultErrorMessageFormatter (errors) {
  return errors.map(e => e.reason).join(', ');
}
