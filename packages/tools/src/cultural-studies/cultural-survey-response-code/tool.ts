import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseCode: string;
  readonly allowedCodes: readonly string[];
  readonly missingCode: string;
};
export type Output = { readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseCode: { type: "string", maxLength: 8192 },
    allowedCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missingCode: { type: "string", maxLength: 8192 },
  },
  required: ["responseCode", "allowedCodes", "missingCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
/** Classify an explicit survey response against supplied valid and missing-code vocabularies without guessing its substantive meaning. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseCode, allowedCodes, missingCode } = request;
  const compute = (): Output => {
    H.domain(
      new Set(allowedCodes).size === allowedCodes.length &&
        !allowedCodes.includes(missingCode),
      "allowedCodes",
    );
    return {
      status:
        responseCode === missingCode
          ? "missing"
          : allowedCodes.includes(responseCode)
            ? "recognized"
            : "unknown-code",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { responseCode: "A", allowedCodes: ["A", "B"], missingCode: "NA" },
  output: { status: "recognized" },
} satisfies ToolExample<Input, Output>;
export const culturalSurveyResponseCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-studies/cultural-survey-response-code",
    title: "Cultural Survey Response Code Tool",
    description:
      "Classify an explicit survey response against supplied valid and missing-code vocabularies without guessing its substantive meaning.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseCode: { type: "string", maxLength: 8192 },
        allowedCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        missingCode: { type: "string", maxLength: 8192 },
      },
      required: ["responseCode", "allowedCodes", "missingCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { status: { type: "string", maxLength: 8192 } },
      required: ["status"],
    },
    ports: {
      inputs: [
        {
          id: "responseCode",
          label: "Response Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowedCodes",
          label: "Allowed Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "missingCode",
          label: "Missing Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "status", label: "Status", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = culturalSurveyResponseCodeTool.execute;
export default culturalSurveyResponseCodeTool;
