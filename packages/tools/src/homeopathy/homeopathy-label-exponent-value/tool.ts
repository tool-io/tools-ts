import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly printedExponent: string };
export type Output = { readonly exponent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { printedExponent: { type: "string", maxLength: 8192 } },
  required: ["printedExponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { exponent: { type: "integer" } },
  required: ["exponent"],
} as const;
/** Parse an explicit nonnegative decimal label exponent without interpreting potency or therapeutic effects. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { printedExponent } = request;
  const compute = (): Output => {
    H.domain(
      /^(?:0|[1-9]\d*)(?![\s\S])/.test(printedExponent),
      "printedExponent",
    );
    H.domain(Number.isSafeInteger(Number(printedExponent)), "printedExponent");
    return { exponent: Number(printedExponent) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { printedExponent: "12" },
  output: { exponent: 12 },
} satisfies ToolExample<Input, Output>;
export const homeopathyLabelExponentValueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["homeopathy", "health and medicine"],
      keywords: ["homeopathy", "health and medicine"],
    },
    id: "homeopathy/homeopathy-label-exponent-value",
    title: "Homeopathy Label Exponent Value",
    description:
      "Parse an explicit nonnegative decimal label exponent without interpreting potency or therapeutic effects.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { printedExponent: { type: "string", maxLength: 8192 } },
      required: ["printedExponent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { exponent: { type: "integer" } },
      required: ["exponent"],
    },
    ports: {
      inputs: [
        {
          id: "printedExponent",
          label: "Printed Exponent",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "exponent", label: "Exponent", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = homeopathyLabelExponentValueTool.execute;
export default homeopathyLabelExponentValueTool;
