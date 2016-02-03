'use strict';

var types = new Map();

module.exports.Types = {};

module.exports.put = function (aliases) {
  var id = Symbol();
  [id, ...aliases].forEach(alias => types.set(alias, id));
  return id;
};

module.exports.resolve = function (alias) {
  if (Array.isArray(alias)) return alias.map(module.exports.resolve);
  return types.get(alias);
};
