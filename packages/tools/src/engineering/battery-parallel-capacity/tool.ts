import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatteryParallelCapacityInput = Readonly<{
  readonly branchCapacityAmpHours: number;
  readonly branchCount: number;
}>;
export type BatteryParallelCapacityOutput = Readonly<{
  readonly packCapacityAmpHours: number;
}>;

export const calculateBatteryParallelCapacity = (
  x: BatteryParallelCapacityInput,
): BatteryParallelCapacityOutput => {
  if (
    !Number.isFinite(x.branchCapacityAmpHours) ||
    x.branchCapacityAmpHours < 0
  )
    simpleError(
      "branchCapacityAmpHours",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.branchCount) || x.branchCount < 1)
    simpleError("branchCount", "Provide a positive integer.");
  if (!Number.isInteger(x.branchCount))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const packCapacityAmpHours = x.branchCapacityAmpHours * x.branchCount;
  if (!Number.isFinite(packCapacityAmpHours))
    simpleError(
      "packCapacityAmpHours",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    packCapacityAmpHours: Object.is(packCapacityAmpHours, -0)
      ? 0
      : packCapacityAmpHours,
  };
};

export const example = {
  input: { branchCapacityAmpHours: 2.5, branchCount: 3 },
  output: { packCapacityAmpHours: 7.5 },
} satisfies ToolExample<
  BatteryParallelCapacityInput,
  BatteryParallelCapacityOutput
>;

export const tool = createSimpleTool({
  id: "engineering/battery-parallel-capacity",
  title: "Battery Parallel Capacity",
  description:
    "Nominal parallel pack amp-hour capacity from identical branch capacity and integer branch count.",
  inputs: [
    {
      id: "branchCapacityAmpHours",
      kind: "number",
      label: "Branch Capacity Amp Hours",
      unit: "Ah",
      minimum: 0,
    },
    { id: "branchCount", kind: "integer", label: "Branch Count", minimum: 1 },
  ],
  outputs: [
    {
      id: "packCapacityAmpHours",
      kind: "number",
      label: "Pack Capacity Amp Hours",
      unit: "Ah",
    },
  ],
  calculate: (input) =>
    calculateBatteryParallelCapacity({
      branchCapacityAmpHours: input.branchCapacityAmpHours as number,
      branchCount: input.branchCount as number,
    }),
});
export const batteryParallelCapacityTool = tool;
export const runBatteryParallelCapacity = tool.execute;
export default tool;
