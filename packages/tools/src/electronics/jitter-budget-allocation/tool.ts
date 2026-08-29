import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type JitterBudgetAllocationInput = Readonly<{
  readonly totalBudgetSeconds: number;
  readonly usedRmsSeconds: number;
}>;
export type JitterBudgetAllocationOutput = Readonly<{
  remainingRmsSeconds: number;
}>;

export const calculateJitterBudgetAllocation = (
  i: JitterBudgetAllocationInput,
): JitterBudgetAllocationOutput => {
  if (i.usedRmsSeconds > i.totalBudgetSeconds)
    simpleError("usedRmsSeconds", "Used RMS jitter exceeds the total budget.");
  const value =
    i.totalBudgetSeconds === 0
      ? 0
      : i.totalBudgetSeconds *
        Math.sqrt(
          Math.max(
            0,
            (1 - i.usedRmsSeconds / i.totalBudgetSeconds) *
              (1 + i.usedRmsSeconds / i.totalBudgetSeconds),
          ),
        );
  if (!Number.isFinite(value))
    simpleError(
      "remainingRmsSeconds",
      "The inputs produce a non-finite result.",
    );
  return { remainingRmsSeconds: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { totalBudgetSeconds: 5e-12, usedRmsSeconds: 3e-12 },
  output: { remainingRmsSeconds: 3.999999999999999e-12 },
} satisfies ToolExample<
  JitterBudgetAllocationInput,
  JitterBudgetAllocationOutput
>;

export const tool = createSimpleTool({
  id: "electronics/jitter-budget-allocation",
  title: "Jitter Budget Allocation",
  description:
    "Find the remaining independent random-jitter RMS allowance by subtracting used RMS jitter in quadrature from a total RMS budget.",
  inputs: [
    {
      id: "totalBudgetSeconds",
      kind: "number",
      label: "Total Budget (s)",
      unit: "s",
      minimum: 0,
    },
    {
      id: "usedRmsSeconds",
      kind: "number",
      label: "Used RMS (s)",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "remainingRmsSeconds",
      kind: "number",
      label: "Remaining RMS (s)",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateJitterBudgetAllocation({
      totalBudgetSeconds: input.totalBudgetSeconds as number,
      usedRmsSeconds: input.usedRmsSeconds as number,
    }),
});
export const jitterBudgetAllocationTool = tool;
export const runJitterBudgetAllocation = tool.execute;
export default tool;
