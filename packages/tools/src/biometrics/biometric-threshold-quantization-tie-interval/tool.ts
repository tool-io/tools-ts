import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly score: number;
  readonly resolution: number;
  readonly threshold: number;
  readonly rounded: boolean;
};
export type Output = {
  readonly lower: number;
  readonly upper: number;
  readonly thresholdInside: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    resolution: { type: "number", exclusiveMinimum: 0 },
    threshold: { type: "number" },
    rounded: { type: "boolean" },
  },
  required: ["score", "resolution", "threshold", "rounded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    thresholdInside: { type: "boolean" },
  },
  required: ["lower", "upper", "thresholdInside"],
} as const;
/** Calculate biometric threshold quantization tie interval from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { score, resolution, threshold, rounded } = request;
  const compute = (): Output => {
    H.positive(resolution);
    return {
      lower: rounded ? score - resolution / 2 : score,
      upper: rounded ? score + resolution / 2 : score + resolution,
      thresholdInside:
        threshold >= (rounded ? score - resolution / 2 : score) &&
        threshold <= (rounded ? score + resolution / 2 : score + resolution),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { score: 0.5, resolution: 0.1, threshold: 0.52, rounded: true },
  output: { lower: 0.45, upper: 0.55, thresholdInside: true },
} satisfies ToolExample<Input, Output>;
export const biometricThresholdQuantizationTieIntervalTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biometrics/biometric-threshold-quantization-tie-interval",
      title: "Biometric Threshold Quantization Tie Interval Tool",
      description:
        "Calculate biometric threshold quantization tie interval from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          score: { type: "number" },
          resolution: { type: "number", exclusiveMinimum: 0 },
          threshold: { type: "number" },
          rounded: { type: "boolean" },
        },
        required: ["score", "resolution", "threshold", "rounded"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lower: { type: "number" },
          upper: { type: "number" },
          thresholdInside: { type: "boolean" },
        },
        required: ["lower", "upper", "thresholdInside"],
      },
      ports: {
        inputs: [
          {
            id: "score",
            label: "Score",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "resolution",
            label: "Resolution",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "threshold",
            label: "Threshold",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rounded",
            label: "Rounded",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "lower", label: "Lower", valueType: { type: "number" } },
          { id: "upper", label: "Upper", valueType: { type: "number" } },
          {
            id: "thresholdInside",
            label: "Threshold Inside",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biometricThresholdQuantizationTieIntervalTool.execute;
export default biometricThresholdQuantizationTieIntervalTool;
