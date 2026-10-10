import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly surveyId: string;
  readonly effortText: string;
  readonly suppliedCensorCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surveyId: { type: "string", maxLength: 8192, minLength: 1 },
    effortText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCensorCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["surveyId", "effortText", "suppliedCensorCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit fish survey effort transcription and censoring code without imputing effort or abundance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surveyId, effortText, suppliedCensorCode } = request;
  const compute = (): Output => {
    H.domain(surveyId.length > 0, "surveyId");
    H.domain(effortText.length > 0, "effortText");
    H.domain(suppliedCensorCode.length > 0, "suppliedCensorCode");
    return {
      token: JSON.stringify([surveyId, effortText, suppliedCensorCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    surveyId: "S17",
    effortText: ">2 hours",
    suppliedCensorCode: "right-censored",
  },
  output: { token: '["S17",">2 hours","right-censored"]' },
} satisfies ToolExample<Input, Output>;
export const ichthyofaunaSurveyEffortCensoredCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ichthyology/ichthyofauna-survey-effort-censored-code",
      title: "Ichthyofauna Survey Effort Censored Code Tool",
      description:
        "Preserve explicit fish survey effort transcription and censoring code without imputing effort or abundance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          surveyId: { type: "string", maxLength: 8192, minLength: 1 },
          effortText: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedCensorCode: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["surveyId", "effortText", "suppliedCensorCode"],
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
            id: "effortText",
            label: "Effort Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedCensorCode",
            label: "Supplied Censor Code",
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
export const run = ichthyofaunaSurveyEffortCensoredCodeTool.execute;
export default ichthyofaunaSurveyEffortCensoredCodeTool;
