'use strict';

let templates = {
  // error message template for missing data
  missing: 'Missing required field ${path}',

  // error message template for invalid data
  invalid: 'Invalid data ${path}'
};

function createMessage (template) {
  return template
    .replace(/\${(path)}/ig, this.path)
    .replace(/\${(errorType)}/, this.type);
}

export class ValidationError {
  constructor (opt) {
    this.type = opt.type;
    this.path = opt.path;

    let template = templates[this.type];
    this.message = createMessage.call(this, template);
  }
}
