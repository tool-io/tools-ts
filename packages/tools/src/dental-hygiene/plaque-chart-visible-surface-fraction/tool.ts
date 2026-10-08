import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visibleSurfaces: number;
  readonly assessedEligibleSurfaces: number;
};
export type Output = { readonly visibleFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visibleSurfaces: { type: "integer", minimum: 0 },
    assessedEligibleSurfaces: { type: "integer", minimum: 1 },
  },
  required: ["visibleSurfaces", "assessedEligibleSurfaces"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { visibleFraction: { type: "number" } },
  required: ["visibleFraction"],
} as const;
/** Describe explicitly counted plaque-visible surfaces over a positive assessed eligible-surface count without selecting a plaque index. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visibleSurfaces, assessedEligibleSurfaces } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(assessedEligibleSurfaces) &&
        assessedEligibleSurfaces >= 1 &&
        assessedEligibleSurfaces <= Number.MAX_SAFE_INTEGER,
      "assessedEligibleSurfaces",
    ),
      assessedEligibleSurfaces);
    (H.domain(
      Number.isSafeInteger(visibleSurfaces) &&
        visibleSurfaces >= 0 &&
        visibleSurfaces <= assessedEligibleSurfaces,
      "visibleSurfaces",
    ),
      visibleSurfaces);
    return { visibleFraction: visibleSurfaces / assessedEligibleSurfaces };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { visibleSurfaces: 12, assessedEligibleSurfaces: 40 },
  output: { visibleFraction: 0.3 },
} satisfies ToolExample<Input, Output>;
export const plaqueChartVisibleSurfaceFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dental-hygiene", "dental hygiene", "health and medicine"],
      keywords: ["dental hygiene", "health and medicine"],
    },
    id: "dental-hygiene/plaque-chart-visible-surface-fraction",
    title: "Plaque Chart Visible Surface Fraction",
    description:
      "Describe explicitly counted plaque-visible surfaces over a positive assessed eligible-surface count without selecting a plaque index.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visibleSurfaces: { type: "integer", minimum: 0 },
        assessedEligibleSurfaces: { type: "integer", minimum: 1 },
      },
      required: ["visibleSurfaces", "assessedEligibleSurfaces"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { visibleFraction: { type: "number" } },
      required: ["visibleFraction"],
    },
    ports: {
      inputs: [
        {
          id: "visibleSurfaces",
          label: "Visible Surfaces",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "assessedEligibleSurfaces",
          label: "Assessed Eligible Surfaces",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "visibleFraction",
          label: "Visible Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = plaqueChartVisibleSurfaceFractionTool.execute;
export default plaqueChartVisibleSurfaceFractionTool;
