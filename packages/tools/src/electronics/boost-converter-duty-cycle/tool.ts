import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BoostDutyCycleInput = {
  readonly vIn: number;
  readonly vOut: number;
};

export type BoostDutyCycleOutput = {
  readonly dutyCyclePercent: number;
};

export const boostDutyCycleExample = {
  input: { vIn: 5, vOut: 10 },
  output: { dutyCyclePercent: 50 },
} satisfies ToolExample<BoostDutyCycleInput, BoostDutyCycleOutput>;

export const boostDutyCycleTool = createSimpleTool({
  id: "electronics/boost-converter-duty-cycle",
  title: "Boost Duty Cycle",
  description:
    "Compute the ideal boost converter duty cycle percent as (1 - Vin/Vout) x 100.",
  inputs: [
    { id: "vIn", label: "Input voltage", kind: "number", unit: "V" },
    { id: "vOut", label: "Output voltage", kind: "number", unit: "V" },
  ],
  outputs: [
    {
      id: "dutyCyclePercent",
      label: "Duty cycle",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const vIn = input.vIn as number;
    const vOut = input.vOut as number;
    if (!(vIn > 0))
      simpleError("vIn", "Input voltage must be positive.", "invalid_ratio");
    if (!(vOut > vIn))
      simpleError(
        "vOut",
        "Output voltage must exceed input voltage.",
        "invalid_ratio",
      );
    return { dutyCyclePercent: (1 - vIn / vOut) * 100 };
  },
});
export const runBoostDutyCycle = boostDutyCycleTool.execute;
export default boostDutyCycleTool;
