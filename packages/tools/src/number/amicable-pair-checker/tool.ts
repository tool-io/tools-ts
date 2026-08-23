import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type AmicablePairCheckerInput = {
  readonly a: number;
  readonly b: number;
};

export type AmicablePairCheckerOutput = {
  readonly isAmicablePair: boolean;
};

const properDivisorSum = (value: number): number => {
  if (value <= 1) return 0;
  let total = 1;
  for (let divisor = 2; divisor * divisor <= value; divisor += 1)
    if (value % divisor === 0) {
      total += divisor;
      const paired = value / divisor;
      if (paired !== divisor) total += paired;
    }
  return total;
};

export const amicablePairCheckerExample = {
  input: { a: 220, b: 284 },
  output: { isAmicablePair: true },
} satisfies ToolExample<AmicablePairCheckerInput, AmicablePairCheckerOutput>;

export const calculateAmicablePairChecker = (
  input: AmicablePairCheckerInput,
): AmicablePairCheckerOutput => ({
  isAmicablePair:
    input.a !== input.b &&
    properDivisorSum(input.a) === input.b &&
    properDivisorSum(input.b) === input.a,
});

export const amicablePairCheckerTool = createSimpleTool({
  id: "number/amicable-pair-checker",
  title: "Amicable Pair Checker",
  description:
    "Check whether two integers form an amicable pair of proper divisor sums.",
  inputs: [
    {
      id: "a",
      label: "First integer",
      kind: "integer",
      maximum: 1_000_000_000,
      minimum: 2,
    },
    {
      id: "b",
      label: "Second integer",
      kind: "integer",
      maximum: 1_000_000_000,
      minimum: 2,
    },
  ],
  outputs: [
    { id: "isAmicablePair", label: "Is an amicable pair", kind: "boolean" },
  ],
  calculate: (input) =>
    calculateAmicablePairChecker({
      a: input.a as number,
      b: input.b as number,
    }),
});
export const runAmicablePairChecker = amicablePairCheckerTool.execute;
export default amicablePairCheckerTool;
