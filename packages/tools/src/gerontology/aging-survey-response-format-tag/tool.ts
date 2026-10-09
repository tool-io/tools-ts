import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemCode: string;
  readonly responseFormat: string;
  readonly formatSource: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemCode: { type: "string", maxLength: 8192, minLength: 1 },
    responseFormat: { type: "string", maxLength: 8192, minLength: 1 },
    formatSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["itemCode", "responseFormat", "formatSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Tag the explicitly selected survey response format without inferring accessibility preferences. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemCode, responseFormat, formatSource } = request;
  const compute = (): Output => {
    H.domain(
      itemCode.length > 0 &&
        responseFormat.length > 0 &&
        formatSource.length > 0,
      "itemCode",
    );
    return { tag: JSON.stringify([itemCode, responseFormat, formatSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    itemCode: "Q17",
    responseFormat: "large-print",
    formatSource: "Participant choice",
  },
  output: { tag: '["Q17","large-print","Participant choice"]' },
} satisfies ToolExample<Input, Output>;
export const agingSurveyResponseFormatTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gerontology", "health and medicine"],
      keywords: ["gerontology", "health and medicine"],
    },
    id: "gerontology/aging-survey-response-format-tag",
    title: "Aging Survey Response Format Tag",
    description:
      "Tag the explicitly selected survey response format without inferring accessibility preferences.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemCode: { type: "string", maxLength: 8192, minLength: 1 },
        responseFormat: { type: "string", maxLength: 8192, minLength: 1 },
        formatSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["itemCode", "responseFormat", "formatSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "itemCode",
          label: "Item Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "responseFormat",
          label: "Response Format",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "formatSource",
          label: "Format Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = agingSurveyResponseFormatTagTool.execute;
export default agingSurveyResponseFormatTagTool;
