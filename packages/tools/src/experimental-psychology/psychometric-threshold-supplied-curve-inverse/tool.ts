import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetProbability: number;
  readonly guessRate: number;
  readonly lapseRate: number;
  readonly location: number;
  readonly scale: number;
};
export type Output = { readonly threshold: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetProbability: { type: "number" },
    guessRate: { type: "number", minimum: 0, maximum: 1 },
    lapseRate: { type: "number", minimum: 0, maximum: 1 },
    location: { type: "number" },
    scale: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "targetProbability",
    "guessRate",
    "lapseRate",
    "location",
    "scale",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { threshold: { type: "number" } },
  required: ["threshold"],
} as const;
/** Inverse logistic psychometric curve with explicit guess and lapse asymptotes and positive logistic scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetProbability, guessRate, lapseRate, location, scale } = request;
  const compute = (): Output => {
    H.probability(guessRate);
    H.probability(lapseRate);
    H.domain(
      targetProbability > guessRate && targetProbability < 1 - lapseRate,
    );
    H.positive(scale);
    return {
      threshold:
        location +
        scale *
          Math.log(
            (targetProbability - guessRate) /
              (1 - lapseRate - targetProbability),
          ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    targetProbability: 0.75,
    guessRate: 0.5,
    lapseRate: 0,
    location: 10,
    scale: 2,
  },
  output: { threshold: 10 },
} satisfies ToolExample<Input, Output>;
export const psychometricThresholdSuppliedCurveInverseTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "experimental-psychology/psychometric-threshold-supplied-curve-inverse",
      title: "Psychometric Threshold Supplied Curve Inverse Tool",
      description:
        "Inverse logistic psychometric curve with explicit guess and lapse asymptotes and positive logistic scale.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          targetProbability: { type: "number" },
          guessRate: { type: "number", minimum: 0, maximum: 1 },
          lapseRate: { type: "number", minimum: 0, maximum: 1 },
          location: { type: "number" },
          scale: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "targetProbability",
          "guessRate",
          "lapseRate",
          "location",
          "scale",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { threshold: { type: "number" } },
        required: ["threshold"],
      },
      ports: {
        inputs: [
          {
            id: "targetProbability",
            label: "Target Probability",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "guessRate",
            label: "Guess Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lapseRate",
            label: "Lapse Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "location",
            label: "Location",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "scale",
            label: "Scale",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "threshold",
            label: "Threshold",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = psychometricThresholdSuppliedCurveInverseTool.execute;
export default psychometricThresholdSuppliedCurveInverseTool;
