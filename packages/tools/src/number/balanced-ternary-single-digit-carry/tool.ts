import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: number };
export type Output = { readonly digit: number; readonly carry: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "integer" } },
  required: ["value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { digit: { type: "integer" }, carry: { type: "integer" } },
  required: ["digit", "carry"],
} as const;
/** Calculate balanced ternary single digit carry from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value } = request;
  const compute = (): Output => {
    const digit = H.mod(value + 1, 3) - 1;
    return { digit, carry: (value - digit) / 3 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 2 },
  output: { digit: -1, carry: 1 },
} satisfies ToolExample<Input, Output>;
export const balancedTernarySingleDigitCarryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/balanced-ternary-single-digit-carry",
    title: "Balanced Ternary Single Digit Carry Tool",
    description:
      "Calculate balanced ternary single digit carry from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "integer" } },
      required: ["value"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { digit: { type: "integer" }, carry: { type: "integer" } },
      required: ["digit", "carry"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "digit", label: "Digit", valueType: { type: "integer" } },
        { id: "carry", label: "Carry", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = balancedTernarySingleDigitCarryTool.execute;
export default balancedTernarySingleDigitCarryTool;
