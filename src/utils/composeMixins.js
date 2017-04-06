
export default function composeMixins (...mixins) {
  return mixins.reduce(
    (combined, mixin) => [
      ...combined,
      ...ensureArray(mixin)
    ],
    []
  );
}

function ensureArray (value) {
  return Array.isArray(value)
    ? value
    : [value];
}
