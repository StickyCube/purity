import isEmpty from 'lodash.isempty';
import ValidationError, {ErrorTypes} from 'constants/Errors.js';
import mapValueToAST from 'utils/mapValueToAST.js';

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
  const error = formatError(errors, options.formatErrorMessage);

  if (error) {
    throw error;
  }

  return result;
}

function formatError (errors, formatErrorMessage = defaultFormatErrorMessage) {
  if (isEmpty(errors)) {
    return null;
  }

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
    case ErrorTypes.RequiredValue:
      message += 'Missing required value';
  }

  if (error.valueInfo.path) {
    message += ` at ${error.valueInfo.path}`;
  }

  return message;
}
