import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedCellWidths: readonly number[];
  readonly targetCells: number;
  readonly existingPaddingCells: number;
};
export type Output = {
  readonly contentCells: number;
  readonly paddingRemaining: number;
  readonly overflowCells: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedCellWidths: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
    targetCells: { type: "integer", minimum: 0 },
    existingPaddingCells: { type: "integer", minimum: 0 },
  },
  required: ["suppliedCellWidths", "targetCells", "existingPaddingCells"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contentCells: { type: "integer" },
    paddingRemaining: { type: "integer" },
    overflowCells: { type: "integer" },
  },
  required: ["contentCells", "paddingRemaining", "overflowCells"],
} as const;
/** Use caller-supplied Unicode display-cell widths to compute padding budget without inferring font/terminal width. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedCellWidths, targetCells, existingPaddingCells } = request;
  const compute = (): Output => {
    H.domain(suppliedCellWidths.every((x) => x >= 0));
    H.integer(targetCells, 0);
    H.integer(existingPaddingCells, 0);
    const contentCells = suppliedCellWidths.reduce((a, b) => a + b, 0),
      gap = targetCells - contentCells - existingPaddingCells;
    return {
      contentCells,
      paddingRemaining: Math.max(0, gap),
      overflowCells: Math.max(0, -gap),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    suppliedCellWidths: [1, 2, 1],
    targetCells: 8,
    existingPaddingCells: 1,
  },
  output: { contentCells: 4, paddingRemaining: 3, overflowCells: 0 },
} satisfies ToolExample<Input, Output>;
export const unicodeCellPaddingRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/unicode-cell-padding-remainder",
    title: "Unicode Cell Padding Remainder Tool",
    description:
      "Use caller-supplied Unicode display-cell widths to compute padding budget without inferring font/terminal width.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedCellWidths: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
        targetCells: { type: "integer", minimum: 0 },
        existingPaddingCells: { type: "integer", minimum: 0 },
      },
      required: ["suppliedCellWidths", "targetCells", "existingPaddingCells"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contentCells: { type: "integer" },
        paddingRemaining: { type: "integer" },
        overflowCells: { type: "integer" },
      },
      required: ["contentCells", "paddingRemaining", "overflowCells"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedCellWidths",
          label: "Supplied Cell Widths",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "targetCells",
          label: "Target Cells",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "existingPaddingCells",
          label: "Existing Padding Cells",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "contentCells",
          label: "Content Cells",
          valueType: { type: "integer" },
        },
        {
          id: "paddingRemaining",
          label: "Padding Remaining",
          valueType: { type: "integer" },
        },
        {
          id: "overflowCells",
          label: "Overflow Cells",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = unicodeCellPaddingRemainderTool.execute;
export default unicodeCellPaddingRemainderTool;
