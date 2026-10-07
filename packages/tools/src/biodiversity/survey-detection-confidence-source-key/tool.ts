import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly surveyId: string;
  readonly confidenceText: string;
  readonly methodSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surveyId: { type: "string", maxLength: 8192, minLength: 1 },
    confidenceText: { type: "string", maxLength: 8192, minLength: 1 },
    methodSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["surveyId", "confidenceText", "methodSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve supplied survey detection-confidence metadata without calculating probability of detection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surveyId, confidenceText, methodSource } = request;
  const compute = (): Output => {
    H.domain(surveyId.length > 0, "surveyId");
    H.domain(confidenceText.length > 0, "confidenceText");
    H.domain(methodSource.length > 0, "methodSource");
    return { token: JSON.stringify([surveyId, confidenceText, methodSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    surveyId: "S17",
    confidenceText: "high",
    methodSource: "protocol P4",
  },
  output: { token: '["S17","high","protocol P4"]' },
} satisfies ToolExample<Input, Output>;
export const surveyDetectionConfidenceSourceKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biodiversity", "biology"],
      keywords: ["biodiversity", "biology"],
    },
    id: "biodiversity/survey-detection-confidence-source-key",
    title: "Survey Detection Confidence Source Key",
    description:
      "Preserve supplied survey detection-confidence metadata without calculating probability of detection.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surveyId: { type: "string", maxLength: 8192, minLength: 1 },
        confidenceText: { type: "string", maxLength: 8192, minLength: 1 },
        methodSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["surveyId", "confidenceText", "methodSource"],
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
          id: "confidenceText",
          label: "Confidence Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "methodSource",
          label: "Method Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = surveyDetectionConfidenceSourceKeyTool.execute;
export default surveyDetectionConfidenceSourceKeyTool;
