import {ValidationError, Errors} from './Constants.js';
import mapValueToAST from './mapValueToAST.js';

export function validateAsync (schema, data, options = {}) {
  return new Promise(function (resolve, reject) {
    let result;

    try {
      result = validateSync(schema, data, options);
    } catch (error) {
      return reject(error);
    }

    return resolve(result);
  });
}

export function validateSync (schema, data, options = {}) {
  const AST = mapValueToAST(data);
  const {result, errors} = schema(AST);
  const error = formatError(errors, options);

  if (error) {
    throw error;
  }

  return result;
}

function formatError (errors, options) {
  if (isEmpty(errors)) {
    return null;
  }

  const {formatErrorMessage = defaultFormatErrorMessage} = options;

  const message = formatErrorMessage(errors);

  const error = new ValidationError(message);

  error.errors = errors;

  return error;
}

function defaultFormatErrorMessage (errors) {
  errors.map(mapErrorToMessage).join(', ');
}

function mapErrorToMessage (error) {
  let message = '';

  switch (error.name) {
    case Errors.RequiredFieldError:
      message += 'Missing required value';
  }

  if (error.valueInfo.path) {
    message += ` at ${error.valueInfo.path}`;
  }

  return message;
}

function isEmpty (value) {
  return (
    value == null ||
    value.length === 0
  );
}
