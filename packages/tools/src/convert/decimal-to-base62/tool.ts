import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const DIGITS = [...ALPHABET];

export const decimalToBase62Tool = createSimpleTool({
  id: "convert/decimal-to-base62",
  title: "Decimal to Base62 Converter",
  description:
    "Convert a nonnegative decimal integer to base62 using the digit alphabet 0-9, A-Z, a-z.",
  inputs: [{ id: "value", label: "Integer", kind: "integer", minimum: 0 }],
  outputs: [{ id: "base62", label: "Base62", kind: "string" }],
  calculate: (input) => {
    let remaining = input.value as number;
    let output = "";
    do {
      output = DIGITS[remaining % 62]! + output;
      remaining = Math.floor(remaining / 62);
    } while (remaining > 0);
    return { base62: output };
  },
});
export const runDecimalToBase62 = decimalToBase62Tool.execute;
export default decimalToBase62Tool;

export type DecimalToBase62Input = {
  readonly value: number;
};

export type DecimalToBase62Output = {
  readonly base62: string;
};

export const decimalToBase62Example = {
  input: {
    value: 1,
  },
  output: {
    base62: "1",
  },
} satisfies ToolExample<DecimalToBase62Input, DecimalToBase62Output>;
