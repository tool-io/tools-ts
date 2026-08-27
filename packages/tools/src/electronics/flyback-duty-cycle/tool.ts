import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlybackDutyCycleInput = {
  readonly vIn: number;
  readonly vOut: number;
  readonly turnsRatioNpNs: number;
};

export type FlybackDutyCycleOutput = {
  readonly flybackDutyCyclePercent: number;
};

export const flybackDutyCycleExample = {
  input: { vIn: 100, vOut: 12, turnsRatioNpNs: 10 },
  output: { flybackDutyCyclePercent: 54.54545454545454 },
} satisfies ToolExample<FlybackDutyCycleInput, FlybackDutyCycleOutput>;

export const calculateFlybackDutyCycle = (
  input: FlybackDutyCycleInput,
): FlybackDutyCycleOutput => {
  if (!(input.vIn > 0))
    simpleError("vIn", "Input voltage must be positive.", "invalid_v_in");
  if (!(input.vOut > 0))
    simpleError("vOut", "Output voltage must be positive.", "invalid_v_out");
  if (!(input.turnsRatioNpNs > 0))
    simpleError(
      "turnsRatioNpNs",
      "Turns ratio must be positive.",
      "invalid_turns_ratio_np_ns",
    );
  const vOutTurnsScaled = input.vOut * input.turnsRatioNpNs;
  return {
    flybackDutyCyclePercent:
      (vOutTurnsScaled / (vOutTurnsScaled + input.vIn)) * 100,
  };
};

export const flybackDutyCycleTool = createSimpleTool({
  calculate: (input) =>
    calculateFlybackDutyCycle(input as unknown as FlybackDutyCycleInput),
  description:
    "Compute the flyback converter duty cycle percent as (Vout x Np/Ns) / (Vout x Np/Ns + Vin) x 100.",
  id: "electronics/flyback-duty-cycle",
  inputs: [
    { id: "vIn", kind: "number", label: "Input voltage", unit: "V" },
    { id: "vOut", kind: "number", label: "Output voltage", unit: "V" },
    {
      id: "turnsRatioNpNs",
      kind: "number",
      label: "Primary-to-secondary turns ratio",
    },
  ],
  outputs: [
    {
      id: "flybackDutyCyclePercent",
      kind: "number",
      label: "Duty cycle",
      unit: "%",
    },
  ],
  title: "Flyback Duty",
});
export const runFlybackDutyCycle = flybackDutyCycleTool.execute;
export default flybackDutyCycleTool;
