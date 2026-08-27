import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatteryDischargeDepthInput = {
  readonly fullAh: number;
  readonly usedAh: number;
};

export type BatteryDischargeDepthOutput = {
  readonly dischargeDepthPercent: number;
};

export const batteryDischargeDepthExample = {
  input: { fullAh: 60, usedAh: 22.5 },
  output: { dischargeDepthPercent: 37.5 },
} satisfies ToolExample<
  BatteryDischargeDepthInput,
  BatteryDischargeDepthOutput
>;

export const calculateBatteryDischargeDepth = (
  input: BatteryDischargeDepthInput,
): BatteryDischargeDepthOutput => {
  if (!(input.fullAh > 0))
    simpleError("fullAh", "Full capacity must be positive.", "invalid_charge");
  if (!(input.usedAh >= 0) || !(input.usedAh <= input.fullAh))
    simpleError(
      "usedAh",
      "Used charge must be between zero and the full capacity.",
      "invalid_charge",
    );
  return { dischargeDepthPercent: (input.usedAh / input.fullAh) * 100 };
};

export const batteryDischargeDepthTool = createSimpleTool({
  calculate: (input) =>
    calculateBatteryDischargeDepth(
      input as unknown as BatteryDischargeDepthInput,
    ),
  description:
    "Compute the depth of discharge of a battery from the charge drawn and its rated capacity.",
  id: "electronics/battery-discharge-depth",
  inputs: [
    {
      description: "Rated full capacity of the battery.",
      format: "capacity",
      id: "fullAh",
      kind: "number",
      label: "Full capacity",
      unit: "Ah",
    },
    {
      description: "Charge already drawn from the battery.",
      format: "capacity",
      id: "usedAh",
      kind: "number",
      label: "Used capacity",
      unit: "Ah",
    },
  ],
  outputs: [
    {
      description: "Percentage of rated capacity that has been removed.",
      format: "percent",
      id: "dischargeDepthPercent",
      kind: "number",
      label: "Discharge depth",
      unit: "%",
    },
  ],
  title: "Discharge Depth Percent",
});
export const runBatteryDischargeDepth = batteryDischargeDepthTool.execute;
export default batteryDischargeDepthTool;
