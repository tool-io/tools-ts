import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CarryingCapacityInput = Readonly<{
  readonly waterVolumeCubicMeters: number;
  readonly maxPlannedDensityKgPerM3: number;
}>;
export type CarryingCapacityOutput = Readonly<{
  readonly plannedCapacityKilograms: number;
}>;

export const calculateCarryingCapacity = (
  x: CarryingCapacityInput,
): CarryingCapacityOutput => {
  if (
    !Number.isFinite(x.waterVolumeCubicMeters) ||
    x.waterVolumeCubicMeters < 0
  )
    simpleError(
      "waterVolumeCubicMeters",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.maxPlannedDensityKgPerM3) ||
    x.maxPlannedDensityKgPerM3 < 0
  )
    simpleError(
      "maxPlannedDensityKgPerM3",
      "Provide a finite nonnegative number.",
    );
  const plannedCapacityKilograms =
    x.waterVolumeCubicMeters * x.maxPlannedDensityKgPerM3;
  if (!Number.isFinite(plannedCapacityKilograms))
    simpleError(
      "plannedCapacityKilograms",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    plannedCapacityKilograms: Object.is(plannedCapacityKilograms, -0)
      ? 0
      : plannedCapacityKilograms,
  };
};

export const example = {
  input: {
    waterVolumeCubicMeters: 100,
    maxPlannedDensityKgPerM3: 10,
  },
  output: { plannedCapacityKilograms: 1000 },
} satisfies ToolExample<CarryingCapacityInput, CarryingCapacityOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/carrying-capacity",
  title: "Carrying Capacity",
  description:
    "Convert a user-supplied planning density to total biomass; the tool does not determine an ecologically safe limit.",
  inputs: [
    {
      id: "waterVolumeCubicMeters",
      kind: "number",
      label: "Water Volume Cubic Meters",
      unit: "m³",
    },
    {
      id: "maxPlannedDensityKgPerM3",
      kind: "number",
      label: "Max Planned Density Kg Per M3",
      unit: "kg/m³",
    },
  ],
  outputs: [
    {
      id: "plannedCapacityKilograms",
      kind: "number",
      label: "Planned Capacity Kilograms",
      unit: "kg",
    },
  ],
  calculate: (input) =>
    calculateCarryingCapacity({
      waterVolumeCubicMeters: input.waterVolumeCubicMeters as number,
      maxPlannedDensityKgPerM3: input.maxPlannedDensityKgPerM3 as number,
    }),
});
export const runCarryingCapacity = tool.execute;
export default tool;
