import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caregiverCost: number;
  readonly includeUnderPerspective: boolean;
};
export type Output = {
  readonly includedCost: number;
  readonly excludedCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caregiverCost: { type: "number" },
    includeUnderPerspective: { type: "boolean" },
  },
  required: ["caregiverCost", "includeUnderPerspective"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    includedCost: { type: "number" },
    excludedCost: { type: "number" },
  },
  required: ["includedCost", "excludedCost"],
} as const;
/** Apply an explicit analytic-perspective inclusion flag to a supplied caregiver cost. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caregiverCost, includeUnderPerspective } = request;
  const compute = (): Output => {
    return {
      includedCost: includeUnderPerspective ? caregiverCost : 0,
      excludedCost: includeUnderPerspective ? 0 : caregiverCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { caregiverCost: 200, includeUnderPerspective: true },
  output: { includedCost: 200, excludedCost: 0 },
} satisfies ToolExample<Input, Output>;
export const caregiverCostPerspectiveFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: ["health-economics", "health economics", "economics"],
      keywords: ["health economics", "economics"],
    },
    id: "health-economics/caregiver-cost-perspective-flag",
    title: "Caregiver Cost Perspective Flag",
    description:
      "Apply an explicit analytic-perspective inclusion flag to a supplied caregiver cost.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        caregiverCost: { type: "number" },
        includeUnderPerspective: { type: "boolean" },
      },
      required: ["caregiverCost", "includeUnderPerspective"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        includedCost: { type: "number" },
        excludedCost: { type: "number" },
      },
      required: ["includedCost", "excludedCost"],
    },
    ports: {
      inputs: [
        {
          id: "caregiverCost",
          label: "Caregiver Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeUnderPerspective",
          label: "Include Under Perspective",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "includedCost",
          label: "Included Cost",
          valueType: { type: "number" },
        },
        {
          id: "excludedCost",
          label: "Excluded Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = caregiverCostPerspectiveFlagTool.execute;
export default caregiverCostPerspectiveFlagTool;
