import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { parseNumericMatrix } from "../../parse/matrix/tool.js";
import type { TableData } from "../../table/definition.js";

export const matrixAsTable = (input: unknown): TableData | null => {
  const matrix = parseNumericMatrix(input);
  return matrix
    ? {
        kind: "tool.io/table",
        rows: matrix.values,
        schema: {
          fields: Array.from({ length: matrix.columns }, (_, index) => ({
            dataType: { bits: 64, kind: "float" as const },
            id: `column-${index + 1}`,
            label: `Column ${index + 1}`,
            nullable: false,
          })),
        },
        version: 1,
      }
    : null;
};

export const matrixAsTableExample = {
  input: { matrix: "[[1,2],[3,4]]" },
  output: {
    table: {
      kind: "tool.io/table",
      rows: [
        [1, 2],
        [3, 4],
      ],
      schema: {
        fields: [
          {
            dataType: { bits: 64, kind: "float" },
            id: "column-1",
            label: "Column 1",
            nullable: false,
          },
          {
            dataType: { bits: 64, kind: "float" },
            id: "column-2",
            label: "Column 2",
            nullable: false,
          },
        ],
      },
      version: 1,
    },
  },
} satisfies ToolExample<
  { readonly matrix: string },
  { readonly table: TableData }
>;

export const matrixAsTableTool = createSimpleTool({
  id: "matrix/as-table",
  title: "Matrix as Table",
  description:
    "Convert a finite rectangular numeric matrix into canonical tool.io TableData with one Float64 field per matrix column.",
  inputs: [
    { format: "matrix/number", id: "matrix", kind: "string", label: "Matrix" },
  ],
  outputs: [
    { format: "tool.io/table", id: "table", kind: "object", label: "Table" },
  ],
  calculate: (input) => {
    const table = matrixAsTable(input.matrix as string);
    if (!table) return simpleError("matrix", "Enter a valid numeric matrix.");
    return { table };
  },
});

export const runMatrixAsTable = matrixAsTableTool.execute;
export default matrixAsTableTool;
