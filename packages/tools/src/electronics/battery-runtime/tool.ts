import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatteryRuntimeInput = {
  readonly capacityAh: number;
  readonly loadCurrentA: number;
};

export type BatteryRuntimeOutput = {
  readonly runtimeHours: number;
};

export const batteryRuntimeExample = {
  input: { capacityAh: 10, loadCurrentA: 2 },
  output: { runtimeHours: 5 },
} satisfies ToolExample<BatteryRuntimeInput, BatteryRuntimeOutput>;

export const batteryRuntimeTool = createSimpleTool({
  id: "electronics/battery-runtime",
  title: "Battery Runtime Hours",
  description:
    "Compute battery runtime in hours as capacity in ampere-hours divided by load current in amperes.",
  inputs: [
    { id: "capacityAh", label: "Battery capacity", kind: "number", unit: "Ah" },
    { id: "loadCurrentA", label: "Load current", kind: "number", unit: "A" },
  ],
  outputs: [
    { id: "runtimeHours", label: "Runtime", kind: "number", unit: "h" },
  ],
  calculate: (input) => {
    const capacityAh = input.capacityAh as number;
    const loadCurrentA = input.loadCurrentA as number;
    if (!(capacityAh > 0))
      simpleError(
        "capacityAh",
        "Capacity must be positive.",
        "invalid_capacity",
      );
    if (!(loadCurrentA > 0))
      simpleError(
        "loadCurrentA",
        "Load current must be positive.",
        "invalid_current",
      );
    return { runtimeHours: capacityAh / loadCurrentA };
  },
});
export const runBatteryRuntime = batteryRuntimeTool.execute;
export default batteryRuntimeTool;
