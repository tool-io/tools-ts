import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly confidence: number; readonly correct: boolean };
export type Output = { readonly signedGap: number; readonly brierLoss: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    confidence: { type: "number", minimum: 0, maximum: 1 },
    correct: { type: "boolean" },
  },
  required: ["confidence", "correct"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" }, brierLoss: { type: "number" } },
  required: ["signedGap", "brierLoss"],
} as const;
/** Calculate metacognitive confidence accuracy one trial from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { confidence, correct } = request;
  const compute = (): Output => {
    H.probability(confidence);
    return {
      signedGap: confidence - (correct ? 1 : 0),
      brierLoss: (confidence - (correct ? 1 : 0)) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { confidence: 0.8, correct: true },
  output: { signedGap: -0.19999999999999996, brierLoss: 0.03999999999999998 },
} satisfies ToolExample<Input, Output>;
export const metacognitiveConfidenceAccuracyOneTrialTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "educational-psychology/metacognitive-confidence-accuracy-one-trial",
      title: "Metacognitive Confidence Accuracy One Trial Tool",
      description:
        "Calculate metacognitive confidence accuracy one trial from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          confidence: { type: "number", minimum: 0, maximum: 1 },
          correct: { type: "boolean" },
        },
        required: ["confidence", "correct"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signedGap: { type: "number" },
          brierLoss: { type: "number" },
        },
        required: ["signedGap", "brierLoss"],
      },
      ports: {
        inputs: [
          {
            id: "confidence",
            label: "Confidence",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "correct",
            label: "Correct",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "signedGap",
            label: "Signed Gap",
            valueType: { type: "number" },
          },
          {
            id: "brierLoss",
            label: "Brier Loss",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = metacognitiveConfidenceAccuracyOneTrialTool.execute;
export default metacognitiveConfidenceAccuracyOneTrialTool;
