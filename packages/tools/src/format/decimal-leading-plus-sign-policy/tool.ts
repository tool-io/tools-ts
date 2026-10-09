import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly decimalText: string;
  readonly addLeadingPlus: boolean;
};
export type Output = { readonly formatted: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    decimalText: { type: "string", maxLength: 8192 },
    addLeadingPlus: { type: "boolean" },
  },
  required: ["decimalText", "addLeadingPlus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { formatted: { type: "string", maxLength: 8192 } },
  required: ["formatted"],
} as const;
/** Add or remove an explicit leading plus on strict decimal text while preserving a minus, trailing zeros, and negative zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { decimalText, addLeadingPlus } = request;
  const compute = (): Output => {
    H.domain(
      /^[+-]?(?:0|[1-9]\d*)(?:\.\d+)?(?![\s\S])/.test(decimalText),
      "decimalText",
    );
    return {
      formatted: decimalText.startsWith("-")
        ? decimalText
        : (addLeadingPlus ? "+" : "") +
          (decimalText.startsWith("+") ? decimalText.slice(1) : decimalText),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { decimalText: "12.50", addLeadingPlus: true },
  output: { formatted: "+12.50" },
} satisfies ToolExample<Input, Output>;
export const decimalLeadingPlusSignPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["format", "data formatting", "computer science"],
      keywords: ["data formatting", "computer science"],
    },
    id: "format/decimal-leading-plus-sign-policy",
    title: "Decimal Leading Plus Sign Policy",
    description:
      "Add or remove an explicit leading plus on strict decimal text while preserving a minus, trailing zeros, and negative zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        decimalText: { type: "string", maxLength: 8192 },
        addLeadingPlus: { type: "boolean" },
      },
      required: ["decimalText", "addLeadingPlus"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { formatted: { type: "string", maxLength: 8192 } },
      required: ["formatted"],
    },
    ports: {
      inputs: [
        {
          id: "decimalText",
          label: "Decimal Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "addLeadingPlus",
          label: "Add Leading Plus",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "formatted", label: "Formatted", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = decimalLeadingPlusSignPolicyTool.execute;
export default decimalLeadingPlusSignPolicyTool;
