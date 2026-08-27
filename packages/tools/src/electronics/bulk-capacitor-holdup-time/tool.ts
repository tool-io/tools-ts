import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const bulkCapacitorHoldupTimeExample = {
  input: {
    capacitanceUf: 1000,
    loadPowerWatts: 1,
    vminVolts: 5,
    vinVolts: 12,
  },
} satisfies ToolExample<{
  readonly capacitanceUf: number;
  readonly loadPowerWatts: number;
  readonly vminVolts: number;
  readonly vinVolts: number;
}>;

export const bulkCapacitorHoldupTimeTool = createSimpleTool({
  id: "electronics/bulk-capacitor-holdup-time",
  title: "Holdup Time",
  description:
    "Compute the holdup time of a bulk capacitor from the energy delivered between the input and minimum voltages at a constant load power.",
  inputs: [
    {
      id: "capacitanceUf",
      label: "Capacitance",
      kind: "number",
      unit: "\u00b5F",
    },
    { id: "vinVolts", label: "Input voltage", kind: "number", unit: "V" },
    {
      id: "vminVolts",
      label: "Minimum voltage",
      kind: "number",
      unit: "V",
    },
    {
      id: "loadPowerWatts",
      label: "Load power",
      kind: "number",
      unit: "W",
    },
  ],
  outputs: [
    {
      id: "holdupTimeMs",
      label: "Holdup time",
      kind: "number",
      unit: "ms",
    },
  ],
  calculate: (input) => {
    const capacitanceUf = input.capacitanceUf as number;
    const vinVolts = input.vinVolts as number;
    const vminVolts = input.vminVolts as number;
    const loadPowerWatts = input.loadPowerWatts as number;
    if (!(capacitanceUf > 0))
      simpleError(
        "capacitanceUf",
        "Capacitance must be positive.",
        "invalid_capacitance",
      );
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
    if (!(loadPowerWatts > 0))
      simpleError(
        "loadPowerWatts",
        "Load power must be positive.",
        "invalid_power",
      );
    return {
      holdupTimeMs:
        (capacitanceUf * (vinVolts ** 2 - vminVolts ** 2)) /
        (2 * loadPowerWatts),
    };
  },
});
export const runBulkCapacitorHoldupTime = bulkCapacitorHoldupTimeTool.execute;
export default bulkCapacitorHoldupTimeTool;
