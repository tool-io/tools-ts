import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly exponent: number; readonly digits: number };
export type Output = { readonly ulp: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exponent: { type: "integer", minimum: -300, maximum: 300 },
    digits: { type: "integer", minimum: 1, maximum: 16 },
  },
  required: ["exponent", "digits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ulp: { type: "number" } },
  required: ["ulp"],
} as const;
/** Return decimal spacing at a supplied base-ten order and significant-digit count, not binary IEEE spacing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exponent, digits } = request;
  const compute = (): Output => {
    H.integer(exponent, -300, 300);
    H.integer(digits, 1, 16);
    return { ulp: 10 ** (exponent - digits + 1) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { exponent: 3, digits: 4 },
  output: { ulp: 1 },
} satisfies ToolExample<Input, Output>;
export const decimalUlpAtExplicitExponentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/decimal-ulp-at-explicit-exponent",
    title: "Decimal Ulp At Explicit Exponent Tool",
    description:
      "Return decimal spacing at a supplied base-ten order and significant-digit count, not binary IEEE spacing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exponent: { type: "integer", minimum: -300, maximum: 300 },
        digits: { type: "integer", minimum: 1, maximum: 16 },
      },
      required: ["exponent", "digits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ulp: { type: "number" } },
      required: ["ulp"],
    },
    ports: {
      inputs: [
        {
          id: "exponent",
          label: "Exponent",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "digits",
          label: "Digits",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "ulp", label: "Ulp", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = decimalUlpAtExplicitExponentTool.execute;
export default decimalUlpAtExplicitExponentTool;
