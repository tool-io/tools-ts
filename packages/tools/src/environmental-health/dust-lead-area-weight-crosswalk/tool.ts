import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredMassMicrograms: number;
  readonly sampledAreaSquareMeters: number;
};
export type Output = { readonly microgramsPerSquareMeter: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredMassMicrograms: { type: "number", minimum: 0 },
    sampledAreaSquareMeters: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredMassMicrograms", "sampledAreaSquareMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { microgramsPerSquareMeter: { type: "number" } },
  required: ["microgramsPerSquareMeter"],
} as const;
/** Normalize an explicitly measured dust-lead mass by sampled area without selecting a sampling method or exposure limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredMassMicrograms, sampledAreaSquareMeters } = request;
  const compute = (): Output => {
    H.domain(measuredMassMicrograms >= 0, "measuredMassMicrograms");
    (H.domain(sampledAreaSquareMeters > 0, "sampledAreaSquareMeters"),
      sampledAreaSquareMeters);
    return {
      microgramsPerSquareMeter:
        measuredMassMicrograms / sampledAreaSquareMeters,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredMassMicrograms: 20, sampledAreaSquareMeters: 0.5 },
  output: { microgramsPerSquareMeter: 40 },
} satisfies ToolExample<Input, Output>;
export const dustLeadAreaWeightCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "environmental-health",
        "environmental health",
        "health and medicine",
      ],
      keywords: ["environmental health", "health and medicine"],
    },
    id: "environmental-health/dust-lead-area-weight-crosswalk",
    title: "Dust Lead Area Weight Crosswalk",
    description:
      "Normalize an explicitly measured dust-lead mass by sampled area without selecting a sampling method or exposure limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredMassMicrograms: { type: "number", minimum: 0 },
        sampledAreaSquareMeters: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredMassMicrograms", "sampledAreaSquareMeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { microgramsPerSquareMeter: { type: "number" } },
      required: ["microgramsPerSquareMeter"],
    },
    ports: {
      inputs: [
        {
          id: "measuredMassMicrograms",
          label: "Measured Mass Micrograms",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampledAreaSquareMeters",
          label: "Sampled Area Square Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "microgramsPerSquareMeter",
          label: "Micrograms Per Square Meter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dustLeadAreaWeightCrosswalkTool.execute;
export default dustLeadAreaWeightCrosswalkTool;
