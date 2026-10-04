import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pageUsableLines: number;
  readonly questionLines: number;
  readonly answerLines: number;
};
export type Output = {
  readonly remainingLines: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pageUsableLines: { type: "integer", minimum: 0 },
    questionLines: { type: "integer", minimum: 0 },
    answerLines: { type: "integer", minimum: 0 },
  },
  required: ["pageUsableLines", "questionLines", "answerLines"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingLines: { type: "integer" },
    fits: { type: "boolean" },
  },
  required: ["remainingLines", "fits"],
} as const;
/** Check one exam question and its reserved answer space against a page's usable line budget. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pageUsableLines, questionLines, answerLines } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(pageUsableLines) &&
        pageUsableLines >= 0 &&
        pageUsableLines <= Number.MAX_SAFE_INTEGER,
      "pageUsableLines",
    ),
      pageUsableLines);
    (H.domain(
      Number.isSafeInteger(questionLines) &&
        questionLines >= 0 &&
        questionLines <= Number.MAX_SAFE_INTEGER,
      "questionLines",
    ),
      questionLines);
    (H.domain(
      Number.isSafeInteger(answerLines) &&
        answerLines >= 0 &&
        answerLines <= Number.MAX_SAFE_INTEGER,
      "answerLines",
    ),
      answerLines);
    return {
      remainingLines: pageUsableLines - questionLines - answerLines,
      fits: questionLines + answerLines <= pageUsableLines,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pageUsableLines: 50, questionLines: 12, answerLines: 30 },
  output: { remainingLines: 8, fits: true },
} satisfies ToolExample<Input, Output>;
export const examQuestionPageSpaceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/exam-question-page-space",
    title: "Exam Question Page Space Tool",
    description:
      "Check one exam question and its reserved answer space against a page's usable line budget.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pageUsableLines: { type: "integer", minimum: 0 },
        questionLines: { type: "integer", minimum: 0 },
        answerLines: { type: "integer", minimum: 0 },
      },
      required: ["pageUsableLines", "questionLines", "answerLines"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingLines: { type: "integer" },
        fits: { type: "boolean" },
      },
      required: ["remainingLines", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "pageUsableLines",
          label: "Page Usable Lines",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "questionLines",
          label: "Question Lines",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "answerLines",
          label: "Answer Lines",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "remainingLines",
          label: "Remaining Lines",
          valueType: { type: "integer" },
        },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = examQuestionPageSpaceTool.execute;
export default examQuestionPageSpaceTool;
