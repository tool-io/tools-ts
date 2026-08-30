import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReservoirCapacityInput = Readonly<{
  readonly withdrawalCubicMetersPerDay: number;
  readonly daysOfAutonomy: number;
}>;
export type ReservoirCapacityOutput = Readonly<{
  readonly requiredCubicMeters: number;
}>;

export const calculateReservoirCapacity = (
  x: ReservoirCapacityInput,
): ReservoirCapacityOutput => {
  if (
    !Number.isFinite(x.withdrawalCubicMetersPerDay) ||
    x.withdrawalCubicMetersPerDay < 0
  )
    simpleError(
      "withdrawalCubicMetersPerDay",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.daysOfAutonomy) || x.daysOfAutonomy < 0)
    simpleError("daysOfAutonomy", "Provide a finite number at least 0.");
  const requiredCubicMeters = x.withdrawalCubicMetersPerDay * x.daysOfAutonomy;
  if (!Number.isFinite(requiredCubicMeters))
    simpleError(
      "requiredCubicMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    requiredCubicMeters: Object.is(requiredCubicMeters, -0)
      ? 0
      : requiredCubicMeters,
  };
};

export const example = {
  input: { withdrawalCubicMetersPerDay: 100, daysOfAutonomy: 3 },
  output: { requiredCubicMeters: 300 },
} satisfies ToolExample<ReservoirCapacityInput, ReservoirCapacityOutput>;

export const tool = createSimpleTool({
  id: "engineering/reservoir-capacity",
  title: "Reservoir Capacity",
  description:
    "Gross no-inflow storage volume from constant daily withdrawal and specified days of autonomy; excludes dead storage and evaporation.",
  inputs: [
    {
      id: "withdrawalCubicMetersPerDay",
      kind: "number",
      label: "Withdrawal Cubic Meters Per Day",
      unit: "m³/day",
      minimum: 0,
    },
    {
      id: "daysOfAutonomy",
      kind: "number",
      label: "Days Of Autonomy",
      unit: "day",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "requiredCubicMeters",
      kind: "number",
      label: "Required Cubic Meters",
      unit: "m³",
    },
  ],
  calculate: (input) =>
    calculateReservoirCapacity({
      withdrawalCubicMetersPerDay: input.withdrawalCubicMetersPerDay as number,
      daysOfAutonomy: input.daysOfAutonomy as number,
    }),
});
export const reservoirCapacityTool = tool;
export const runReservoirCapacity = tool.execute;
export default tool;
