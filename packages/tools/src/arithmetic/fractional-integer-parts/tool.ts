import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const fractionalIntegerPartsExample = {
  input: { value: 12.75 },
} satisfies ToolExample<{ readonly value: number }>;

export const fractionalIntegerPartsTool = createSimpleTool({
  id: "arithmetic/fractional-integer-parts",
  title: "Fractional and Integer Parts Calculator",
  description:
    "Split a finite number into truncating integer and signed fractional parts.",
  inputs: [{ id: "value", label: "Value", kind: "number" }],
  outputs: [
    { id: "integerPart", label: "Integer part", kind: "integer" },
    { id: "fractionalPart", label: "Fractional part", kind: "number" },
  ],
  calculate: (input) => {
    const value = input.value as number;
    const integerPart = Math.trunc(value);
    return { integerPart, fractionalPart: value - integerPart };
  },
});
export const runFractionalIntegerParts = fractionalIntegerPartsTool.execute;
export default fractionalIntegerPartsTool;
