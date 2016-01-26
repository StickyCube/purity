'use strict';

module.exports = {
  cast: val => {
    if (val == null) {
      return new Date(undefined);
    }
    return new Date(val);
  },
  checkType: val => {
    return val instanceof Date && val.toString() !== 'Invalid Date';
  },
  aliases: [Date],
  assertions: {
    $gt: (act, opt) => act > opt,
    $lt: (act, opt) => act < opt
  }
};
