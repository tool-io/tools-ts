import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapacityRatioInput = {
  readonly capacityFactor1: number;
  readonly capacityFactor2: number;
};

export type CapacityRatioOutput = {
  readonly capacityRatio: number;
};

export const capacityRatioExample = {
  input: { capacityFactor1: 2, capacityFactor2: 6 },
  output: { capacityRatio: 3 },
} satisfies ToolExample<CapacityRatioInput, CapacityRatioOutput>;

export const capacityRatioTool = createSimpleTool({
  id: "chemistry/chromatography-capacity-ratio",
  title: "Capacity Ratio k2/k1",
  description:
    "Compute the chromatographic capacity ratio from two adjusted capacity factors, k2 divided by k1.",
  inputs: [
    {
      id: "capacityFactor1",
      label: "Capacity factor k1",
      kind: "number",
    },
    {
      id: "capacityFactor2",
      label: "Capacity factor k2",
      kind: "number",
    },
  ],
  outputs: [{ id: "capacityRatio", label: "Capacity ratio", kind: "number" }],
  calculate: (input) => {
    const capacityFactor1 = input.capacityFactor1 as number;
    const capacityFactor2 = input.capacityFactor2 as number;
    if (!(capacityFactor1 > 0))
      simpleError("capacityFactor1", "Capacity factor k1 must be positive.");
    if (!(capacityFactor2 > 0))
      simpleError("capacityFactor2", "Capacity factor k2 must be positive.");
    return { capacityRatio: capacityFactor2 / capacityFactor1 };
  },
});
export const runCapacityRatio = capacityRatioTool.execute;
export default capacityRatioTool;
