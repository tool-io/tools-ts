import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, positive, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly existingShares: number;
  readonly existingPoolShares: number;
  readonly investment: number;
  readonly premoneyValuation: number;
  readonly targetPostmoneyPoolFraction: number;
}>;
export type Output = Readonly<{
  readonly newPoolShares: number;
  readonly investorShares: number;
  readonly founderPostmoneyPercent: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.existingShares, "existingShares");
  nonnegative(input.existingPoolShares, "existingPoolShares");
  if (input.existingPoolShares > input.existingShares)
    simpleError(
      "existingPoolShares",
      "Pool cannot exceed existing fully diluted shares.",
    );
  nonnegative(input.investment, "investment");
  positive(input.premoneyValuation, "premoneyValuation");
  fraction(input.targetPostmoneyPoolFraction, "targetPostmoneyPoolFraction");
  const k = 1 + input.investment / input.premoneyValuation,
    t = input.targetPostmoneyPoolFraction;
  if (t * k >= 1)
    simpleError(
      "targetPostmoneyPoolFraction",
      "Pool target leaves no valid pre-money capitalization.",
    );
  const newPoolShares = Math.max(
      0,
      (t * k * input.existingShares - input.existingPoolShares) / (1 - t * k),
    ),
    premoney = input.existingShares + newPoolShares,
    investorShares = (premoney * input.investment) / input.premoneyValuation;
  return {
    newPoolShares,
    investorShares,
    founderPostmoneyPercent:
      (100 * (input.existingShares - input.existingPoolShares)) /
      (premoney + investorShares),
  };
};
export const exampleInput = {
  existingShares: 800,
  existingPoolShares: 0,
  investment: 200,
  premoneyValuation: 800,
  targetPostmoneyPoolFraction: 0.2,
} satisfies Input;
export const exampleOutput = {
  newPoolShares: 266.6666666666667,
  investorShares: 266.6666666666667,
  founderPostmoneyPercent: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/premoney-option-pool-dilution",
  title: "Premoney Option Pool Dilution",
  description:
    "Solve a pre-money option-pool top-up for a target post-money unallocated pool fraction.",
  inputs: [
    { id: "existingShares", label: "Existing shares", kind: "number" },
    { id: "existingPoolShares", label: "Existing pool shares", kind: "number" },
    { id: "investment", label: "Investment", kind: "number" },
    { id: "premoneyValuation", label: "Premoney valuation", kind: "number" },
    {
      id: "targetPostmoneyPoolFraction",
      label: "Target postmoney pool fraction",
      kind: "number",
    },
  ],
  outputs: [
    { id: "newPoolShares", label: "New pool shares", kind: "number" },
    { id: "investorShares", label: "Investor shares", kind: "number" },
    {
      id: "founderPostmoneyPercent",
      label: "Founder postmoney percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      existingShares: value.existingShares as number,
      existingPoolShares: value.existingPoolShares as number,
      investment: value.investment as number,
      premoneyValuation: value.premoneyValuation as number,
      targetPostmoneyPoolFraction: value.targetPostmoneyPoolFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
