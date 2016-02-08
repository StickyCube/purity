'use strict';

import ok from 'ok-js';

export default class ValidationResult {
  constructor (options) {
    this.options = options || {};
  }

  get required () {
    return !!this.options.required;
  }

  get index () {
    return typeof this.options.index === 'number'
      ? this.options.index
      : null;
  }

  get value () {
    return this.options.value;
  }

  get path () {
    return this.options.path || '';
  }

  static inflateArray (results) {
    let data = [];

    for (let i = 0; i < results.length; i += 1) {
      let result = results[i];
      let index = result.index;
      let group = data[index] || [];

      group.push(result);
      data[index] = group;
    }

    return data.map(ValidationResult.inflateObject);
  }

  static inflateObject (results) {
    // Deal with edge case where the result object is a primitive value
    if (results.length === 1 && !results[0].path) {
      return results[0].value;
    }

    let data = {};

    for (let i = 0; i < results.length; i += 1) {
      let result = results[i];
      let path = result.path;
      let value = result.value;

      if (!result.required && typeof value === 'undefined') {
        ok.ensure(data, path.replace(/\.[^.]+$/, ''), {});
      } else {
        ok.set(data, path, value);
      }
    }

    return data;
  }
}
