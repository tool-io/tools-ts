import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AppraisalAverageValuePerItemInput = Readonly<{
  readonly totalAppraisedValue: number;
  readonly itemCount: number;
}>;
export type AppraisalAverageValuePerItemOutput = Readonly<{
  readonly averageAppraisedValue: number;
}>;

export const calculateAppraisalAverageValuePerItem = (
  x: AppraisalAverageValuePerItemInput,
): AppraisalAverageValuePerItemOutput => {
  if (!Number.isFinite(x.totalAppraisedValue) || x.totalAppraisedValue < 0)
    simpleError("totalAppraisedValue", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.itemCount) ||
    x.itemCount <= 0 ||
    !Number.isSafeInteger(x.itemCount)
  )
    simpleError("itemCount", "Provide a positive whole number.");
  const averageAppraisedValue = x.totalAppraisedValue / x.itemCount;
  if (!Number.isFinite(averageAppraisedValue))
    simpleError(
      "averageAppraisedValue",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    averageAppraisedValue: Object.is(averageAppraisedValue, -0)
      ? 0
      : averageAppraisedValue,
  };
};

export const example = {
  input: {
    totalAppraisedValue: 1000,
    itemCount: 20,
  },
  output: { averageAppraisedValue: 50 },
} satisfies ToolExample<
  AppraisalAverageValuePerItemInput,
  AppraisalAverageValuePerItemOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/appraisal-average-value-per-item",
  title: "Appraisal Average Value Per Item",
  description: "Average the stated appraised value across collection items.",
  inputs: [
    {
      id: "totalAppraisedValue",
      kind: "number",
      label: "Total Appraised Value",
      unit: "currency",
    },
    { id: "itemCount", kind: "number", label: "Item Count", unit: "items" },
  ],
  outputs: [
    {
      id: "averageAppraisedValue",
      kind: "number",
      label: "Average Appraised Value",
      unit: "currency/item",
    },
  ],
  calculate: (input) =>
    calculateAppraisalAverageValuePerItem({
      totalAppraisedValue: input.totalAppraisedValue as number,
      itemCount: input.itemCount as number,
    }),
});
export const runAppraisalAverageValuePerItem = tool.execute;
export default tool;
