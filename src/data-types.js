'use strict';

import { Map, isArray } from './utils';

let types = new Map();

module.exports.Types = {};

export function put (aliases) {
  var id = Symbol();
  [id, ...aliases].forEach(alias => types.set(alias, id));
  return id;
}

export function resolve (alias) {
  if (isArray(alias)) return alias.map(resolve);
  return types.get(alias);
}
