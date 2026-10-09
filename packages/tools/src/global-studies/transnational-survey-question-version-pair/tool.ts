import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly surveyId: string;
  readonly questionId: string;
  readonly languageVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surveyId: { type: "string", maxLength: 8192, minLength: 1 },
    questionId: { type: "string", maxLength: 8192, minLength: 1 },
    languageVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["surveyId", "questionId", "languageVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit transnational survey question and language-version identifier without assuming translation equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surveyId, questionId, languageVersion } = request;
  const compute = (): Output => {
    H.domain(surveyId.length > 0, "surveyId");
    H.domain(questionId.length > 0, "questionId");
    H.domain(languageVersion.length > 0, "languageVersion");
    return { token: JSON.stringify([surveyId, questionId, languageVersion]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { surveyId: "S17", questionId: "Q4", languageVersion: "en-v2" },
  output: { token: '["S17","Q4","en-v2"]' },
} satisfies ToolExample<Input, Output>;
export const transnationalSurveyQuestionVersionPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "global-studies/transnational-survey-question-version-pair",
      title: "Transnational Survey Question Version Pair Tool",
      description:
        "Record an explicit transnational survey question and language-version identifier without assuming translation equivalence.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          surveyId: { type: "string", maxLength: 8192, minLength: 1 },
          questionId: { type: "string", maxLength: 8192, minLength: 1 },
          languageVersion: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["surveyId", "questionId", "languageVersion"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "surveyId",
            label: "Survey Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "questionId",
            label: "Question Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "languageVersion",
            label: "Language Version",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = transnationalSurveyQuestionVersionPairTool.execute;
export default transnationalSurveyQuestionVersionPairTool;
