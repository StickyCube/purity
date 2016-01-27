'use strict';

const utils = require('../utils');

module.exports = {
  cast: val => parseFloat(val),
  checkType: val => !utils.isNan(val),
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
