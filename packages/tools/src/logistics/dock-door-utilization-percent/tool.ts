import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DockDoorUtilizationPercentInput = {
  readonly occupiedDoorHours: number;
  readonly availableDoorHours: number;
};

export type DockDoorUtilizationPercentOutput = {
  readonly utilizationPercent: number;
};

export const calculateDockDoorUtilizationPercent = (
  input: DockDoorUtilizationPercentInput,
): DockDoorUtilizationPercentOutput => {
  if (
    !Number.isFinite(input.availableDoorHours) ||
    input.availableDoorHours <= 0
  )
    return simpleError(
      "availableDoorHours",
      "Available door hours must be finite and greater than zero.",
      "invalid_hours",
    );
  if (!Number.isFinite(input.occupiedDoorHours) || input.occupiedDoorHours < 0)
    return simpleError(
      "occupiedDoorHours",
      "Occupied door hours must be finite and non-negative.",
      "invalid_occupied_hours",
    );
  const utilizationPercent =
    input.occupiedDoorHours === 0
      ? 0
      : (input.occupiedDoorHours / input.availableDoorHours) * 100;
  if (!Number.isFinite(utilizationPercent))
    return simpleError(
      "occupiedDoorHours",
      "Door utilization is too large to represent.",
      "result_out_of_range",
    );
  return {
    utilizationPercent,
  };
};

export const dockDoorUtilizationPercentExample = {
  input: { occupiedDoorHours: 84, availableDoorHours: 112 },
  output: { utilizationPercent: 75 },
} satisfies ToolExample<
  DockDoorUtilizationPercentInput,
  DockDoorUtilizationPercentOutput
>;

export const dockDoorUtilizationPercentTool = createSimpleTool({
  id: "logistics/dock-door-utilization-percent",
  title: "Dock Door Utilization Percent Calculator",
  description:
    "Compute dock-door utilization as occupied door hours over available door hours.",
  inputs: [
    {
      description:
        "Door hours with a trailer occupying the door; overlapping use or inconsistent capacity bases can produce values above available hours.",
      id: "occupiedDoorHours",
      kind: "number",
      label: "Occupied door-hours",
      minimum: 0,
      unit: "door·h",
    },
    {
      description: "Total scheduled door-hours available in the same period.",
      id: "availableDoorHours",
      kind: "number",
      label: "Available door-hours",
      minimum: Number.MIN_VALUE,
      unit: "door·h",
    },
  ],
  outputs: [
    {
      description:
        "Occupied door-hours as a percentage of available door-hours.",
      id: "utilizationPercent",
      kind: "number",
      label: "Utilization",
      minimum: 0,
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateDockDoorUtilizationPercent({
      availableDoorHours: input.availableDoorHours as number,
      occupiedDoorHours: input.occupiedDoorHours as number,
    }),
});

export const runDockDoorUtilizationPercent =
  dockDoorUtilizationPercentTool.execute;
export default dockDoorUtilizationPercentTool;
