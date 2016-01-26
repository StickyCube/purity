'use strict';

function isNan (v) {
  return (typeof v === 'number') && v !== v;
}

module.exports = {
  cast: val => new Date(val),
  checkType: val => {
    if (val instanceof Date) {
      return val.toString() !== 'Invalid Date';
    }

    return !isNan(val);
  },
  aliases: [Date],
  assertions: {
    $gt: (act, opt) => act > opt,
    $gte: (act, opt) => act >= opt,
    $lt: (act, opt) => act < opt,
    $lte: (act, opt) => act <= opt
  }
};
