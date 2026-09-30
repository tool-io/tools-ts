import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coreRows: number;
  readonly coreColumns: number;
  readonly addedRows: number;
  readonly addedColumns: number;
};
export type Output = {
  readonly rows: number;
  readonly columns: number;
  readonly borderEntries: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coreRows: { type: "integer", minimum: 0 },
    coreColumns: { type: "integer", minimum: 0 },
    addedRows: { type: "integer", minimum: 0 },
    addedColumns: { type: "integer", minimum: 0 },
  },
  required: ["coreRows", "coreColumns", "addedRows", "addedColumns"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rows: { type: "integer" },
    columns: { type: "integer" },
    borderEntries: { type: "integer" },
  },
  required: ["rows", "columns", "borderEntries"],
} as const;
/** Calculate matrix block border shape budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coreRows, coreColumns, addedRows, addedColumns } = request;
  const compute = (): Output => {
    H.integer(coreRows, 0);
    H.integer(coreColumns, 0);
    H.integer(addedRows, 0);
    H.integer(addedColumns, 0);
    return {
      rows: coreRows + addedRows,
      columns: coreColumns + addedColumns,
      borderEntries:
        coreRows * addedColumns +
        addedRows * coreColumns +
        addedRows * addedColumns,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coreRows: 2, coreColumns: 3, addedRows: 1, addedColumns: 2 },
  output: { rows: 3, columns: 5, borderEntries: 9 },
} satisfies ToolExample<Input, Output>;
export const matrixBlockBorderShapeBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-block-border-shape-budget",
    title: "Matrix Block Border Shape Budget Tool",
    description:
      "Calculate matrix block border shape budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coreRows: { type: "integer", minimum: 0 },
        coreColumns: { type: "integer", minimum: 0 },
        addedRows: { type: "integer", minimum: 0 },
        addedColumns: { type: "integer", minimum: 0 },
      },
      required: ["coreRows", "coreColumns", "addedRows", "addedColumns"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rows: { type: "integer" },
        columns: { type: "integer" },
        borderEntries: { type: "integer" },
      },
      required: ["rows", "columns", "borderEntries"],
    },
    ports: {
      inputs: [
        {
          id: "coreRows",
          label: "Core Rows",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "coreColumns",
          label: "Core Columns",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "addedRows",
          label: "Added Rows",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "addedColumns",
          label: "Added Columns",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "rows", label: "Rows", valueType: { type: "integer" } },
        { id: "columns", label: "Columns", valueType: { type: "integer" } },
        {
          id: "borderEntries",
          label: "Border Entries",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = matrixBlockBorderShapeBudgetTool.execute;
export default matrixBlockBorderShapeBudgetTool;
