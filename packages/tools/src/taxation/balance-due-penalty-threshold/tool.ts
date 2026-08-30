import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly balanceDue: number;
  readonly noPenaltyThreshold: number;
}>;
export type Output = Readonly<{
  readonly thresholdMargin: number;
  readonly belowThreshold: boolean;
}>;

export const calculate = (input: Input): Output => {
  const thresholdMargin = input.noPenaltyThreshold - input.balanceDue;
  return {
    thresholdMargin,
    belowThreshold: input.balanceDue < input.noPenaltyThreshold,
  };
};

export const exampleInput = {
  balanceDue: 750,
  noPenaltyThreshold: 1000,
} satisfies Input;
export const exampleOutput = {
  thresholdMargin: 250,
  belowThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      balanceDue: input.balanceDue as number,
      noPenaltyThreshold: input.noPenaltyThreshold as number,
    }),
  description:
    "Compare a balance due with a caller-supplied no-penalty threshold.",
  id: "taxation/balance-due-penalty-threshold",
  inputs: [
    {
      id: "balanceDue",
      label: "Balance due",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "noPenaltyThreshold",
      label: "No-penalty threshold",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "thresholdMargin",
      label: "Threshold minus balance",
      kind: "number",
      unit: "currency",
    },
    { id: "belowThreshold", label: "Below threshold", kind: "boolean" },
  ],
  title: "Balance-Due Penalty Threshold",
});

export const run = tool.execute;
export default tool;
