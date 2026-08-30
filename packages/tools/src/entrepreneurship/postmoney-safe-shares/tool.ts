import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly investment: number;
  readonly postmoneyCap: number;
  readonly otherFullyDilutedShares: number;
}>;
export type Output = Readonly<{
  readonly safeOwnershipFraction: number;
  readonly safeShares: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.investment, "investment");
  positive(input.postmoneyCap, "postmoneyCap");
  positive(input.otherFullyDilutedShares, "otherFullyDilutedShares");
  if (input.investment >= input.postmoneyCap)
    simpleError("investment", "Investment must be below the post-money cap.");
  const safeOwnershipFraction = input.investment / input.postmoneyCap;
  return {
    safeOwnershipFraction,
    safeShares:
      (input.otherFullyDilutedShares * safeOwnershipFraction) /
      (1 - safeOwnershipFraction),
  };
};
export const exampleInput = {
  investment: 200,
  postmoneyCap: 1000,
  otherFullyDilutedShares: 800,
} satisfies Input;
export const exampleOutput = {
  safeOwnershipFraction: 0.2,
  safeShares: 200,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/postmoney-safe-shares",
  title: "Postmoney SAFE Shares",
  description:
    "Solve one cap-only post-money SAFE share count before new-money financing dilution.",
  inputs: [
    { id: "investment", label: "Investment", kind: "number" },
    { id: "postmoneyCap", label: "Postmoney cap", kind: "number" },
    {
      id: "otherFullyDilutedShares",
      label: "Other fully diluted shares",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "safeOwnershipFraction",
      label: "Safe ownership fraction",
      kind: "number",
    },
    { id: "safeShares", label: "Safe shares", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      investment: value.investment as number,
      postmoneyCap: value.postmoneyCap as number,
      otherFullyDilutedShares: value.otherFullyDilutedShares as number,
    }),
});
export const run = tool.execute;
export default tool;
