import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatteryCycleCountEstimateInput = Readonly<{
  readonly absoluteThroughputAh: number;
  readonly ratedCapacityAh: number;
}>;
export type BatteryCycleCountEstimateOutput = Readonly<{
  equivalentCycles: number;
}>;

export const calculateBatteryCycleCountEstimate = (
  i: BatteryCycleCountEstimateInput,
): BatteryCycleCountEstimateOutput => {
  const value = i.absoluteThroughputAh / (2 * i.ratedCapacityAh);
  if (!Number.isFinite(value))
    simpleError("equivalentCycles", "The inputs produce a non-finite result.");
  return { equivalentCycles: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { absoluteThroughputAh: 1600, ratedCapacityAh: 80 },
  output: { equivalentCycles: 10 },
} satisfies ToolExample<
  BatteryCycleCountEstimateInput,
  BatteryCycleCountEstimateOutput
>;

export const tool = createSimpleTool({
  id: "electronics/battery-cycle-count-estimate",
  title: "Battery Cycle Count Estimate",
  description:
    "Estimate full-equivalent battery cycles from total absolute charge-plus-discharge throughput divided by twice the rated ampere-hour capacity.",
  inputs: [
    {
      id: "absoluteThroughputAh",
      kind: "number",
      label: "Absolute Throughput (Ah)",
      unit: "Ah",
      minimum: 0,
    },
    {
      id: "ratedCapacityAh",
      kind: "number",
      label: "Rated Capacity (Ah)",
      unit: "Ah",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "equivalentCycles", kind: "number", label: "Equivalent Cycles" },
  ],
  calculate: (input) =>
    calculateBatteryCycleCountEstimate({
      absoluteThroughputAh: input.absoluteThroughputAh as number,
      ratedCapacityAh: input.ratedCapacityAh as number,
    }),
});
export const batteryCycleCountEstimateTool = tool;
export const runBatteryCycleCountEstimate = tool.execute;
export default tool;
