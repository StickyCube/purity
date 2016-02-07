'use strict';

import { Promise } from './utils';
import ValidatonError from './validation-error';

export default class {

  constructor (options) {
    this.options = options || {};
  }

  error (type) {
    let err = new ValidatonError({
      type: type,
      path: this.options.path || ''
    });

    return Promise.reject(err);
  }
}
