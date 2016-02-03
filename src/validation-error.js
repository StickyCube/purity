'use strict';

var config = require('./config');

class DataValidationError extends Error {
  constructor (opt) {
    super();
    this.type = opt.type;
    this.path = opt.path;

    let template = opt.isMiddleware
      ? config.get('middlewareTemplate')
      : config.get(`{$this.type}Template`);

    this.message = this._createMessage(template);
  }

  _createMessage (template) {
    return template
      .replace(/\${(path)}/ig, this.path)
      .replace(/\${(errorType)}/, this.type);
  }
}

module.exports = DataValidationError;
