import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly row: number;
  readonly column: number;
  readonly inputOneBased: boolean;
};
export type Output = {
  readonly rowInOtherConvention: number;
  readonly columnInOtherConvention: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    row: { type: "integer" },
    column: { type: "integer" },
    inputOneBased: { type: "boolean" },
  },
  required: ["row", "column", "inputOneBased"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowInOtherConvention: { type: "integer" },
    columnInOtherConvention: { type: "integer" },
  },
  required: ["rowInOtherConvention", "columnInOtherConvention"],
} as const;
/** Translate explicit matrix row and column indices between zero-based and one-based conventions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { row, column, inputOneBased } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(row) &&
        row >= (inputOneBased ? 1 : 0) &&
        row <= Number.MAX_SAFE_INTEGER,
      "row",
    ),
      row);
    (H.domain(
      Number.isSafeInteger(column) &&
        column >= (inputOneBased ? 1 : 0) &&
        column <= Number.MAX_SAFE_INTEGER,
      "column",
    ),
      column);
    return {
      rowInOtherConvention: row + (inputOneBased ? -1 : 1),
      columnInOtherConvention: column + (inputOneBased ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { row: 2, column: 4, inputOneBased: true },
  output: { rowInOtherConvention: 1, columnInOtherConvention: 3 },
} satisfies ToolExample<Input, Output>;
export const matrixOneBasedIndexCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["matrix", "mathematics"],
      keywords: ["matrix", "mathematics"],
    },
    id: "matrix/matrix-one-based-index-crosswalk",
    title: "Matrix One Based Index Crosswalk",
    description:
      "Translate explicit matrix row and column indices between zero-based and one-based conventions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        row: { type: "integer" },
        column: { type: "integer" },
        inputOneBased: { type: "boolean" },
      },
      required: ["row", "column", "inputOneBased"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rowInOtherConvention: { type: "integer" },
        columnInOtherConvention: { type: "integer" },
      },
      required: ["rowInOtherConvention", "columnInOtherConvention"],
    },
    ports: {
      inputs: [
        {
          id: "row",
          label: "Row",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "column",
          label: "Column",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "inputOneBased",
          label: "Input One Based",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "rowInOtherConvention",
          label: "Row In Other Convention",
          valueType: { type: "integer" },
        },
        {
          id: "columnInOtherConvention",
          label: "Column In Other Convention",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = matrixOneBasedIndexCrosswalkTool.execute;
export default matrixOneBasedIndexCrosswalkTool;
