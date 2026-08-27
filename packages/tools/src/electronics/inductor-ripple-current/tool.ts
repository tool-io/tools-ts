import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InductorRippleCurrentInput = {
  readonly vin: number;
  readonly vout: number;
  readonly dutyFraction: number;
  readonly lHenry: number;
  readonly switchingFrequencyHz: number;
};

export type InductorRippleCurrentOutput = {
  readonly rippleCurrentA: number;
};

export const inductorRippleCurrentExample = {
  input: {
    vin: 12,
    vout: 5,
    dutyFraction: 0.5,
    lHenry: 0.001,
    switchingFrequencyHz: 100000,
  },
  output: { rippleCurrentA: 0.035 },
} satisfies ToolExample<
  InductorRippleCurrentInput,
  InductorRippleCurrentOutput
>;

export const inductorRippleCurrentTool = createSimpleTool({
  id: "electronics/inductor-ripple-current",
  title: "Inductor Ripple Current",
  description:
    "Compute switching converter inductor ripple current as (Vin - Vout) x duty / (L x f).",
  inputs: [
    { id: "vin", label: "Input voltage", kind: "number", unit: "V" },
    { id: "vout", label: "Output voltage", kind: "number", unit: "V" },
    {
      default: 0.5,
      id: "dutyFraction",
      label: "Duty cycle",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    { id: "lHenry", label: "Inductance", kind: "number", unit: "H" },
    {
      id: "switchingFrequencyHz",
      label: "Switching frequency",
      kind: "number",
      unit: "Hz",
    },
  ],
  outputs: [
    {
      id: "rippleCurrentA",
      label: "Ripple current",
      kind: "number",
      unit: "A",
    },
  ],
  calculate: (input) => {
    const vin = input.vin as number;
    const vout = input.vout as number;
    const dutyFraction = input.dutyFraction as number;
    const lHenry = input.lHenry as number;
    const switchingFrequencyHz = input.switchingFrequencyHz as number;
    if (!(lHenry > 0))
      simpleError(
        "lHenry",
        "Inductance must be positive.",
        "invalid_inductance",
      );
    if (!(switchingFrequencyHz > 0))
      simpleError(
        "switchingFrequencyHz",
        "Switching frequency must be positive.",
        "invalid_frequency",
      );
    return {
      rippleCurrentA:
        ((vin - vout) * dutyFraction) / (lHenry * switchingFrequencyHz),
    };
  },
});
export const runInductorRippleCurrent = inductorRippleCurrentTool.execute;
export default inductorRippleCurrentTool;
