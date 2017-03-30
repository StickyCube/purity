
function create (schemaInfo) {
  return {
    error: function (reason, AST) {
      return {
        result: AST.value,
        errors: [
          {
            reason,
            schemaInfo,
            value: AST.value,
            valueInfo: AST.info,
            valueType: AST.type
          }
        ]
      };
    },

    success: function (AST) {
      return { result: AST.value };
    }
  };
}

export default { create };
