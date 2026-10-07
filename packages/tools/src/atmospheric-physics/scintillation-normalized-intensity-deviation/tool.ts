import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intensity: number;
  readonly meanIntensity: number;
};
export type Output = {
  readonly normalizedDeviation: number;
  readonly squaredDeviation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intensity: { type: "number", minimum: 0 },
    meanIntensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["intensity", "meanIntensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedDeviation: { type: "number" },
    squaredDeviation: { type: "number" },
  },
  required: ["normalizedDeviation", "squaredDeviation"],
} as const;
/** Return one normalized intensity deviation and its squared contribution to a scintillation index using a supplied positive mean. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intensity, meanIntensity } = request;
  const compute = (): Output => {
    H.domain(intensity >= 0, "intensity");
    (H.domain(meanIntensity > 0, "meanIntensity"), meanIntensity);
    return (() => {
      const normalizedDeviation = (intensity - meanIntensity) / meanIntensity;
      return {
        normalizedDeviation,
        squaredDeviation: normalizedDeviation ** 2,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intensity: 12, meanIntensity: 10 },
  output: { normalizedDeviation: 0.2, squaredDeviation: 0.04000000000000001 },
} satisfies ToolExample<Input, Output>;
export const scintillationNormalizedIntensityDeviationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["atmospheric-physics", "atmospheric physics", "physics"],
        keywords: ["atmospheric physics", "physics"],
      },
      id: "atmospheric-physics/scintillation-normalized-intensity-deviation",
      title: "Scintillation Normalized Intensity Deviation",
      description:
        "Return one normalized intensity deviation and its squared contribution to a scintillation index using a supplied positive mean.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          intensity: { type: "number", minimum: 0 },
          meanIntensity: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["intensity", "meanIntensity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          normalizedDeviation: { type: "number" },
          squaredDeviation: { type: "number" },
        },
        required: ["normalizedDeviation", "squaredDeviation"],
      },
      ports: {
        inputs: [
          {
            id: "intensity",
            label: "Intensity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "meanIntensity",
            label: "Mean Intensity",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "normalizedDeviation",
            label: "Normalized Deviation",
            valueType: { type: "number" },
          },
          {
            id: "squaredDeviation",
            label: "Squared Deviation",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = scintillationNormalizedIntensityDeviationTool.execute;
export default scintillationNormalizedIntensityDeviationTool;
