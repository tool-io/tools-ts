import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly trials: number; readonly correct: number };
export type Output = {
  readonly guessProbability: number;
  readonly logProbability: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trials: { type: "integer", minimum: 0, maximum: 1000000 },
    correct: { type: "integer", minimum: 0 },
  },
  required: ["trials", "correct"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    guessProbability: { type: "number" },
    logProbability: { type: "number" },
  },
  required: ["guessProbability", "logProbability"],
} as const;
/** Probability of one specified ordered correct/incorrect sequence under independent random triangle-test guessing; no binomial coefficient or significance test. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trials, correct } = request;
  const compute = (): Output => {
    H.integer(trials, 0, 1000000);
    H.integer(correct, 0, trials);
    return {
      guessProbability: Math.exp(
        correct * Math.log(1 / 3) + (trials - correct) * Math.log(2 / 3),
      ),
      logProbability:
        correct * Math.log(1 / 3) + (trials - correct) * Math.log(2 / 3),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { trials: 1, correct: 1 },
  output: {
    guessProbability: 0.3333333333333333,
    logProbability: -1.0986122886681098,
  },
} satisfies ToolExample<Input, Output>;
export const sensoryTriangleTestGuessProbabilityTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-technology/sensory-triangle-test-guess-probability-term",
      title: "Sensory Triangle Test Guess Probability Term Tool",
      description:
        "Probability of one specified ordered correct/incorrect sequence under independent random triangle-test guessing; no binomial coefficient or significance test.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          trials: { type: "integer", minimum: 0, maximum: 1000000 },
          correct: { type: "integer", minimum: 0 },
        },
        required: ["trials", "correct"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          guessProbability: { type: "number" },
          logProbability: { type: "number" },
        },
        required: ["guessProbability", "logProbability"],
      },
      ports: {
        inputs: [
          {
            id: "trials",
            label: "Trials",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "correct",
            label: "Correct",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "guessProbability",
            label: "Guess Probability",
            valueType: { type: "number", unit: "1" },
          },
          {
            id: "logProbability",
            label: "Log Probability",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = sensoryTriangleTestGuessProbabilityTermTool.execute;
export default sensoryTriangleTestGuessProbabilityTermTool;
