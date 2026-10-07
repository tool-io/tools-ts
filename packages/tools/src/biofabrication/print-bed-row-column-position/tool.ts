import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oneBasedRow: number;
  readonly oneBasedColumn: number;
  readonly columnCount: number;
  readonly rowCount: number;
};
export type Output = { readonly zeroBasedLinearIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oneBasedRow: { type: "integer", minimum: 1 },
    oneBasedColumn: { type: "integer", minimum: 1 },
    columnCount: { type: "integer", minimum: 1 },
    rowCount: { type: "integer", minimum: 1 },
  },
  required: ["oneBasedRow", "oneBasedColumn", "columnCount", "rowCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { zeroBasedLinearIndex: { type: "integer" } },
  required: ["zeroBasedLinearIndex"],
} as const;
/** Map explicit one-based print-bed row and column to a row-major zero-based position within supplied dimensions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oneBasedRow, oneBasedColumn, columnCount, rowCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(columnCount) &&
        columnCount >= 1 &&
        columnCount <= Number.MAX_SAFE_INTEGER,
      "columnCount",
    ),
      columnCount);
    (H.domain(
      Number.isSafeInteger(rowCount) &&
        rowCount >= 1 &&
        rowCount <= Number.MAX_SAFE_INTEGER,
      "rowCount",
    ),
      rowCount);
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
    H.domain(Number.isSafeInteger(rowCount * columnCount), "rowCount");
    return {
      zeroBasedLinearIndex:
        (oneBasedRow - 1) * columnCount + oneBasedColumn - 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oneBasedRow: 2, oneBasedColumn: 3, columnCount: 4, rowCount: 3 },
  output: { zeroBasedLinearIndex: 6 },
} satisfies ToolExample<Input, Output>;
export const printBedRowColumnPositionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biofabrication", "engineering"],
      keywords: ["biofabrication", "engineering"],
    },
    id: "biofabrication/print-bed-row-column-position",
    title: "Print BED Row Column Position",
    description:
      "Map explicit one-based print-bed row and column to a row-major zero-based position within supplied dimensions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oneBasedRow: { type: "integer", minimum: 1 },
        oneBasedColumn: { type: "integer", minimum: 1 },
        columnCount: { type: "integer", minimum: 1 },
        rowCount: { type: "integer", minimum: 1 },
      },
      required: ["oneBasedRow", "oneBasedColumn", "columnCount", "rowCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { zeroBasedLinearIndex: { type: "integer" } },
      required: ["zeroBasedLinearIndex"],
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
          id: "columnCount",
          label: "Column Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rowCount",
          label: "Row Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "zeroBasedLinearIndex",
          label: "Zero Based Linear Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = printBedRowColumnPositionTool.execute;
export default printBedRowColumnPositionTool;
