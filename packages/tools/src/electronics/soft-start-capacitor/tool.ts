import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const softStartCapacitorExample = {
  input: {
    iChargeUa: 10,
    softStartTimeMs: 10,
    targetVoltageVolts: 1,
  },
} satisfies ToolExample<{
  readonly iChargeUa: number;
  readonly softStartTimeMs: number;
  readonly targetVoltageVolts: number;
}>;

export const softStartCapacitorTool = createSimpleTool({
  id: "electronics/soft-start-capacitor",
  title: "Soft-Start Cap Value",
  description:
    "Compute the soft-start capacitance from the charging current and ramp time via C = I x t / V.",
  inputs: [
    {
      id: "softStartTimeMs",
      label: "Soft-start time",
      kind: "number",
      unit: "ms",
    },
    {
      id: "iChargeUa",
      label: "Charging current",
      kind: "number",
      unit: "\u00b5A",
    },
    {
      id: "targetVoltageVolts",
      label: "Target voltage",
      kind: "number",
      unit: "V",
    },
  ],
  outputs: [
    {
      id: "softStartCapacitanceUf",
      label: "Soft-start capacitance",
      kind: "number",
      unit: "\u00b5F",
    },
  ],
  calculate: (input) => {
    const softStartTimeMs = input.softStartTimeMs as number;
    const iChargeUa = input.iChargeUa as number;
    const targetVoltageVolts = input.targetVoltageVolts as number;
    if (!(softStartTimeMs > 0))
      simpleError("softStartTimeMs", "Soft-start time must be positive.");
    if (!(iChargeUa > 0))
      simpleError(
        "iChargeUa",
        "Charging current must be positive.",
        "invalid_current",
      );
    if (!(targetVoltageVolts > 0))
      simpleError(
        "targetVoltageVolts",
        "Target voltage must be positive.",
        "invalid_voltage",
      );
    return {
      softStartCapacitanceUf:
        (softStartTimeMs * iChargeUa) / (targetVoltageVolts * 1000),
    };
  },
});
export const runSoftStartCapacitor = softStartCapacitorTool.execute;
export default softStartCapacitorTool;
