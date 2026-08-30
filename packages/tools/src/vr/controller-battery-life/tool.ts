import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ControllerBatteryLifeInput = Readonly<{
  readonly usableWattHours: number;
  readonly averageWatts: number;
}>;
export type ControllerBatteryLifeOutput = Readonly<{
  readonly hours: number;
}>;

export const calculateControllerBatteryLife = (
  x: ControllerBatteryLifeInput,
): ControllerBatteryLifeOutput => {
  if (!Number.isFinite(x.usableWattHours) || x.usableWattHours <= 0)
    simpleError("usableWattHours", "Provide a finite positive number.");
  if (!Number.isFinite(x.averageWatts) || x.averageWatts <= 0)
    simpleError("averageWatts", "Provide a finite positive number.");
  const hours = x.usableWattHours / x.averageWatts;
  if (!Number.isFinite(hours))
    simpleError("hours", "Inputs produce an undefined or out-of-range result.");
  return { hours: Object.is(hours, -0) ? 0 : hours };
};

export const example = {
  input: {
    usableWattHours: 10,
    averageWatts: 2,
  },
  output: { hours: 5 },
} satisfies ToolExample<
  ControllerBatteryLifeInput,
  ControllerBatteryLifeOutput
>;

export const tool = createSimpleTool({
  id: "vr/controller-battery-life",
  title: "Controller Battery Life",
  description:
    "Estimated controller operating hours from usable battery energy and average electrical draw.",
  inputs: [
    {
      id: "usableWattHours",
      kind: "number",
      label: "Usable Watt Hours",
      unit: "Wh",
      minimum: 0,
    },
    {
      id: "averageWatts",
      kind: "number",
      label: "Average Watts",
      unit: "W",
      minimum: 0,
    },
  ],
  outputs: [{ id: "hours", kind: "number", label: "Hours", unit: "h" }],
  calculate: (input) =>
    calculateControllerBatteryLife({
      usableWattHours: input.usableWattHours as number,
      averageWatts: input.averageWatts as number,
    }),
});
export const controllerBatteryLifeTool = tool;
export const runControllerBatteryLife = tool.execute;
export default tool;
