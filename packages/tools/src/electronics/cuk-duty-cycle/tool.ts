import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CukDutyCycleInput = {
  readonly vIn: number;
  readonly vOut: number;
};

export type CukDutyCycleOutput = {
  readonly cukDutyCyclePercent: number;
};

export const cukDutyCycleExample = {
  input: { vIn: 12, vOut: -24 },
  output: { cukDutyCyclePercent: 66.66666666666666 },
} satisfies ToolExample<CukDutyCycleInput, CukDutyCycleOutput>;

export const calculateCukDutyCycle = (
  input: CukDutyCycleInput,
): CukDutyCycleOutput => {
  if (!(input.vIn > 0))
    simpleError("vIn", "Input voltage must be positive.", "invalid_v_in");
  if (input.vOut === 0)
    simpleError(
      "vOut",
      "Output voltage magnitude must be nonzero.",
      "zero_output",
    );
  const vOutAbs = Math.abs(input.vOut);
  return { cukDutyCyclePercent: (vOutAbs / (vOutAbs + input.vIn)) * 100 };
};

export const cukDutyCycleTool = createSimpleTool({
  calculate: (input) =>
    calculateCukDutyCycle(input as unknown as CukDutyCycleInput),
  description:
    "Compute the inverting Ćuk converter duty cycle percent as |Vout| / (|Vout| + Vin) x 100 using magnitudes.",
  id: "electronics/cuk-duty-cycle",
  inputs: [
    { id: "vIn", kind: "number", label: "Input voltage", unit: "V" },
    { id: "vOut", kind: "number", label: "Output voltage", unit: "V" },
  ],
  outputs: [
    {
      id: "cukDutyCyclePercent",
      kind: "number",
      label: "Duty cycle",
      unit: "%",
    },
  ],
  title: "Ćuk Duty Cycle",
});
export const runCukDutyCycle = cukDutyCycleTool.execute;
export default cukDutyCycleTool;
