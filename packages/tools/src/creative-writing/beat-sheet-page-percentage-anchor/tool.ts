import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalPages: number;
  readonly fraction: number;
  readonly firstPage: number;
};
export type Output = {
  readonly continuousPage: number;
  readonly nearestPage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalPages: { type: "integer", minimum: 1 },
    fraction: { type: "number", minimum: 0, maximum: 1 },
    firstPage: { type: "integer", minimum: 0 },
  },
  required: ["totalPages", "fraction", "firstPage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    continuousPage: { type: "number" },
    nearestPage: { type: "integer" },
  },
  required: ["continuousPage", "nearestPage"],
} as const;
/** Interpolate between the first and last page labels; nearest-page ties round upward. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalPages, fraction, firstPage } = request;
  const compute = (): Output => {
    H.integer(totalPages, 1);
    H.integer(firstPage, 0);
    H.probability(fraction);
    return {
      continuousPage: firstPage + fraction * (totalPages - 1),
      nearestPage: Math.round(firstPage + fraction * (totalPages - 1)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalPages: 101, fraction: 0.25, firstPage: 1 },
  output: { continuousPage: 26, nearestPage: 26 },
} satisfies ToolExample<Input, Output>;
export const beatSheetPagePercentageAnchorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/beat-sheet-page-percentage-anchor",
    title: "Beat Sheet Page Percentage Anchor Tool",
    description:
      "Interpolate between the first and last page labels; nearest-page ties round upward.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalPages: { type: "integer", minimum: 1 },
        fraction: { type: "number", minimum: 0, maximum: 1 },
        firstPage: { type: "integer", minimum: 0 },
      },
      required: ["totalPages", "fraction", "firstPage"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        continuousPage: { type: "number" },
        nearestPage: { type: "integer" },
      },
      required: ["continuousPage", "nearestPage"],
    },
    ports: {
      inputs: [
        {
          id: "totalPages",
          label: "Total Pages",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "fraction",
          label: "Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstPage",
          label: "First Page",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "continuousPage",
          label: "Continuous Page",
          valueType: { type: "number" },
        },
        {
          id: "nearestPage",
          label: "Nearest Page",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = beatSheetPagePercentageAnchorTool.execute;
export default beatSheetPagePercentageAnchorTool;
