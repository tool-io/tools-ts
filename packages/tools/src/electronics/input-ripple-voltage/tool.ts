import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InputRippleVoltageInput = {
  readonly capacitanceUf: number;
  readonly dutyFraction: number;
  readonly iOutAmps: number;
  readonly switchingFreqKhz: number;
};

export type InputRippleVoltageOutput = {
  readonly inputRippleV: number;
};

export const inputRippleVoltageExample = {
  input: {
    capacitanceUf: 10,
    dutyFraction: 0.5,
    iOutAmps: 2,
    switchingFreqKhz: 500,
  },
  output: { inputRippleV: 0.1 },
} satisfies ToolExample<InputRippleVoltageInput, InputRippleVoltageOutput>;

export const inputRippleVoltageTool = createSimpleTool({
  calculate: (input) => {
    const iOutAmps = input.iOutAmps as number;
    const dutyFraction = input.dutyFraction as number;
    const capacitanceUf = input.capacitanceUf as number;
    const switchingFreqKhz = input.switchingFreqKhz as number;
    if (!(iOutAmps > 0))
      simpleError(
        "iOutAmps",
        "Output current must be positive.",
        "invalid_current",
      );
    if (!(capacitanceUf > 0))
      simpleError(
        "capacitanceUf",
        "Input capacitance must be positive.",
        "invalid_capacitance",
      );
    if (!(switchingFreqKhz > 0))
      simpleError(
        "switchingFreqKhz",
        "Switching frequency must be positive.",
        "invalid_frequency",
      );
    return {
      inputRippleV:
        (iOutAmps * dutyFraction * (1 - dutyFraction)) /
        (capacitanceUf * 1e-6 * (switchingFreqKhz * 1e3)),
    };
  },
  description:
    "Compute buck converter input ripple voltage as Iout x D x (1 - D) / (C x f).",
  id: "electronics/input-ripple-voltage",
  inputs: [
    { id: "iOutAmps", kind: "number", label: "Output current", unit: "A" },
    {
      default: 0.5,
      id: "dutyFraction",
      kind: "number",
      label: "Duty cycle",
      maximum: 1,
      minimum: 0,
    },
    {
      id: "capacitanceUf",
      kind: "number",
      label: "Input capacitance",
      unit: "uF",
    },
    {
      id: "switchingFreqKhz",
      kind: "number",
      label: "Switching frequency",
      unit: "kHz",
    },
  ],
  outputs: [
    {
      id: "inputRippleV",
      kind: "number",
      label: "Input ripple voltage",
      unit: "V",
    },
  ],
  title: "Input Ripple Voltage",
});
export const runInputRippleVoltage = inputRippleVoltageTool.execute;
export default inputRippleVoltageTool;
