import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intensityMmPerHour: number;
  readonly durationMinutes: number;
  readonly runoffFraction: number;
};
export type Output = {
  readonly depthMm: number;
  readonly effectiveDepthMm: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intensityMmPerHour: { type: "number", minimum: 0 },
    durationMinutes: { type: "number", minimum: 0 },
    runoffFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["intensityMmPerHour", "durationMinutes", "runoffFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depthMm: { type: "number" },
    effectiveDepthMm: { type: "number" },
  },
  required: ["depthMm", "effectiveDepthMm"],
} as const;
/** Constant rainfall intensity integration and an explicit effective-runoff fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intensityMmPerHour, durationMinutes, runoffFraction } = request;
  const compute = (): Output => {
    H.domain(intensityMmPerHour >= 0 && durationMinutes >= 0);
    H.probability(runoffFraction);
    return {
      depthMm: (intensityMmPerHour * durationMinutes) / 60,
      effectiveDepthMm:
        (intensityMmPerHour * durationMinutes * runoffFraction) / 60,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intensityMmPerHour: 12, durationMinutes: 30, runoffFraction: 0.6 },
  output: { depthMm: 6, effectiveDepthMm: 3.6 },
} satisfies ToolExample<Input, Output>;
export const rainfallIntensityDurationDepthFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydrometeorology/rainfall-intensity-duration-depth-factor",
      title: "Rainfall Intensity Duration Depth Factor Tool",
      description:
        "Constant rainfall intensity integration and an explicit effective-runoff fraction.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          intensityMmPerHour: { type: "number", minimum: 0 },
          durationMinutes: { type: "number", minimum: 0 },
          runoffFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["intensityMmPerHour", "durationMinutes", "runoffFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          depthMm: { type: "number" },
          effectiveDepthMm: { type: "number" },
        },
        required: ["depthMm", "effectiveDepthMm"],
      },
      ports: {
        inputs: [
          {
            id: "intensityMmPerHour",
            label: "Intensity Mm Per Hour",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "durationMinutes",
            label: "Duration Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
          {
            id: "runoffFraction",
            label: "Runoff Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "depthMm", label: "Depth Mm", valueType: { type: "number" } },
          {
            id: "effectiveDepthMm",
            label: "Effective Depth Mm",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = rainfallIntensityDurationDepthFactorTool.execute;
export default rainfallIntensityDurationDepthFactorTool;
