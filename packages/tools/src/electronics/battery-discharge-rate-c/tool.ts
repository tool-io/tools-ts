import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BatteryDischargeRateCInput = Readonly<{
  readonly currentAmperes: number;
  readonly capacityAmpereHours: number;
}>;
export type BatteryDischargeRateCOutput = Readonly<{
  readonly cRate: number;
}>;

export const calculateBatteryDischargeRateC = (
  x: BatteryDischargeRateCInput,
): BatteryDischargeRateCOutput => {
  if (!Number.isFinite(x.currentAmperes) || x.currentAmperes < 0)
    simpleError("currentAmperes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.capacityAmpereHours) || x.capacityAmpereHours < 0)
    simpleError("capacityAmpereHours", "Provide a finite number at least 0.");
  const cRate = x.currentAmperes / x.capacityAmpereHours;
  if (!Number.isFinite(cRate))
    simpleError("cRate", "Inputs produce an undefined or non-finite result.");
  return { cRate: Object.is(cRate, -0) ? 0 : cRate };
};

export const example = {
  input: { currentAmperes: 10, capacityAmpereHours: 20 },
  output: { cRate: 0.5 },
} satisfies ToolExample<
  BatteryDischargeRateCInput,
  BatteryDischargeRateCOutput
>;

export const tool = createSimpleTool({
  id: "electronics/battery-discharge-rate-c",
  title: "Battery Discharge Rate C",
  description:
    "Battery discharge C-rate from current and rated ampere-hour capacity.",
  inputs: [
    {
      id: "currentAmperes",
      kind: "number",
      label: "Current Amperes",
      unit: "A",
      minimum: 0,
    },
    {
      id: "capacityAmpereHours",
      kind: "number",
      label: "Capacity Ampere Hours",
      unit: "Ah",
      minimum: 0,
    },
  ],
  outputs: [{ id: "cRate", kind: "number", label: "C Rate", unit: "1/h" }],
  calculate: (input) =>
    calculateBatteryDischargeRateC({
      currentAmperes: input.currentAmperes as number,
      capacityAmpereHours: input.capacityAmpereHours as number,
    }),
});
export const batteryDischargeRateCTool = tool;
export const runBatteryDischargeRateC = tool.execute;
export default tool;
