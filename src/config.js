'use strict';

let options = {
  // error message template for missing data
  missingTemplate: 'Missing required field ${path}',

  // error message template for invalid data
  invalidTemplate: 'Invalid data ${path}',

  // error message template for express middleware
  middlewareTemplate: '${path} is ${errorType}'
};

module.exports.get = (key) => {
  return options[key];
};

module.exports.set = (key, value) => {
  options[key] = value;
};
