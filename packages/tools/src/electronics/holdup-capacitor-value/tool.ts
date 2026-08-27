import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const holdupCapacitorValueExample = {
  input: {
    holdupTimeMs: 59500,
    loadPowerWatts: 1,
    vminVolts: 5,
    vinVolts: 12,
  },
} satisfies ToolExample<{
  readonly holdupTimeMs: number;
  readonly loadPowerWatts: number;
  readonly vminVolts: number;
  readonly vinVolts: number;
}>;

export const holdupCapacitorValueTool = createSimpleTool({
  id: "electronics/holdup-capacitor-value",
  title: "Holdup Cap Value",
  description:
    "Compute the capacitance required to hold up a load from the input voltage down to a minimum voltage for a given time at constant power.",
  inputs: [
    {
      id: "loadPowerWatts",
      label: "Load power",
      kind: "number",
      unit: "W",
    },
    {
      id: "holdupTimeMs",
      label: "Holdup time",
      kind: "number",
      unit: "ms",
    },
    { id: "vinVolts", label: "Input voltage", kind: "number", unit: "V" },
    {
      id: "vminVolts",
      label: "Minimum voltage",
      kind: "number",
      unit: "V",
    },
  ],
  outputs: [
    {
      id: "requiredCapacitanceUf",
      label: "Required capacitance",
      kind: "number",
      unit: "\u00b5F",
    },
  ],
  calculate: (input) => {
    const loadPowerWatts = input.loadPowerWatts as number;
    const holdupTimeMs = input.holdupTimeMs as number;
    const vinVolts = input.vinVolts as number;
    const vminVolts = input.vminVolts as number;
    if (!(loadPowerWatts > 0))
      simpleError(
        "loadPowerWatts",
        "Load power must be positive.",
        "invalid_power",
      );
    if (!(holdupTimeMs > 0))
      simpleError("holdupTimeMs", "Holdup time must be positive.");
    if (!(vminVolts > 0))
      simpleError(
        "vminVolts",
        "Minimum voltage must be positive.",
        "invalid_voltage",
      );
    if (!(vinVolts > vminVolts))
      simpleError(
        "vinVolts",
        "Input voltage must exceed the minimum voltage.",
        "invalid_voltage",
      );
    return {
      requiredCapacitanceUf:
        (2 * loadPowerWatts * holdupTimeMs) / (vinVolts ** 2 - vminVolts ** 2),
    };
  },
});
export const runHoldupCapacitorValue = holdupCapacitorValueTool.execute;
export default holdupCapacitorValueTool;
