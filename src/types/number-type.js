'use strict';

function isNan (v) {
  return (typeof v === 'number') && v !== v;
}

module.exports = {
  cast: val => {
    if (typeof val === 'boolean') {
      return val ? 1 : 0;
    }

    let parsed = parseFloat(val);
    return isNan(parsed)
      ? 0
      : parsed;
  },
  checkType: val => typeof val === 'number' && !isNan(val),
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
    $tofixed: (val, opt) => val.toFixed(opt)
  }
};
