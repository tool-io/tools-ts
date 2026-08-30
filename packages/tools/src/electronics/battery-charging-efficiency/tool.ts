import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatteryChargingEfficiencyInput = Readonly<{
  readonly storedWattHours: number;
  readonly inputWattHours: number;
}>;
export type BatteryChargingEfficiencyOutput = Readonly<{
  readonly efficiencyPercent: number;
}>;

export const calculateBatteryChargingEfficiency = (
  x: BatteryChargingEfficiencyInput,
): BatteryChargingEfficiencyOutput => {
  if (!Number.isFinite(x.storedWattHours) || x.storedWattHours < 0)
    simpleError("storedWattHours", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.inputWattHours) || x.inputWattHours < 0)
    simpleError("inputWattHours", "Provide a finite number at least 0.");
  if (x.storedWattHours > x.inputWattHours)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const efficiencyPercent = (100 * x.storedWattHours) / x.inputWattHours;
  if (!Number.isFinite(efficiencyPercent))
    simpleError(
      "efficiencyPercent",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    efficiencyPercent: Object.is(efficiencyPercent, -0) ? 0 : efficiencyPercent,
  };
};

export const example = {
  input: { storedWattHours: 80, inputWattHours: 100 },
  output: { efficiencyPercent: 80 },
} satisfies ToolExample<
  BatteryChargingEfficiencyInput,
  BatteryChargingEfficiencyOutput
>;

export const tool = createSimpleTool({
  id: "electronics/battery-charging-efficiency",
  title: "Battery Charging Efficiency",
  description:
    "Energy efficiency of a charge cycle from measured energy stored and energy drawn from the charger.",
  inputs: [
    {
      id: "storedWattHours",
      kind: "number",
      label: "Stored Watt Hours",
      unit: "Wh",
      minimum: 0,
    },
    {
      id: "inputWattHours",
      kind: "number",
      label: "Input Watt Hours",
      unit: "Wh",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "efficiencyPercent",
      kind: "number",
      label: "Efficiency Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateBatteryChargingEfficiency({
      storedWattHours: input.storedWattHours as number,
      inputWattHours: input.inputWattHours as number,
    }),
});
export const batteryChargingEfficiencyTool = tool;
export const runBatteryChargingEfficiency = tool.execute;
export default tool;
