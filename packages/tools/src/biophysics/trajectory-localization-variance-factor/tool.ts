import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredMsd: number;
  readonly localizationVariance: number;
  readonly dimensions: number;
};
export type Output = {
  readonly noiseContribution: number;
  readonly correctedMsd: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredMsd: { type: "number", minimum: 0 },
    localizationVariance: { type: "number", minimum: 0 },
    dimensions: { type: "integer", minimum: 1, maximum: 3 },
  },
  required: ["measuredMsd", "localizationVariance", "dimensions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    noiseContribution: { type: "number" },
    correctedMsd: { type: "number" },
  },
  required: ["noiseContribution", "correctedMsd"],
} as const;
/** Subtract 2*d*variance for independent equal per-coordinate localization noise at both displacement endpoints; no motion-blur correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredMsd, localizationVariance, dimensions } = request;
  const compute = (): Output => {
    H.domain(measuredMsd >= 0 && localizationVariance >= 0);
    H.integer(dimensions, 1, 3);
    return {
      noiseContribution: 2 * dimensions * localizationVariance,
      correctedMsd: measuredMsd - 2 * dimensions * localizationVariance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredMsd: 10, localizationVariance: 1, dimensions: 2 },
  output: { noiseContribution: 4, correctedMsd: 6 },
} satisfies ToolExample<Input, Output>;
export const trajectoryLocalizationVarianceFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biophysics/trajectory-localization-variance-factor",
      title: "Trajectory Localization Variance Factor Tool",
      description:
        "Subtract 2*d*variance for independent equal per-coordinate localization noise at both displacement endpoints; no motion-blur correction.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measuredMsd: { type: "number", minimum: 0 },
          localizationVariance: { type: "number", minimum: 0 },
          dimensions: { type: "integer", minimum: 1, maximum: 3 },
        },
        required: ["measuredMsd", "localizationVariance", "dimensions"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          noiseContribution: { type: "number" },
          correctedMsd: { type: "number" },
        },
        required: ["noiseContribution", "correctedMsd"],
      },
      ports: {
        inputs: [
          {
            id: "measuredMsd",
            label: "Measured Msd",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "localizationVariance",
            label: "Localization Variance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dimensions",
            label: "Dimensions",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "noiseContribution",
            label: "Noise Contribution",
            valueType: { type: "number" },
          },
          {
            id: "correctedMsd",
            label: "Corrected Msd",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = trajectoryLocalizationVarianceFactorTool.execute;
export default trajectoryLocalizationVarianceFactorTool;
