import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cashBalance: number;
  readonly cashThreshold: number;
  readonly minimumSweep: number;
  readonly existingInvestmentBalance: number;
}>;
export type Output = Readonly<{
  readonly availableToSweep: number;
  readonly sweepAmount: number;
  readonly endingCashBalance: number;
  readonly endingInvestmentBalance: number;
}>;

export const calculate = (input: Input): Output => {
  const availableToSweep = Math.max(0, input.cashBalance - input.cashThreshold),
    sweepAmount = availableToSweep >= input.minimumSweep ? availableToSweep : 0;
  return {
    availableToSweep,
    sweepAmount,
    endingCashBalance: input.cashBalance - sweepAmount,
    endingInvestmentBalance: input.existingInvestmentBalance + sweepAmount,
  };
};

export const exampleInput = {
  cashBalance: 5000,
  cashThreshold: 2000,
  minimumSweep: 500,
  existingInvestmentBalance: 10000,
} satisfies Input;
export const exampleOutput = {
  availableToSweep: 3000,
  sweepAmount: 3000,
  endingCashBalance: 2000,
  endingInvestmentBalance: 13000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      cashBalance: input.cashBalance as number,
      cashThreshold: input.cashThreshold as number,
      minimumSweep: input.minimumSweep as number,
      existingInvestmentBalance: input.existingInvestmentBalance as number,
    }),
  description:
    "Calculate an HSA cash-to-investment sweep from supplied thresholds.",
  id: "insurance/hsa-sweep",
  inputs: [
    {
      id: "cashBalance",
      label: "HSA cash balance",
      kind: "number",
      minimum: 0,
    },
    {
      id: "cashThreshold",
      label: "Cash threshold",
      kind: "number",
      minimum: 0,
    },
    {
      id: "minimumSweep",
      label: "Minimum investment sweep",
      kind: "number",
      minimum: 0,
    },
    {
      id: "existingInvestmentBalance",
      label: "Existing investment balance",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "availableToSweep",
      label: "Cash available above threshold",
      kind: "number",
      minimum: 0,
    },
    {
      id: "sweepAmount",
      label: "Investment sweep amount",
      kind: "number",
      minimum: 0,
    },
    {
      id: "endingCashBalance",
      label: "Ending cash balance",
      kind: "number",
      minimum: 0,
    },
    {
      id: "endingInvestmentBalance",
      label: "Ending investment balance",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "HSA Sweep",
});

export const run = tool.execute;
export default tool;
