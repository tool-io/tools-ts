import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { parseNumericMatrix } from "../../parse/matrix/tool.js";

export type NumericTable = {
  readonly columns: readonly {
    readonly id: string;
    readonly label: string;
    readonly type: "number";
  }[];
  readonly kind: "table/number";
  readonly rows: readonly (readonly number[])[];
  readonly version: 1;
};

export const matrixAsTable = (text: string): NumericTable | null => {
  const matrix = parseNumericMatrix(text);
  return matrix
    ? {
        columns: Array.from({ length: matrix.columns }, (_, index) => ({
          id: `column-${index + 1}`,
          label: `Column ${index + 1}`,
          type: "number" as const,
        })),
        kind: "table/number",
        rows: matrix.values,
        version: 1,
      }
    : null;
};

export const matrixAsTableExample = {
  input: { matrix: "[[1,2],[3,4]]" },
  output: {
    table: {
      columns: [
        { id: "column-1", label: "Column 1", type: "number" },
        { id: "column-2", label: "Column 2", type: "number" },
      ],
      kind: "table/number",
      rows: [
        [1, 2],
        [3, 4],
      ],
      version: 1,
    },
  },
} satisfies ToolExample<
  { readonly matrix: string },
  { readonly table: NumericTable }
>;

export const matrixAsTableTool = createSimpleTool({
  id: "matrix/as-table",
  title: "Matrix as Table",
  description:
    "Convert a numeric matrix into a structured, versioned table value.",
  inputs: [
    { format: "matrix/number", id: "matrix", kind: "string", label: "Matrix" },
  ],
  outputs: [
    { format: "table/number", id: "table", kind: "object", label: "Table" },
  ],
  calculate: (input) => {
    const table = matrixAsTable(input.matrix as string);
    if (!table) return simpleError("matrix", "Enter a valid numeric matrix.");
    return { table };
  },
});

export const runMatrixAsTable = matrixAsTableTool.execute;
export default matrixAsTableTool;
