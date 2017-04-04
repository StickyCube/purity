
export function create ({ AST, expectations }) {
  return function (failures) {
    if (failures == null) {
      return { result: AST.value };
    }

    return {
      errors: failures.map(spec => ({
        name: spec.error,
        value: AST.value,
        valueType: AST.type,
        valueInfo: AST.info,
        expectationName: spec.name,
        expectationValue: expectations[spec.name],
        expectations
      }))
    };
  };
}

export default { create };
