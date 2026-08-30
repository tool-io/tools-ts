import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly eligibleProjectCost: number;
  readonly creditRatePercent: number;
  readonly creditCap: number;
}>;
export type Output = Readonly<{
  readonly uncappedCredit: number;
  readonly creditAmount: number;
}>;

export const calculate = (input: Input): Output => {
  const uncappedCredit =
    (input.eligibleProjectCost * input.creditRatePercent) / 100;
  return {
    uncappedCredit,
    creditAmount: Math.min(uncappedCredit, input.creditCap),
  };
};

export const exampleInput = {
  eligibleProjectCost: 30000,
  creditRatePercent: 30,
  creditCap: 7500,
} satisfies Input;
export const exampleOutput = {
  uncappedCredit: 9000,
  creditAmount: 7500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      eligibleProjectCost: input.eligibleProjectCost as number,
      creditRatePercent: input.creditRatePercent as number,
      creditCap: input.creditCap as number,
    }),
  description:
    "Calculate a clean-energy credit using caller-supplied rate and cap.",
  id: "taxation/clean-energy-credit",
  inputs: [
    {
      id: "eligibleProjectCost",
      label: "Eligible project cost",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "creditRatePercent",
      label: "Credit rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "creditCap",
      label: "Credit cap",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "uncappedCredit",
      label: "Uncapped credit",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "creditAmount",
      label: "Credit amount",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  title: "Clean-Energy Credit",
});

export const run = tool.execute;
export default tool;
