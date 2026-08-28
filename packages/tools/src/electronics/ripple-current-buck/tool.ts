import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RippleCurrentBuckInput = {
  readonly dutyFraction: number;
  readonly inductanceUh: number;
  readonly switchingFreqKhz: number;
  readonly vin: number;
  readonly vout: number;
};

export type RippleCurrentBuckOutput = {
  readonly rippleCurrentA: number;
};

export const rippleCurrentBuckExample = {
  input: {
    dutyFraction: 0.5,
    inductanceUh: 22,
    switchingFreqKhz: 100,
    vin: 12,
    vout: 5,
  },
  output: { rippleCurrentA: 1.590909090909091 },
} satisfies ToolExample<RippleCurrentBuckInput, RippleCurrentBuckOutput>;

export const rippleCurrentBuckTool = createSimpleTool({
  calculate: (input) => {
    const vin = input.vin as number;
    const vout = input.vout as number;
    const dutyFraction = input.dutyFraction as number;
    const inductanceUh = input.inductanceUh as number;
    const switchingFreqKhz = input.switchingFreqKhz as number;
    if (!(vin > 0))
      simpleError("vin", "Input voltage must be positive.", "invalid_voltage");
    if (!(vout > 0))
      simpleError(
        "vout",
        "Output voltage must be positive.",
        "invalid_voltage",
      );
    if (!(inductanceUh > 0))
      simpleError(
        "inductanceUh",
        "Inductance must be positive.",
        "invalid_inductance",
      );
    if (!(switchingFreqKhz > 0))
      simpleError(
        "switchingFreqKhz",
        "Switching frequency must be positive.",
        "invalid_frequency",
      );
    return {
      rippleCurrentA:
        ((vin - vout) * dutyFraction) /
        (inductanceUh * 1e-6 * (switchingFreqKhz * 1e3)),
    };
  },
  description:
    "Compute buck converter inductor peak-to-peak ripple current as (Vin - Vout) x D / (L x f).",
  id: "electronics/ripple-current-buck",
  inputs: [
    { id: "vin", kind: "number", label: "Input voltage", unit: "V" },
    { id: "vout", kind: "number", label: "Output voltage", unit: "V" },
    {
      default: 0.5,
      id: "dutyFraction",
      kind: "number",
      label: "Duty cycle",
      maximum: 1,
      minimum: 0,
    },
    { id: "inductanceUh", kind: "number", label: "Inductance", unit: "uH" },
    {
      id: "switchingFreqKhz",
      kind: "number",
      label: "Switching frequency",
      unit: "kHz",
    },
  ],
  outputs: [
    {
      id: "rippleCurrentA",
      kind: "number",
      label: "Ripple current",
      unit: "A",
    },
  ],
  title: "Buck Ripple Current",
});
export const runRippleCurrentBuck = rippleCurrentBuckTool.execute;
export default rippleCurrentBuckTool;
