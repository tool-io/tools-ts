import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BuckBoostDutyCycleInput = {
  readonly vIn: number;
  readonly vOut: number;
};

export type BuckBoostDutyCycleOutput = {
  readonly dutyCyclePercent: number;
};

export const buckBoostDutyCycleExample = {
  input: { vIn: 12, vOut: -5 },
  output: { dutyCyclePercent: 29.411764705882355 },
} satisfies ToolExample<BuckBoostDutyCycleInput, BuckBoostDutyCycleOutput>;

export const calculateBuckBoostDutyCycle = (
  input: BuckBoostDutyCycleInput,
): BuckBoostDutyCycleOutput => {
  if (!(input.vIn > 0))
    simpleError("vIn", "Input voltage must be positive.", "invalid_v_in");
  if (input.vOut === 0)
    simpleError(
      "vOut",
      "Output voltage magnitude must be nonzero.",
      "zero_output",
    );
  const vOutAbs = Math.abs(input.vOut);
  return { dutyCyclePercent: (vOutAbs / (input.vIn + vOutAbs)) * 100 };
};

export const buckBoostDutyCycleTool = createSimpleTool({
  calculate: (input) =>
    calculateBuckBoostDutyCycle(input as unknown as BuckBoostDutyCycleInput),
  description:
    "Compute the inverting buck-boost duty cycle percent as |Vout| / (Vin + |Vout|) x 100.",
  id: "electronics/buck-boost-duty-cycle",
  inputs: [
    { id: "vIn", kind: "number", label: "Input voltage", unit: "V" },
    { id: "vOut", kind: "number", label: "Output voltage", unit: "V" },
  ],
  outputs: [
    { id: "dutyCyclePercent", kind: "number", label: "Duty cycle", unit: "%" },
  ],
  title: "Buck-Boost Duty",
});
export const runBuckBoostDutyCycle = buckBoostDutyCycleTool.execute;
export default buckBoostDutyCycleTool;
