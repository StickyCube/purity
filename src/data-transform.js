'use strict';

const utils = require('./utils');
const Map = utils.Map;

const knownTypes = require('./known-types');

const identity = v => v;

let Transformations = {};

function parseArgument (arg) {
  if (/^\d+(?:\.?\d+)?/.test(arg)) {
    return parseFloat(arg);
  }

  if (arg === 'true' || arg === 'false') {
    return arg === 'true';
  }

  if (arg === 'null') {
    return null;
  }

  if (arg === 'undefined') {
    return undefined;
  }

  return arg;
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

class Transformer {
  constructor (config, args) {
    this.config = config;
    this.args = args;
  }

  exec (value) {
    return this.config.transform(value, ...this.args);
  }

  static define (operator, config) {
    config.transform = config.transform || identity;

    let aliases = knownTypes.resolve(config.restrict);
    let mapped = Transformations[operator];

    console.log(config.restrict);
    console.log(aliases);

    if (!mapped) {
      mapped = new Map();
    }

    aliases.forEach(id => {
      mapped.set(id, config);
    });

    console.log(knownTypes.resolve(knownTypes.Types.Any), mapped.has(knownTypes.resolve(knownTypes.Types.Any)));

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

      let any = knownTypes.resolve(knownTypes.Types.Any);
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

module.exports = Transformer;
