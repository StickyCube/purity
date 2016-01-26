'use strict';

module.exports = {
  cast: val => !!val,
  checkType: val => typeof val === 'boolean',
  aliases: [Boolean]
};
