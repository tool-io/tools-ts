import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseCode: string;
  readonly validCodes: readonly string[];
  readonly missingCodes: readonly string[];
};
export type Output = { readonly classification: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseCode: { type: "string", maxLength: 8192 },
    validCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missingCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["responseCode", "validCodes", "missingCodes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { classification: { type: "string", maxLength: 8192 } },
  required: ["classification"],
} as const;
/** Classify one literal neighborhood-survey response against explicitly disjoint valid and missing-code vocabularies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseCode, validCodes, missingCodes } = request;
  const compute = (): Output => {
    H.domain(!validCodes.some((v) => missingCodes.includes(v)), "validCodes");
    return {
      classification: missingCodes.includes(responseCode)
        ? "missing"
        : validCodes.includes(responseCode)
          ? "valid-code"
          : "unknown-code",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { responseCode: "NA", validCodes: ["A", "B"], missingCodes: ["NA"] },
  output: { classification: "missing" },
} satisfies ToolExample<Input, Output>;
export const neighborhoodNeedSurveyResponseCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "community-development",
        "community development",
        "social sciences",
      ],
      keywords: ["community development", "social sciences"],
    },
    id: "community-development/neighborhood-need-survey-response-code",
    title: "Neighborhood Need Survey Response Code",
    description:
      "Classify one literal neighborhood-survey response against explicitly disjoint valid and missing-code vocabularies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseCode: { type: "string", maxLength: 8192 },
        validCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        missingCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["responseCode", "validCodes", "missingCodes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { classification: { type: "string", maxLength: 8192 } },
      required: ["classification"],
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
          id: "validCodes",
          label: "Valid Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "missingCodes",
          label: "Missing Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "classification",
          label: "Classification",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = neighborhoodNeedSurveyResponseCodeTool.execute;
export default neighborhoodNeedSurveyResponseCodeTool;
