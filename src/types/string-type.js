'use strict';

module.exports = {
  cast: val => String(val),
  checkType: val => typeof val === 'string',
  aliases: [String],
  assertions: {
    $minlength: (act, opt) => act.length >= opt,
    $maxlength: (act, opt) => act.length <= opt,
    $fixedwidth: (act, opt) => act.length === opt,
    $regex: (act, opt) => opt.test(act)
  },
  mutators: {
    $toupper: val => val.toUpperCase(),
    $tolower: val => val.toLowerCase(),
    $replace: (val, opt) => val.replace(...opt)
  }
};
