import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oneBasedRow: number;
  readonly oneBasedColumn: number;
  readonly rowCount: number;
  readonly columnCount: number;
};
export type Output = { readonly zeroBasedIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oneBasedRow: { type: "integer", minimum: 1 },
    oneBasedColumn: { type: "integer", minimum: 1 },
    rowCount: { type: "integer", minimum: 1 },
    columnCount: { type: "integer", minimum: 1 },
  },
  required: ["oneBasedRow", "oneBasedColumn", "rowCount", "columnCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { zeroBasedIndex: { type: "integer" } },
  required: ["zeroBasedIndex"],
} as const;
/** Map explicit one-based microplate row and column fields to a row-major zero-based well index without assigning samples. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oneBasedRow, oneBasedColumn, rowCount, columnCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(rowCount) &&
        rowCount >= 1 &&
        rowCount <= Number.MAX_SAFE_INTEGER,
      "rowCount",
    ),
      rowCount);
    (H.domain(
      Number.isSafeInteger(columnCount) &&
        columnCount >= 1 &&
        columnCount <= Number.MAX_SAFE_INTEGER,
      "columnCount",
    ),
      columnCount);
    (H.domain(
      Number.isSafeInteger(oneBasedRow) &&
        oneBasedRow >= 1 &&
        oneBasedRow <= rowCount,
      "oneBasedRow",
    ),
      oneBasedRow);
    (H.domain(
      Number.isSafeInteger(oneBasedColumn) &&
        oneBasedColumn >= 1 &&
        oneBasedColumn <= columnCount,
      "oneBasedColumn",
    ),
      oneBasedColumn);
    return {
      zeroBasedIndex: Number(
        (BigInt(oneBasedRow) - 1n) * BigInt(columnCount) +
          BigInt(oneBasedColumn) -
          1n,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oneBasedRow: 2, oneBasedColumn: 3, rowCount: 8, columnCount: 12 },
  output: { zeroBasedIndex: 14 },
} satisfies ToolExample<Input, Output>;
export const microplateWellLinearIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biotechnology", "biology"],
      keywords: ["biotechnology", "biology"],
    },
    id: "biotechnology/microplate-well-linear-index",
    title: "Microplate Well Linear Index",
    description:
      "Map explicit one-based microplate row and column fields to a row-major zero-based well index without assigning samples.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oneBasedRow: { type: "integer", minimum: 1 },
        oneBasedColumn: { type: "integer", minimum: 1 },
        rowCount: { type: "integer", minimum: 1 },
        columnCount: { type: "integer", minimum: 1 },
      },
      required: ["oneBasedRow", "oneBasedColumn", "rowCount", "columnCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { zeroBasedIndex: { type: "integer" } },
      required: ["zeroBasedIndex"],
    },
    ports: {
      inputs: [
        {
          id: "oneBasedRow",
          label: "One Based Row",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "oneBasedColumn",
          label: "One Based Column",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rowCount",
          label: "Row Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "columnCount",
          label: "Column Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "zeroBasedIndex",
          label: "Zero Based Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = microplateWellLinearIndexTool.execute;
export default microplateWellLinearIndexTool;
