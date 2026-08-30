import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ClosingCostsInput = Readonly<{
  readonly lenderCosts: number;
  readonly titleCosts: number;
  readonly recordingCosts: number;
  readonly otherCosts: number;
}>;
export type ClosingCostsOutput = Readonly<{
  readonly totalClosingCosts: number;
}>;

export const calculateClosingCosts = (
  x: ClosingCostsInput,
): ClosingCostsOutput => {
  if (!Number.isFinite(x.lenderCosts) || x.lenderCosts < 0)
    simpleError("lenderCosts", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.titleCosts) || x.titleCosts < 0)
    simpleError("titleCosts", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.recordingCosts) || x.recordingCosts < 0)
    simpleError("recordingCosts", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.otherCosts) || x.otherCosts < 0)
    simpleError("otherCosts", "Provide a finite nonnegative number.");
  const totalClosingCosts =
    x.lenderCosts + x.titleCosts + x.recordingCosts + x.otherCosts;
  if (!Number.isFinite(totalClosingCosts))
    simpleError(
      "totalClosingCosts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    totalClosingCosts: Object.is(totalClosingCosts, -0) ? 0 : totalClosingCosts,
  };
};

export const example = {
  input: {
    lenderCosts: 2000,
    titleCosts: 1000,
    recordingCosts: 200,
    otherCosts: 500,
  },
  output: { totalClosingCosts: 3700 },
} satisfies ToolExample<ClosingCostsInput, ClosingCostsOutput>;

export const tool = createSimpleTool({
  id: "real-estate/closing-costs",
  title: "Closing Costs",
  description:
    "Sum of lender, title, recording, and other separately supplied closing costs in one currency.",
  inputs: [
    {
      id: "lenderCosts",
      kind: "number",
      label: "Lender Costs",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "titleCosts",
      kind: "number",
      label: "Title Costs",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "recordingCosts",
      kind: "number",
      label: "Recording Costs",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "otherCosts",
      kind: "number",
      label: "Other Costs",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "totalClosingCosts",
      kind: "number",
      label: "Total Closing Costs",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateClosingCosts({
      lenderCosts: input.lenderCosts as number,
      titleCosts: input.titleCosts as number,
      recordingCosts: input.recordingCosts as number,
      otherCosts: input.otherCosts as number,
    }),
});
export const closingCostsTool = tool;
export const runClosingCosts = tool.execute;
export default tool;
