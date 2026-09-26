import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly correctAward: number;
  readonly wrongPenalty: number;
};
export type Output = { readonly probability: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctAward: { type: "number", minimum: 0 },
    wrongPenalty: { type: "number", minimum: 0 },
  },
  required: ["correctAward", "wrongPenalty"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { probability: { type: "number" } },
  required: ["probability"],
} as const;
/** Calculate negative marking neutral guess probability from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { correctAward, wrongPenalty } = request;
  const compute = (): Output => {
    H.domain(correctAward >= 0 && wrongPenalty >= 0);
    H.positive(correctAward + wrongPenalty);
    return { probability: wrongPenalty / (correctAward + wrongPenalty) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { correctAward: 3, wrongPenalty: 1 },
  output: { probability: 0.25 },
} satisfies ToolExample<Input, Output>;
export const negativeMarkingNeutralGuessProbabilityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "education/negative-marking-neutral-guess-probability",
      title: "Negative Marking Neutral Guess Probability Tool",
      description:
        "Calculate negative marking neutral guess probability from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          correctAward: { type: "number", minimum: 0 },
          wrongPenalty: { type: "number", minimum: 0 },
        },
        required: ["correctAward", "wrongPenalty"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { probability: { type: "number" } },
        required: ["probability"],
      },
      ports: {
        inputs: [
          {
            id: "correctAward",
            label: "Correct Award",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "wrongPenalty",
            label: "Wrong Penalty",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "probability",
            label: "Probability",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = negativeMarkingNeutralGuessProbabilityTool.execute;
export default negativeMarkingNeutralGuessProbabilityTool;
