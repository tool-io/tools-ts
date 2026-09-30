import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rowStart: number;
  readonly rowEnd: number;
  readonly columnIndices: readonly number[];
  readonly targetColumn: number;
};
export type Output = { readonly offset: number; readonly found: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowStart: { type: "integer", minimum: 0 },
    rowEnd: { type: "integer" },
    columnIndices: { type: "array", maxItems: 256, items: { type: "integer" } },
    targetColumn: { type: "integer", minimum: 0 },
  },
  required: ["rowStart", "rowEnd", "columnIndices", "targetColumn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "integer" }, found: { type: "boolean" } },
  required: ["offset", "found"],
} as const;
/** Calculate matrix csr row column local offset from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { rowStart, rowEnd, columnIndices, targetColumn } = input;
  const compute = (): Output => {
    H.integer(rowStart, 0, columnIndices.length);
    H.integer(rowEnd, rowStart, columnIndices.length);
    H.integer(targetColumn, 0);
    const local = columnIndices.slice(rowStart, rowEnd).indexOf(targetColumn);
    return { offset: local < 0 ? -1 : rowStart + local, found: local >= 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { rowStart: 1, rowEnd: 3, columnIndices: [0, 2, 4], targetColumn: 4 },
  output: { offset: 2, found: true },
} satisfies ToolExample<Input, Output>;
export const matrixCsrRowColumnLocalOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-csr-row-column-local-offset",
    title: "Matrix CSR Row Column Local Offset Tool",
    description:
      "Calculate matrix csr row column local offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rowStart: { type: "integer", minimum: 0 },
        rowEnd: { type: "integer" },
        columnIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        targetColumn: { type: "integer", minimum: 0 },
      },
      required: ["rowStart", "rowEnd", "columnIndices", "targetColumn"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offset: { type: "integer" }, found: { type: "boolean" } },
      required: ["offset", "found"],
    },
    ports: {
      inputs: [
        {
          id: "rowStart",
          label: "Row Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rowEnd",
          label: "Row End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "columnIndices",
          label: "Column Indices",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "targetColumn",
          label: "Target Column",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "integer" } },
        { id: "found", label: "Found", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = matrixCsrRowColumnLocalOffsetTool.execute;
export default matrixCsrRowColumnLocalOffsetTool;
