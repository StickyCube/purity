'use strict';

import Map from 'es6-map';

export { Promise } from 'es6-promise';
export { Map };

export const isValue = v => v != null;
export const isSchema = v => isValue(v) && v._isPuritySchema_;
export const isArray = v => Array.isArray(v);
export const isFunction = v => (typeof v === 'function');
export const isPlainObject = v => isValue(v) && (v.constructor === Object);
export const isNan = v => (v !== v) || (typeof v !== 'number');
export const isEndpoint = v => isPlainObject(v) && ('$type' in v);
export const identity = v => v;
export const isMissing = v => !isValue(v) || v === '';

export const ensureArray = v => {
  if (!isValue(v)) return [];
  if (!isArray(v)) return [v];
  return v;
};

export const clone = obj => {
  let copy = {};
  let orig = obj || {};

  for (let key in orig) {
    copy[key] = orig[key];
  }

  return copy;
};
