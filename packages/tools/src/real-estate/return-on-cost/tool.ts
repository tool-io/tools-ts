import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReturnOnCostInput = Readonly<{
  readonly stabilizedAnnualNoi: number;
  readonly totalProjectCost: number;
}>;
export type ReturnOnCostOutput = Readonly<{
  readonly returnPercent: number;
}>;

export const calculateReturnOnCost = (
  x: ReturnOnCostInput,
): ReturnOnCostOutput => {
  if (!Number.isFinite(x.stabilizedAnnualNoi))
    simpleError("stabilizedAnnualNoi", "Provide a finite number.");
  if (!Number.isFinite(x.totalProjectCost) || x.totalProjectCost <= 0)
    simpleError("totalProjectCost", "Provide a finite positive number.");
  const returnPercent = (100 * x.stabilizedAnnualNoi) / x.totalProjectCost;
  if (!Number.isFinite(returnPercent))
    simpleError(
      "returnPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { returnPercent: Object.is(returnPercent, -0) ? 0 : returnPercent };
};

export const example = {
  input: {
    stabilizedAnnualNoi: 50000,
    totalProjectCost: 1000000,
  },
  output: { returnPercent: 5 },
} satisfies ToolExample<ReturnOnCostInput, ReturnOnCostOutput>;

export const tool = createSimpleTool({
  id: "real-estate/return-on-cost",
  title: "Return On Cost",
  description: "Stabilized annual NOI as a percentage of total project cost.",
  inputs: [
    {
      id: "stabilizedAnnualNoi",
      kind: "number",
      label: "Stabilized Annual Noi",
      unit: "currency",
    },
    {
      id: "totalProjectCost",
      kind: "number",
      label: "Total Project Cost",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "returnPercent",
      kind: "number",
      label: "Return Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateReturnOnCost({
      stabilizedAnnualNoi: input.stabilizedAnnualNoi as number,
      totalProjectCost: input.totalProjectCost as number,
    }),
});
export const returnOnCostTool = tool;
export const runReturnOnCost = tool.execute;
export default tool;
