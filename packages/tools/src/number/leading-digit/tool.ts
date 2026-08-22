import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const leadingDigitTool = createSimpleTool({
  id: "number/leading-digit",
  title: "Leading Digit Extractor",
  description:
    "Extract the leading decimal digit of an integer, ignoring its sign.",
  inputs: [{ id: "value", label: "Integer", kind: "integer" }],
  outputs: [{ id: "leadingDigit", label: "Leading digit", kind: "integer" }],
  calculate: (input) => {
    const digits = String(Math.abs(input.value as number));
    return { leadingDigit: Number(digits[0]) };
  },
});
export const runLeadingDigit = leadingDigitTool.execute;
export default leadingDigitTool;

export type LeadingDigitInput = {
  readonly value: number;
};

export type LeadingDigitOutput = {
  readonly leadingDigit: number;
};

export const leadingDigitExample = {
  input: {
    value: 1,
  },
  output: {
    leadingDigit: 1,
  },
} satisfies ToolExample<LeadingDigitInput, LeadingDigitOutput>;
