import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly numberText: string };
export type Output = {
  readonly validJsonNumber: boolean;
  readonly leadingPlus: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { numberText: { type: "string", maxLength: 8192 } },
  required: ["numberText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validJsonNumber: { type: "boolean" },
    leadingPlus: { type: "boolean" },
  },
  required: ["validJsonNumber", "leadingPlus"],
} as const;
/** Check an explicit JSON-number lexical token without parsing it as binary64; a leading plus is forbidden but an exponent plus is allowed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { numberText } = request;
  const compute = (): Output => {
    return {
      validJsonNumber:
        /^-?(?:0|[1-9][0-9]*)(?:[.][0-9]+)?(?:[eE][+-]?[0-9]+)?(?![\s\S])/.test(
          numberText,
        ),
      leadingPlus: numberText.startsWith("+"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { numberText: "+12" },
  output: { validJsonNumber: false, leadingPlus: true },
} satisfies ToolExample<Input, Output>;
export const jsonNumberPlusSignRejectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["json", "computer science"],
      keywords: ["JSON", "computer science"],
    },
    id: "json/json-number-plus-sign-rejection",
    title: "JSON Number Plus Sign Rejection",
    description:
      "Check an explicit JSON-number lexical token without parsing it as binary64; a leading plus is forbidden but an exponent plus is allowed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { numberText: { type: "string", maxLength: 8192 } },
      required: ["numberText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        validJsonNumber: { type: "boolean" },
        leadingPlus: { type: "boolean" },
      },
      required: ["validJsonNumber", "leadingPlus"],
    },
    ports: {
      inputs: [
        {
          id: "numberText",
          label: "Number Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "validJsonNumber",
          label: "Valid Json Number",
          valueType: { type: "boolean" },
        },
        {
          id: "leadingPlus",
          label: "Leading Plus",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = jsonNumberPlusSignRejectionTool.execute;
export default jsonNumberPlusSignRejectionTool;
