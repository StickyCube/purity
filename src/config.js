'use strict';

let options = {
  // error message template for missing data
  missingTemplate: 'Missing required field ${path}',

  // error message template for invalid data
  invalidTemplate: 'Invalid data ${path}'
};

export function get (key) {
  return options[key];
}

export function set (key, value) {
  options[key] = value;
}
