'use strict';

const DEFAULT_MISSING_TEMPLATE = 'Required field ${path} is missing.';
const DEFAULT_INVALID_TEMPLATE = 'Field ${path} has an invalid value';

class DataValidationError extends Error {
  constructor (message) {
    super();
    this.message = message;
  }

  static _createMessage (template, source) {
    return template.replace(/\${(path)}/ig, source.path);
  }

  static create (type, source) {
    let template = DataValidationError.Templates[type];
    let message = DataValidationError._createMessage(template, source);
    return new DataValidationError(message);
  }
}

DataValidationError.Templates = {
  missing: DEFAULT_MISSING_TEMPLATE,
  invalid: DEFAULT_INVALID_TEMPLATE
};

module.exports = DataValidationError;
