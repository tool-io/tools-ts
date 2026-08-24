import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TotalIonizingDoseThresholdShiftInput = {
  readonly doseResponseMillivoltsPerKrad: number;
  readonly totalDoseKrad: number;
};

export type TotalIonizingDoseThresholdShiftOutput = {
  readonly thresholdShiftMillivolts: number;
};

export const totalIonizingDoseThresholdShiftExample = {
  input: { doseResponseMillivoltsPerKrad: 2, totalDoseKrad: 250 },
  output: { thresholdShiftMillivolts: 500 },
} satisfies ToolExample<
  TotalIonizingDoseThresholdShiftInput,
  TotalIonizingDoseThresholdShiftOutput
>;

export const totalIonizingDoseThresholdShiftTool = createSimpleTool({
  id: "semiconductor/total-ionizing-dose-threshold-shift",
  title: "TID Threshold Shift Calculator",
  description:
    "Compute the radiation-induced MOSFET threshold-voltage shift from total ionizing dose and a linear dose response.",
  inputs: [
    {
      description: "Total accumulated ionizing dose.",
      id: "totalDoseKrad",
      kind: "number",
      label: "Total ionizing dose",
      minimum: 0,
      unit: "krad",
    },
    {
      description: "Linear threshold shift per unit dose.",
      id: "doseResponseMillivoltsPerKrad",
      kind: "number",
      label: "Dose response",
      unit: "mV/krad",
    },
  ],
  outputs: [
    {
      description: "Signed threshold-voltage shift.",
      format: "voltage-mv",
      id: "thresholdShiftMillivolts",
      kind: "number",
      label: "Threshold shift",
      unit: "mV",
    },
  ],
  calculate: (input) => {
    const doseResponseMillivoltsPerKrad =
      input.doseResponseMillivoltsPerKrad as number;
    const thresholdShiftMillivolts =
      doseResponseMillivoltsPerKrad * (input.totalDoseKrad as number);
    if (!Number.isFinite(thresholdShiftMillivolts))
      simpleError("totalDoseKrad", "Calculated threshold shift is not finite.");
    return { thresholdShiftMillivolts };
  },
});
export const runTotalIonizingDoseThresholdShift =
  totalIonizingDoseThresholdShiftTool.execute;
export default totalIonizingDoseThresholdShiftTool;
