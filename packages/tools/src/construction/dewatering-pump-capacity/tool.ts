import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DewateringPumpCapacityInput = Readonly<{
  readonly waterCubicMeters: number;
  readonly availableHours: number;
}>;
export type DewateringPumpCapacityOutput = Readonly<{
  readonly cubicMetersPerHour: number;
}>;

export const calculateDewateringPumpCapacity = (
  x: DewateringPumpCapacityInput,
): DewateringPumpCapacityOutput => {
  if (!Number.isFinite(x.waterCubicMeters) || x.waterCubicMeters < 0)
    simpleError("waterCubicMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.availableHours) || x.availableHours < 0)
    simpleError("availableHours", "Provide a finite number at least 0.");
  const cubicMetersPerHour = x.waterCubicMeters / x.availableHours;
  if (!Number.isFinite(cubicMetersPerHour))
    simpleError(
      "cubicMetersPerHour",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    cubicMetersPerHour: Object.is(cubicMetersPerHour, -0)
      ? 0
      : cubicMetersPerHour,
  };
};

export const example = {
  input: { waterCubicMeters: 100, availableHours: 5 },
  output: { cubicMetersPerHour: 20 },
} satisfies ToolExample<
  DewateringPumpCapacityInput,
  DewateringPumpCapacityOutput
>;

export const tool = createSimpleTool({
  id: "construction/dewatering-pump-capacity",
  title: "Dewatering Pump Capacity",
  description:
    "Minimum average dewatering flow to remove a known water volume over a chosen time, before adding continuing inflow or contingency.",
  inputs: [
    {
      id: "waterCubicMeters",
      kind: "number",
      label: "Water Cubic Meters",
      unit: "m³",
      minimum: 0,
    },
    {
      id: "availableHours",
      kind: "number",
      label: "Available Hours",
      unit: "h",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "cubicMetersPerHour",
      kind: "number",
      label: "Cubic Meters Per Hour",
      unit: "m³/h",
    },
  ],
  calculate: (input) =>
    calculateDewateringPumpCapacity({
      waterCubicMeters: input.waterCubicMeters as number,
      availableHours: input.availableHours as number,
    }),
});
export const dewateringPumpCapacityTool = tool;
export const runDewateringPumpCapacity = tool.execute;
export default tool;
