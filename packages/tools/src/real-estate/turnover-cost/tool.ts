import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TurnoverCostInput = Readonly<{
  readonly costPerTurnover: number;
  readonly turnoverCount: number;
}>;
export type TurnoverCostOutput = Readonly<{
  readonly totalTurnoverCost: number;
}>;

export const calculateTurnoverCost = (
  x: TurnoverCostInput,
): TurnoverCostOutput => {
  if (!Number.isFinite(x.costPerTurnover) || x.costPerTurnover < 0)
    simpleError("costPerTurnover", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.turnoverCount) || x.turnoverCount < 0)
    simpleError("turnoverCount", "Provide a finite nonnegative number.");
  if (!Number.isInteger(x.turnoverCount))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const totalTurnoverCost = x.costPerTurnover * x.turnoverCount;
  if (!Number.isFinite(totalTurnoverCost))
    simpleError(
      "totalTurnoverCost",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    totalTurnoverCost: Object.is(totalTurnoverCost, -0) ? 0 : totalTurnoverCost,
  };
};

export const example = {
  input: {
    costPerTurnover: 1500,
    turnoverCount: 3,
  },
  output: { totalTurnoverCost: 4500 },
} satisfies ToolExample<TurnoverCostInput, TurnoverCostOutput>;

export const tool = createSimpleTool({
  id: "real-estate/turnover-cost",
  title: "Turnover Cost",
  description:
    "Expected turnover expense from cost per turnover and number of turnovers.",
  inputs: [
    {
      id: "costPerTurnover",
      kind: "number",
      label: "Cost Per Turnover",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "turnoverCount",
      kind: "number",
      label: "Turnover Count",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "totalTurnoverCost",
      kind: "number",
      label: "Total Turnover Cost",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateTurnoverCost({
      costPerTurnover: input.costPerTurnover as number,
      turnoverCount: input.turnoverCount as number,
    }),
});
export const turnoverCostTool = tool;
export const runTurnoverCost = tool.execute;
export default tool;
