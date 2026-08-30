import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly documentedIncome: number;
  readonly documentedFunding: number;
  readonly observedSpending: number;
  readonly assetIncrease: number;
}>;
export type Output = Readonly<{
  readonly availableFunds: number;
  readonly usesOfFunds: number;
  readonly unexplainedDifference: number;
}>;

export const calculate = (input: Input): Output => {
  const availableFunds = input.documentedIncome + input.documentedFunding;
  const usesOfFunds = input.observedSpending + input.assetIncrease;
  return {
    availableFunds,
    usesOfFunds,
    unexplainedDifference: usesOfFunds - availableFunds,
  };
};

export const exampleInput = {
  documentedIncome: 100000,
  documentedFunding: 10000,
  observedSpending: 90000,
  assetIncrease: 30000,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  documentedIncome: 100000,
  documentedFunding: 0,
  observedSpending: 80000,
  assetIncrease: 20000,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      documentedIncome: input.documentedIncome as number,
      documentedFunding: input.documentedFunding as number,
      observedSpending: input.observedSpending as number,
      assetIncrease: input.assetIncrease as number,
    }),
  description:
    "Reconcile documented sources and observed uses of funds without inferring misconduct.",
  id: "auditing/lifestyle-cash-flow-analysis",
  inputs: [
    {
      id: "documentedIncome",
      label: "Documented income",
      kind: "number",
      unit: "currency",
    },
    {
      id: "documentedFunding",
      label: "Other documented funding",
      kind: "number",
      unit: "currency",
    },
    {
      id: "observedSpending",
      label: "Observed spending",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "assetIncrease",
      label: "Asset increase",
      kind: "number",
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "availableFunds",
      label: "Available funds",
      kind: "number",
      unit: "currency",
    },
    {
      id: "usesOfFunds",
      label: "Uses of funds",
      kind: "number",
      unit: "currency",
    },
    {
      id: "unexplainedDifference",
      label: "Unexplained difference",
      kind: "number",
      unit: "currency",
    },
  ],
  title: "Lifestyle Cash-Flow Analysis",
});

export const run = tool.execute;
export default tool;
