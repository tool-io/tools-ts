import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  decimal,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly exclusiveLimit: string; readonly radix: number };
export type Output = { readonly digits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exclusiveLimit: { type: "string", maxLength: 8192 },
    radix: { type: "integer", minimum: 2, maximum: 36 },
  },
  required: ["exclusiveLimit", "radix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { digits: { type: "integer" } },
  required: ["digits"],
} as const;
/** Compute radix power ceiling digit budget from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { exclusiveLimit, radix } = input;
  const compute = (): Output => {
    integer(radix, 2, 36);
    const n = decimal(exclusiveLimit);
    domain(n > 0n);
    let power = 1n,
      digits = 0;
    while (power < n) {
      power *= BigInt(radix);
      digits++;
    }
    return { digits };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { exclusiveLimit: "256", radix: 2 },
  output: { digits: 8 },
} satisfies ToolExample<Input, Output>;
export const radixPowerCeilingDigitBudgetTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "number/radix-power-ceiling-digit-budget",
  title: "Radix Power Ceiling Digit Budget Tool",
  description:
    "Compute radix power ceiling digit budget from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "exclusiveLimit",
        label: "Exclusive Limit",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "radix",
        label: "Radix",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "digits", label: "Digits", valueType: { type: "integer" } },
    ],
  },
});
export const run = radixPowerCeilingDigitBudgetTool.execute;
export default radixPowerCeilingDigitBudgetTool;
