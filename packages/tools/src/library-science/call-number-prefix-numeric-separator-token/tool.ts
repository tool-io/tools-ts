import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prefixText: string;
  readonly numericText: string;
  readonly separator: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefixText: { type: "string", maxLength: 8192, minLength: 1 },
    numericText: { type: "string", maxLength: 8192, minLength: 1 },
    separator: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["prefixText", "numericText", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit call-number prefix, numeric component and separator fields without validating a classification scheme. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prefixText, numericText, separator } = request;
  const compute = (): Output => {
    H.domain(prefixText.length > 0, "prefixText");
    H.domain(numericText.length > 0, "numericText");
    H.domain(separator.length > 0, "separator");
    return { token: JSON.stringify([prefixText, numericText, separator]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { prefixText: "QA", numericText: "76.73", separator: " " },
  output: { token: '["QA","76.73"," "]' },
} satisfies ToolExample<Input, Output>;
export const callNumberPrefixNumericSeparatorTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "library-science",
          "library science",
          "information and language sciences",
        ],
        keywords: ["library science", "information and language sciences"],
      },
      id: "library-science/call-number-prefix-numeric-separator-token",
      title: "Call Number Prefix Numeric Separator Token",
      description:
        "Preserve explicit call-number prefix, numeric component and separator fields without validating a classification scheme.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          prefixText: { type: "string", maxLength: 8192, minLength: 1 },
          numericText: { type: "string", maxLength: 8192, minLength: 1 },
          separator: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["prefixText", "numericText", "separator"],
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
            id: "prefixText",
            label: "Prefix Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "numericText",
            label: "Numeric Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "separator",
            label: "Separator",
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
export const run = callNumberPrefixNumericSeparatorTokenTool.execute;
export default callNumberPrefixNumericSeparatorTokenTool;
