import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stripWidths: readonly number[];
  readonly adjacentOverlaps: readonly number[];
};
export type Output = {
  readonly grossWidth: number;
  readonly overlapWidth: number;
  readonly stitchedWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stripWidths: { type: "array", maxItems: 256, items: { type: "number" } },
    adjacentOverlaps: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["stripWidths", "adjacentOverlaps"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossWidth: { type: "number" },
    overlapWidth: { type: "number" },
    stitchedWidth: { type: "number" },
  },
  required: ["grossWidth", "overlapWidth", "stitchedWidth"],
} as const;
/** Budget an ordered one-dimensional strip mosaic without estimating registration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stripWidths, adjacentOverlaps } = request;
  const compute = (): Output => {
    H.domain(
      stripWidths.length > 0 &&
        adjacentOverlaps.length === stripWidths.length - 1 &&
        stripWidths.every((x) => x > 0) &&
        adjacentOverlaps.every(
          (x, i) => x >= 0 && x <= Math.min(stripWidths[i], stripWidths[i + 1]),
        ),
    );
    return {
      grossWidth: stripWidths.reduce((a, b) => a + b, 0),
      overlapWidth: adjacentOverlaps.reduce((a, b) => a + b, 0),
      stitchedWidth:
        stripWidths.reduce((a, b) => a + b, 0) -
        adjacentOverlaps.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stripWidths: [10, 12, 11], adjacentOverlaps: [2, 3] },
  output: { grossWidth: 33, overlapWidth: 5, stitchedWidth: 28 },
} satisfies ToolExample<Input, Output>;
export const prostheticScanStitchOverlapBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "prosthodontics/prosthetic-scan-stitch-overlap-budget",
    title: "Prosthetic Scan Stitch Overlap Budget Tool",
    description:
      "Budget an ordered one-dimensional strip mosaic without estimating registration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stripWidths: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        adjacentOverlaps: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["stripWidths", "adjacentOverlaps"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossWidth: { type: "number" },
        overlapWidth: { type: "number" },
        stitchedWidth: { type: "number" },
      },
      required: ["grossWidth", "overlapWidth", "stitchedWidth"],
    },
    ports: {
      inputs: [
        {
          id: "stripWidths",
          label: "Strip Widths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "adjacentOverlaps",
          label: "Adjacent Overlaps",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "grossWidth",
          label: "Gross Width",
          valueType: { type: "number" },
        },
        {
          id: "overlapWidth",
          label: "Overlap Width",
          valueType: { type: "number" },
        },
        {
          id: "stitchedWidth",
          label: "Stitched Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = prostheticScanStitchOverlapBudgetTool.execute;
export default prostheticScanStitchOverlapBudgetTool;
