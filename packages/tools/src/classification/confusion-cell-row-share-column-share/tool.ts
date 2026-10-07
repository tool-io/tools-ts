import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cellCount: number;
  readonly rowTotal: number;
  readonly columnTotal: number;
};
export type Output = {
  readonly rowShare: number;
  readonly columnShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cellCount: { type: "integer", minimum: 0 },
    rowTotal: { type: "integer", minimum: 1 },
    columnTotal: { type: "integer", minimum: 1 },
  },
  required: ["cellCount", "rowTotal", "columnTotal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rowShare: { type: "number" }, columnShare: { type: "number" } },
  required: ["rowShare", "columnShare"],
} as const;
/** Normalize one explicit confusion cell to supplied positive row and column totals without choosing an axis convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cellCount, rowTotal, columnTotal } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(rowTotal) &&
        rowTotal >= 1 &&
        rowTotal <= Number.MAX_SAFE_INTEGER,
      "rowTotal",
    ),
      rowTotal);
    (H.domain(
      Number.isSafeInteger(columnTotal) &&
        columnTotal >= 1 &&
        columnTotal <= Number.MAX_SAFE_INTEGER,
      "columnTotal",
    ),
      columnTotal);
    (H.domain(
      Number.isSafeInteger(cellCount) &&
        cellCount >= 0 &&
        cellCount <= Math.min(rowTotal, columnTotal),
      "cellCount",
    ),
      cellCount);
    return {
      rowShare: cellCount / rowTotal,
      columnShare: cellCount / columnTotal,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cellCount: 12, rowTotal: 20, columnTotal: 30 },
  output: { rowShare: 0.6, columnShare: 0.4 },
} satisfies ToolExample<Input, Output>;
export const confusionCellRowShareColumnShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["ai", "data"],
      fields: ["classification", "classification metrics", "computer science"],
      keywords: ["classification metrics", "computer science"],
    },
    id: "classification/confusion-cell-row-share-column-share",
    title: "Confusion Cell Row Share Column Share",
    description:
      "Normalize one explicit confusion cell to supplied positive row and column totals without choosing an axis convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cellCount: { type: "integer", minimum: 0 },
        rowTotal: { type: "integer", minimum: 1 },
        columnTotal: { type: "integer", minimum: 1 },
      },
      required: ["cellCount", "rowTotal", "columnTotal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rowShare: { type: "number" },
        columnShare: { type: "number" },
      },
      required: ["rowShare", "columnShare"],
    },
    ports: {
      inputs: [
        {
          id: "cellCount",
          label: "Cell Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rowTotal",
          label: "Row Total",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "columnTotal",
          label: "Column Total",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "rowShare", label: "Row Share", valueType: { type: "number" } },
        {
          id: "columnShare",
          label: "Column Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = confusionCellRowShareColumnShareTool.execute;
export default confusionCellRowShareColumnShareTool;
