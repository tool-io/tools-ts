import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly surveyId: string;
  readonly regionId: string;
  readonly answerCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surveyId: { type: "string", maxLength: 8192, minLength: 1 },
    regionId: { type: "string", maxLength: 8192, minLength: 1 },
    answerCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["surveyId", "regionId", "answerCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an ordered supplied survey, region and answer-code key without interpreting responses. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surveyId, regionId, answerCode } = request;
  const compute = (): Output => {
    H.domain(surveyId.length > 0, "surveyId");
    H.domain(regionId.length > 0, "regionId");
    H.domain(answerCode.length > 0, "answerCode");
    return { token: JSON.stringify([surveyId, regionId, answerCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { surveyId: "S17", regionId: "R4", answerCode: "A2" },
  output: { token: '["S17","R4","A2"]' },
} satisfies ToolExample<Input, Output>;
export const regionSpecificSurveyAnswerKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["area-studies", "area studies", "humanities"],
      keywords: ["area studies", "humanities"],
    },
    id: "area-studies/region-specific-survey-answer-key",
    title: "Region Specific Survey Answer Key",
    description:
      "Build an ordered supplied survey, region and answer-code key without interpreting responses.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surveyId: { type: "string", maxLength: 8192, minLength: 1 },
        regionId: { type: "string", maxLength: 8192, minLength: 1 },
        answerCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["surveyId", "regionId", "answerCode"],
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
          id: "regionId",
          label: "Region Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "answerCode",
          label: "Answer Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = regionSpecificSurveyAnswerKeyTool.execute;
export default regionSpecificSurveyAnswerKeyTool;
