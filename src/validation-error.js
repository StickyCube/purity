'use strict';

var config = require('./config');

function createMessage (template) {
  return template
    .replace(/\${(path)}/ig, this.path)
    .replace(/\${(errorType)}/, this.type);
}

class DataValidationError extends Error {
  constructor (opt) {
    super();
    this.type = opt.type;
    this.path = opt.path;

    let template = config.get(`${this.type}Template`);
    this.message = createMessage.call(this, template);
  }
}

module.exports = DataValidationError;
