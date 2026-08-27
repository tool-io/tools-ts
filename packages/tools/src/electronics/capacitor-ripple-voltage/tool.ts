import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapacitorRippleVoltageInput = {
  readonly rippleCurrentA: number;
  readonly frequencyHz: number;
  readonly capacitanceF: number;
};

export type CapacitorRippleVoltageOutput = {
  readonly rippleVoltageV: number;
};

export const capacitorRippleVoltageExample = {
  input: { rippleCurrentA: 1, frequencyHz: 1000000, capacitanceF: 0.000001 },
  output: { rippleVoltageV: 0.5 },
} satisfies ToolExample<
  CapacitorRippleVoltageInput,
  CapacitorRippleVoltageOutput
>;

export const capacitorRippleVoltageTool = createSimpleTool({
  id: "electronics/capacitor-ripple-voltage",
  title: "Ripple Voltage",
  description:
    "Compute capacitor ripple voltage as ripple current divided by twice the product of frequency and capacitance.",
  inputs: [
    {
      id: "rippleCurrentA",
      label: "Ripple current",
      kind: "number",
      unit: "A",
    },
    { id: "frequencyHz", label: "Frequency", kind: "number", unit: "Hz" },
    { id: "capacitanceF", label: "Capacitance", kind: "number", unit: "F" },
  ],
  outputs: [
    {
      id: "rippleVoltageV",
      label: "Ripple voltage",
      kind: "number",
      unit: "V",
    },
  ],
  calculate: (input) => {
    const rippleCurrentA = input.rippleCurrentA as number;
    const frequencyHz = input.frequencyHz as number;
    const capacitanceF = input.capacitanceF as number;
    if (!(frequencyHz > 0))
      simpleError(
        "frequencyHz",
        "Frequency must be positive.",
        "invalid_frequency",
      );
    if (!(capacitanceF > 0))
      simpleError(
        "capacitanceF",
        "Capacitance must be positive.",
        "invalid_capacitance",
      );
    if (!(rippleCurrentA >= 0))
      simpleError(
        "rippleCurrentA",
        "Ripple current must not be negative.",
        "invalid_current",
      );
    return {
      rippleVoltageV: rippleCurrentA / (2 * frequencyHz * capacitanceF),
    };
  },
});
export const runCapacitorRippleVoltage = capacitorRippleVoltageTool.execute;
export default capacitorRippleVoltageTool;
