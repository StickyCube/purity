'use strict';

import * as config from './config';

function createMessage (template) {
  return template
    .replace(/\${(path)}/ig, this.path)
    .replace(/\${(errorType)}/, this.type);
}

export default class extends Error {
  constructor (opt) {
    super();
    this.type = opt.type;
    this.path = opt.path;

    let template = config.get(`${this.type}Template`);
    this.message = createMessage.call(this, template);
  }
}
