import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SmithCheckerInput = {
  readonly value: number;
};

export type SmithCheckerOutput = {
  readonly isSmith: boolean;
};

const digitSum = (value: number): number =>
  [...String(value)].reduce((sum, digit) => sum + Number(digit), 0);

export const smithCheckerExample = {
  input: { value: 22 },
  output: { isSmith: true },
} satisfies ToolExample<SmithCheckerInput, SmithCheckerOutput>;

export const calculateSmithChecker = (
  input: SmithCheckerInput,
): SmithCheckerOutput => {
  if (input.value < 4) return { isSmith: false };
  let remaining = input.value;
  let factorDigitSum = 0;
  let factorCount = 0;
  for (let divisor = 2; divisor * divisor <= remaining; divisor += 1)
    while (remaining % divisor === 0) {
      factorCount += 1;
      factorDigitSum += digitSum(divisor);
      remaining /= divisor;
    }
  if (remaining > 1) {
    factorCount += 1;
    factorDigitSum += digitSum(remaining);
  }
  return {
    isSmith: factorCount > 1 && digitSum(input.value) === factorDigitSum,
  };
};

export const smithCheckerTool = createSimpleTool({
  id: "number/smith-checker",
  title: "Smith Number Checker",
  description:
    "Check whether a composite number's digit sum equals the digit sum of its prime factors with multiplicity.",
  inputs: [
    {
      id: "value",
      label: "Integer",
      kind: "integer",
      maximum: 1_000_000_000,
      minimum: 0,
    },
  ],
  outputs: [{ id: "isSmith", label: "Is a Smith number", kind: "boolean" }],
  calculate: (input) => calculateSmithChecker({ value: input.value as number }),
});
export const runSmithChecker = smithCheckerTool.execute;
export default smithCheckerTool;
