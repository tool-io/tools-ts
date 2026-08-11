import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { parseNumericMatrix } from "../../parse/matrix/tool.js";

export const matrixAsJson = (
  input: unknown,
  indentation: number,
): string | null => {
  const matrix = parseNumericMatrix(input);
  return matrix && [0, 2, 4].includes(indentation)
    ? JSON.stringify(matrix.values, null, indentation)
    : null;
};

export const matrixAsJsonExample = {
  input: { indentation: 2, matrix: "1 2\n3 4" },
  output: { json: "[\n  [\n    1,\n    2\n  ],\n  [\n    3,\n    4\n  ]\n]" },
} satisfies ToolExample<
  { readonly indentation: number; readonly matrix: string },
  { readonly json: string }
>;

export const matrixAsJsonTool = createSimpleTool({
  id: "matrix/as-json",
  title: "Matrix as JSON",
  description: "Convert a numeric matrix into a JSON array of rows.",
  inputs: [
    { format: "matrix/number", id: "matrix", kind: "string", label: "Matrix" },
    {
      id: "indentation",
      kind: "integer",
      label: "Indentation",
      maximum: 4,
      minimum: 0,
    },
  ],
  outputs: [
    { format: "application/json", id: "json", kind: "string", label: "JSON" },
  ],
  calculate: (input) => {
    const json = matrixAsJson(
      input.matrix as string,
      input.indentation as number,
    );
    if (json === null)
      return simpleError(
        "matrix",
        "Enter a valid numeric matrix and indentation.",
      );
    return { json };
  },
});

export const runMatrixAsJson = matrixAsJsonTool.execute;
export default matrixAsJsonTool;
