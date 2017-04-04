import ResultFormatter from '../ResultFormatter.js';

export default options => (expectations = {}) => AST => {
  const shouldIgnore = options.ignore || defaultShouldIgnore;

  const mergedExpectations = mergeExpectationsWithDefaults(
    expectations,
    options.defaultExpectations || {}
  );

  const format = ResultFormatter.create({
    AST,
    expectations: mergedExpectations
  });

  if (shouldIgnore(AST, mergedExpectations)) {
    return format();
  }

  const failingSpecs = getFailingSpecs(
    options.specs,
    AST,
    mergedExpectations
  );

  return failingSpecs.length > 0
    ? format(failingSpecs)
    : format();
};

function mergeExpectationsWithDefaults (expectations = {}, defaults = {}) {
  return {...defaults, ...expectations};
}

function getFailingSpecs (specs, AST, expectations) {
  const failingSpecs = [];

  for (let i = 0, len = specs.length; i < len; i += 1) {
    let spec = specs[i];

    if (!spec.when(AST, expectations)) {
      continue;
    }

    if (!spec.test(AST, expectations)) {
      failingSpecs.push(spec);
    }
  }

  return failingSpecs;
}

function defaultShouldIgnore () {
  return false;
}
