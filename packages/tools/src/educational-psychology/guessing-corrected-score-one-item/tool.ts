import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly correct: boolean;
  readonly omitted: boolean;
  readonly alternatives: number;
};
export type Output = { readonly score: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correct: { type: "boolean" },
    omitted: { type: "boolean" },
    alternatives: { type: "integer", minimum: 2 },
  },
  required: ["correct", "omitted", "alternatives"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { score: { type: "number" } },
  required: ["score"],
} as const;
/** Classical rights-minus-wrongs/(k-1) scoring for one single-answer item. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { correct, omitted, alternatives } = request;
  const compute = (): Output => {
    H.integer(alternatives, 2);
    H.domain(!(correct && omitted));
    return { score: omitted ? 0 : correct ? 1 : -1 / (alternatives - 1) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { correct: false, omitted: false, alternatives: 4 },
  output: { score: -0.3333333333333333 },
} satisfies ToolExample<Input, Output>;
export const guessingCorrectedScoreOneItemTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/guessing-corrected-score-one-item",
    title: "Guessing Corrected Score One Item Tool",
    description:
      "Classical rights-minus-wrongs/(k-1) scoring for one single-answer item.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correct: { type: "boolean" },
        omitted: { type: "boolean" },
        alternatives: { type: "integer", minimum: 2 },
      },
      required: ["correct", "omitted", "alternatives"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { score: { type: "number" } },
      required: ["score"],
    },
    ports: {
      inputs: [
        {
          id: "correct",
          label: "Correct",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "omitted",
          label: "Omitted",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "alternatives",
          label: "Alternatives",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "score", label: "Score", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = guessingCorrectedScoreOneItemTool.execute;
export default guessingCorrectedScoreOneItemTool;
