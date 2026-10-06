import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly askedQuestions: number;
  readonly answeredQuestions: number;
};
export type Output = { readonly unansweredQuestions: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    askedQuestions: { type: "integer", minimum: 0 },
    answeredQuestions: { type: "integer", minimum: 0 },
  },
  required: ["askedQuestions", "answeredQuestions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unansweredQuestions: { type: "integer" } },
  required: ["unansweredQuestions"],
} as const;
/** Subtract recorded answered questions from supplied asked-question count, retaining count discrepancies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { askedQuestions, answeredQuestions } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(askedQuestions) &&
        askedQuestions >= 0 &&
        askedQuestions <= Number.MAX_SAFE_INTEGER,
      "askedQuestions",
    ),
      askedQuestions);
    (H.domain(
      Number.isSafeInteger(answeredQuestions) &&
        answeredQuestions >= 0 &&
        answeredQuestions <= Number.MAX_SAFE_INTEGER,
      "answeredQuestions",
    ),
      answeredQuestions);
    return { unansweredQuestions: askedQuestions - answeredQuestions };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { askedQuestions: 12, answeredQuestions: 9 },
  output: { unansweredQuestions: 3 },
} satisfies ToolExample<Input, Output>;
export const facilitatorUnansweredQuestionCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["andragogy", "education"],
      keywords: ["andragogy", "education"],
    },
    id: "andragogy/facilitator-unanswered-question-count",
    title: "Facilitator Unanswered Question Count",
    description:
      "Subtract recorded answered questions from supplied asked-question count, retaining count discrepancies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        askedQuestions: { type: "integer", minimum: 0 },
        answeredQuestions: { type: "integer", minimum: 0 },
      },
      required: ["askedQuestions", "answeredQuestions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { unansweredQuestions: { type: "integer" } },
      required: ["unansweredQuestions"],
    },
    ports: {
      inputs: [
        {
          id: "askedQuestions",
          label: "Asked Questions",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "answeredQuestions",
          label: "Answered Questions",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "unansweredQuestions",
          label: "Unanswered Questions",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = facilitatorUnansweredQuestionCountTool.execute;
export default facilitatorUnansweredQuestionCountTool;
