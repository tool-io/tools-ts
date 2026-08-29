import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { frequencyHz: 1000, capacitanceF: 0.000001 },
  output: {
    reactanceOhm: -159.15494309189535,
    magnitudeOhm: 159.15494309189535,
  },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/capacitor-impedance-at-frequency",
  title: "Ideal Capacitor Impedance",
  description:
    "Calculate ideal capacitive reactance Xc=−1/(2πfC) and its magnitude in ohms. ESR, ESL, leakage, and self-resonance are not included.",
  inputs: [
    {
      id: "frequencyHz",
      kind: "number",
      label: "Frequency (Hz)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "capacitanceF",
      kind: "number",
      label: "Capacitance (F)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "reactanceOhm", kind: "number", label: "Reactance ohm" },
    { id: "magnitudeOhm", kind: "number", label: "Magnitude ohm" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      reactanceOhm: -1 / (2 * Math.PI * i.frequencyHz * i.capacitanceF),
      magnitudeOhm: 1 / (2 * Math.PI * i.frequencyHz * i.capacitanceF),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type CapacitorImpedanceAtFrequencyInput = Readonly<typeof example.input>;
export type CapacitorImpedanceAtFrequencyOutput = Readonly<
  typeof example.output
>;
export const capacitorImpedanceAtFrequencyTool = tool;
export const runCapacitorImpedanceAtFrequency = tool.execute;
export default tool;
