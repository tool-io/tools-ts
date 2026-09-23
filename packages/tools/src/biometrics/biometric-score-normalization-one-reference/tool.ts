import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly score: number;
  readonly mean: number;
  readonly sd: number;
  readonly referenceMinimum: number;
  readonly referenceMaximum: number;
};
export type Output = { readonly z: number; readonly minMax: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    mean: { type: "number" },
    sd: { type: "number", exclusiveMinimum: 0 },
    referenceMinimum: { type: "number" },
    referenceMaximum: { type: "number" },
  },
  required: ["score", "mean", "sd", "referenceMinimum", "referenceMaximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { z: { type: "number" }, minMax: { type: "number" } },
  required: ["z", "minMax"],
} as const;
/** Calculate biometric score normalization one reference from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { score, mean, sd, referenceMinimum, referenceMaximum } = request;
  const compute = (): Output => {
    H.positive(sd);
    H.domain(referenceMaximum > referenceMinimum);
    return {
      z: (score - mean) / sd,
      minMax:
        (score - referenceMinimum) / (referenceMaximum - referenceMinimum),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    score: 70,
    mean: 50,
    sd: 10,
    referenceMinimum: 0,
    referenceMaximum: 100,
  },
  output: { z: 2, minMax: 0.7 },
} satisfies ToolExample<Input, Output>;
export const biometricScoreNormalizationOneReferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biometrics/biometric-score-normalization-one-reference",
      title: "Biometric Score Normalization One Reference Tool",
      description:
        "Calculate biometric score normalization one reference from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          score: { type: "number" },
          mean: { type: "number" },
          sd: { type: "number", exclusiveMinimum: 0 },
          referenceMinimum: { type: "number" },
          referenceMaximum: { type: "number" },
        },
        required: [
          "score",
          "mean",
          "sd",
          "referenceMinimum",
          "referenceMaximum",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { z: { type: "number" }, minMax: { type: "number" } },
        required: ["z", "minMax"],
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
            id: "mean",
            label: "Mean",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sd",
            label: "Sd",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceMinimum",
            label: "Reference Minimum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceMaximum",
            label: "Reference Maximum",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "z", label: "Z", valueType: { type: "number" } },
          { id: "minMax", label: "Min Max", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = biometricScoreNormalizationOneReferenceTool.execute;
export default biometricScoreNormalizationOneReferenceTool;
