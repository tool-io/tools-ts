import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type DecimalToBase36Input = {
  readonly value: number;
};

export type DecimalToBase36Output = {
  readonly base36: string;
};

const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";

export const decimalToBase36Example = {
  input: { value: 12345 },
  output: { base36: "9ix" },
} satisfies ToolExample<DecimalToBase36Input, DecimalToBase36Output>;

export const decimalToBase36Tool = createSimpleTool({
  id: "convert/decimal-to-base36",
  title: "Decimal to Base36 Converter",
  description:
    "Convert a nonnegative decimal integer to base36 using the lowercase digit alphabet 0-9, a-z.",
  inputs: [{ id: "value", kind: "integer", label: "Integer", minimum: 0 }],
  outputs: [{ id: "base36", kind: "string", label: "Base36" }],
  calculate: (input) => {
    let remaining = input.value as number;
    let output = "";
    do {
      output = DIGITS[remaining % 36]! + output;
      remaining = Math.floor(remaining / 36);
    } while (remaining > 0);
    return { base36: output };
  },
});
export const runDecimalToBase36 = decimalToBase36Tool.execute;
export default decimalToBase36Tool;
