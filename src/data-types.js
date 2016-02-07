'use strict';

import { Map, isArray } from './utils';

let types = new Map();

module.exports.Types = {};

export function createNewType (aliases) {
  aliases.forEach(alias => {
    if (resolveIdForAlias(alias)) {
      throw new Error(`A type with alias ${alias} is already defined`);
    }
  });

  let id = Symbol();

  [id, ...aliases].forEach(alias => types.set(alias, id));

  return id;
}

export function resolveIdForAlias (alias) {
  if (isArray(alias)) return alias.map(resolveIdForAlias);
  return types.get(alias);
}
