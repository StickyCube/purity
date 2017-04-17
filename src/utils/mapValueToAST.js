import {Type} from '../constants.js';

export default function mapValueToAST (value, info = {}) {
  const AST = {
    value: value,
    info: info,
    type: getTypeForValue(value),
    fields: null
  };

  if (AST.type === Type.OBJECT || AST.type === Type.ARRAY) {
    AST.fields = getASTFieldsForEnumerable(AST);
  }

  return AST;
}

function getASTFieldsForEnumerable (AST) {
  return Object.keys(AST.value).map(path => {
    let fieldPath;

    if (AST.info.path == null) {
      fieldPath = path;
    } else {
      fieldPath = `${AST.info.path}.${path}`;
    }

    return mapValueToAST(
      AST.value[path],
      {
        path: fieldPath,
        parent: AST
      }
    );
  });
}

function getTypeForValue (value) {
  if (value == null || isNan(value)) {
    return Type.NIL;
  }

  if (typeof value === 'string') {
    return Type.STRING;
  }

  if (typeof value === 'number') {
    return Type.NUMBER;
  }

  if (typeof value === 'boolean') {
    return Type.BOOLEAN;
  }

  if (Array.isArray(value)) {
    return Type.ARRAY;
  }

  return Type.OBJECT;
}

function isNan (value) {
  return value !== value; // eslint-disable-line no-self-compare
}
