import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const digitFrequencyExample = {
  input: { n: 122333 },
  output: { frequency: { "1": 1, "2": 2, "3": 3 } },
} satisfies ToolExample<DigitFrequencyInput, DigitFrequencyOutput>;

export const calculateDigitFrequency = (
  input: DigitFrequencyInput,
): DigitFrequencyOutput => {
  const digits = String(input.n);
  const freq: Record<string, number> = {};
  for (const ch of digits) freq[ch] = (freq[ch] ?? 0) + 1;
  return { frequency: freq };
};

export type DigitFrequencyInput = { readonly n: number };
export type DigitFrequencyOutput = {
  readonly frequency: Readonly<Record<string, number>>;
};

export const digitFrequencyTool = createSimpleTool({
  calculate: (input) =>
    calculateDigitFrequency(input as unknown as DigitFrequencyInput),
  description:
    "Count how many times each digit appears in a nonnegative integer.",
  id: "number/digit-frequency",
  inputs: [{ id: "n", kind: "integer", label: "Number", minimum: 0 }],
  outputs: [{ id: "frequency", kind: "object", label: "Digit frequency" }],
  title: "Digit Frequency Counter",
});
export const runDigitFrequency = digitFrequencyTool.execute;
export default digitFrequencyTool;
