import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatteryInternalResistanceInput = {
  readonly loadCurrentAmps: number;
  readonly loadedVolts: number;
  readonly openCircuitVolts: number;
};

export type BatteryInternalResistanceOutput = {
  readonly internalResistanceOhms: number;
};

export const batteryInternalResistanceExample = {
  input: { loadCurrentAmps: 5, loadedVolts: 8.75, openCircuitVolts: 9 },
  output: { internalResistanceOhms: 0.05 },
} satisfies ToolExample<
  BatteryInternalResistanceInput,
  BatteryInternalResistanceOutput
>;

export const calculateBatteryInternalResistance = (
  input: BatteryInternalResistanceInput,
): BatteryInternalResistanceOutput => {
  if (!(input.loadCurrentAmps > 0))
    simpleError(
      "loadCurrentAmps",
      "Load current must be positive.",
      "invalid_current",
    );
  if (!(input.openCircuitVolts > input.loadedVolts))
    simpleError(
      "loadedVolts",
      "Open-circuit voltage must exceed loaded voltage.",
      "invalid_readings",
    );
  return {
    internalResistanceOhms:
      (input.openCircuitVolts - input.loadedVolts) / input.loadCurrentAmps,
  };
};

export const batteryInternalResistanceTool = createSimpleTool({
  calculate: (input) =>
    calculateBatteryInternalResistance(
      input as unknown as BatteryInternalResistanceInput,
    ),
  description:
    "Estimate battery internal resistance from open-circuit voltage, loaded voltage, and load current.",
  id: "electronics/battery-internal-resistance",
  inputs: [
    {
      description: "Terminal voltage with no load attached.",
      format: "voltage",
      id: "openCircuitVolts",
      kind: "number",
      label: "Open-circuit voltage",
      unit: "V",
    },
    {
      description: "Terminal voltage while supplying the load.",
      format: "voltage",
      id: "loadedVolts",
      kind: "number",
      label: "Loaded voltage",
      unit: "V",
    },
    {
      description: "Current drawn by the load.",
      format: "current",
      id: "loadCurrentAmps",
      kind: "number",
      label: "Load current",
      unit: "A",
    },
  ],
  outputs: [
    {
      description: "Equivalent series resistance of the battery.",
      format: "resistance",
      id: "internalResistanceOhms",
      kind: "number",
      label: "Internal resistance",
      unit: "Ω",
    },
  ],
  title: "Internal Resistance",
});
export const runBatteryInternalResistance =
  batteryInternalResistanceTool.execute;
export default batteryInternalResistanceTool;
