'use strict';

module.exports = {
  cast: val => !!val,
  checkType: val => typeof val === 'boolean',
  aliases: [Boolean],
  assertions: {
    $eq: (act, opt) => act === opt,
    $neq: (act, opt) => act !== opt
  },
  mutators: {
    $not: v => !v
  }
};
