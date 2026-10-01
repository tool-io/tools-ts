import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly symbol: string };
export type Output = { readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    symbol: { type: "string", maxLength: 8192, enum: ["T", "0", "1"] },
  },
  required: ["symbol"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "integer" } },
  required: ["value"],
} as const;
/** Compute balanced ternary single digit value from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { symbol } = input;
  const compute = (): Output => {
    domain(["T", "0", "1"].includes(symbol));
    return { value: symbol === "T" ? -1 : Number(symbol) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { symbol: "T" },
  output: { value: -1 },
} satisfies ToolExample<Input, Output>;
export const balancedTernarySingleDigitValueTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "number/balanced-ternary-single-digit-value",
  title: "Balanced Ternary Single Digit Value Tool",
  description:
    "Compute balanced ternary single digit value from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "symbol",
        label: "Symbol",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [{ id: "value", label: "Value", valueType: { type: "integer" } }],
  },
});
export const run = balancedTernarySingleDigitValueTool.execute;
export default balancedTernarySingleDigitValueTool;
