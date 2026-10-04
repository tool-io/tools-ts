import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly spacing: number;
  readonly firstDiameter: number;
  readonly secondDiameter: number;
};
export type Output = { readonly clearGap: number; readonly overlap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spacing: { type: "number", minimum: 0 },
    firstDiameter: { type: "number", minimum: 0 },
    secondDiameter: { type: "number", minimum: 0 },
  },
  required: ["spacing", "firstDiameter", "secondDiameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { clearGap: { type: "number" }, overlap: { type: "number" } },
  required: ["clearGap", "overlap"],
} as const;
/** One-dimensional mature canopy extents along the street axis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spacing, firstDiameter, secondDiameter } = request;
  const compute = (): Output => {
    H.domain(spacing >= 0 && firstDiameter >= 0 && secondDiameter >= 0);
    return {
      clearGap: Math.max(0, spacing - (firstDiameter + secondDiameter) / 2),
      overlap: Math.max(0, (firstDiameter + secondDiameter) / 2 - spacing),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { spacing: 10, firstDiameter: 6, secondDiameter: 8 },
  output: { clearGap: 3, overlap: 0 },
} satisfies ToolExample<Input, Output>;
export const streetTreeCanopyGapAtMaturityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/street-tree-canopy-gap-at-maturity",
    title: "Street Tree Canopy Gap At Maturity Tool",
    description: "One-dimensional mature canopy extents along the street axis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spacing: { type: "number", minimum: 0 },
        firstDiameter: { type: "number", minimum: 0 },
        secondDiameter: { type: "number", minimum: 0 },
      },
      required: ["spacing", "firstDiameter", "secondDiameter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { clearGap: { type: "number" }, overlap: { type: "number" } },
      required: ["clearGap", "overlap"],
    },
    ports: {
      inputs: [
        {
          id: "spacing",
          label: "Spacing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstDiameter",
          label: "First Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDiameter",
          label: "Second Diameter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "clearGap", label: "Clear Gap", valueType: { type: "number" } },
        { id: "overlap", label: "Overlap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = streetTreeCanopyGapAtMaturityTool.execute;
export default streetTreeCanopyGapAtMaturityTool;
