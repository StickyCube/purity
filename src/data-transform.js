'use strict';

import { resolve, Types } from './data-types';
import { Map, identity } from './utils';

let Transformations = {};

function parseArgument (arg) {
  if (arg === 'undefined') {
    return undefined;
  }

  try {
    return JSON.parse(arg);
  } catch (e) {
    return arg;
  }
}

class TransformerPipeline {
  constructor (transformations) {
    this.transformations = transformations;
  }

  evaluate (data) {
    return this.transformations
      .reduce((value, transform) => transform.exec(value), data);
  }
}

export default class Transformer {
  constructor (config, args) {
    this.config = config;
    this.args = args;
  }

  exec (value) {
    return this.config.transform(value, ...this.args);
  }

  static define (operator, config) {
    config.transform = config.transform || identity;

    let aliases = resolve(config.restrict);
    let mapped = Transformations[operator];

    if (!mapped) {
      mapped = new Map();
    }

    aliases.forEach(id => {
      mapped.set(id, config);
    });

    Transformations[operator] = mapped;
  }

  static parse (pipeline, id) {
    let transformations = pipeline.reduce((transforms, data) => {
      let args = data.split(':').map(parseArgument);
      let operator = args.shift();
      let mapped = Transformations[operator];

      if (!mapped) {
        return transforms;
      }

      let any = resolve(Types.Any);
      let config = mapped.get(id) || mapped.get(any);

      if (!config) {
        return transforms;
      }

      transforms.push(new Transformer(config, args));
      return transforms;
    }, []);

    return new TransformerPipeline(transformations);
  }
}
