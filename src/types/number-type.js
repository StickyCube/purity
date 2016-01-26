'use strict';

function isNan (v) {
  return (typeof v === 'number') && v !== v;
}

module.exports = {
  cast: val => parseFloat(val),
  checkType: val => !isNan(val),
  aliases: [Number],
  assertions: {
    $gt: (act, opt) => act > opt,
    $gte: (act, opt) => act >= opt,
    $lt: (act, opt) => act < opt,
    $lte: (act, opt) => act <= opt,
    $eq: (act, opt) => act === opt,
    $neq: (act, opt) => act !== opt
  },
  mutators: {
    $tofixed: (val, opt) => val.tofixed(opt)
  }
}
