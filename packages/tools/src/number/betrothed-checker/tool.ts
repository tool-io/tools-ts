import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type BetrothedCheckerInput = {
  readonly a: number;
  readonly b: number;
};

export type BetrothedCheckerOutput = {
  readonly isBetrothedPair: boolean;
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

export const betrothedCheckerExample = {
  input: { a: 48, b: 75 },
  output: { isBetrothedPair: true },
} satisfies ToolExample<BetrothedCheckerInput, BetrothedCheckerOutput>;

export const calculateBetrothedChecker = (
  input: BetrothedCheckerInput,
): BetrothedCheckerOutput => ({
  isBetrothedPair:
    input.a !== input.b &&
    properDivisorSum(input.a) === input.b + 1 &&
    properDivisorSum(input.b) === input.a + 1,
});

export const betrothedCheckerTool = createSimpleTool({
  id: "number/betrothed-checker",
  title: "Betrothed Numbers Checker",
  description:
    "Check whether two integers form a pair of betrothed numbers whose proper divisor sums exceed each partner by one.",
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
    { id: "isBetrothedPair", label: "Is a betrothed pair", kind: "boolean" },
  ],
  calculate: (input) =>
    calculateBetrothedChecker({
      a: input.a as number,
      b: input.b as number,
    }),
});
export const runBetrothedChecker = betrothedCheckerTool.execute;
export default betrothedCheckerTool;
