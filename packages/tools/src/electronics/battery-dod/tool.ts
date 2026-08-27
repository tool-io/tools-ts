import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatteryDodInput = {
  readonly dischargedAh: number;
  readonly fullCapacityAh: number;
};

export type BatteryDodOutput = {
  readonly depthOfDischargePercent: number;
};

export const batteryDodExample = {
  input: { dischargedAh: 45, fullCapacityAh: 60 },
  output: { depthOfDischargePercent: 75 },
} satisfies ToolExample<BatteryDodInput, BatteryDodOutput>;

export const calculateBatteryDod = (
  input: BatteryDodInput,
): BatteryDodOutput => {
  if (!(input.fullCapacityAh > 0))
    simpleError(
      "fullCapacityAh",
      "Full capacity must be positive.",
      "invalid_charge",
    );
  if (
    !(input.dischargedAh >= 0) ||
    !(input.dischargedAh <= input.fullCapacityAh)
  )
    simpleError(
      "dischargedAh",
      "Discharged charge must be between zero and the full capacity.",
      "invalid_charge",
    );
  return {
    depthOfDischargePercent: (input.dischargedAh / input.fullCapacityAh) * 100,
  };
};

export const batteryDodTool = createSimpleTool({
  calculate: (input) =>
    calculateBatteryDod(input as unknown as BatteryDodInput),
  description:
    "Compute the depth of discharge of a battery from discharged and full capacity.",
  id: "electronics/battery-dod",
  inputs: [
    {
      description: "Charge already drawn from the battery.",
      format: "capacity",
      id: "dischargedAh",
      kind: "number",
      label: "Discharged capacity",
      unit: "Ah",
    },
    {
      description: "Rated full capacity of the battery.",
      format: "capacity",
      id: "fullCapacityAh",
      kind: "number",
      label: "Full capacity",
      unit: "Ah",
    },
  ],
  outputs: [
    {
      description: "Percentage of full capacity that has been removed.",
      format: "percent",
      id: "depthOfDischargePercent",
      kind: "number",
      label: "Depth of discharge",
      unit: "%",
    },
  ],
  title: "Depth Of Discharge %",
});
export const runBatteryDod = batteryDodTool.execute;
export default batteryDodTool;
