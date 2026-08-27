import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const decouplingCapacitorImpedanceExample = {
  input: { capacitanceUf: 1, frequencyMHz: 1 },
} satisfies ToolExample<{
  readonly capacitanceUf: number;
  readonly frequencyMHz: number;
}>;

export const decouplingCapacitorImpedanceTool = createSimpleTool({
  id: "electronics/decoupling-capacitor-impedance",
  title: "Decap Impedance",
  description:
    "Compute the ideal impedance magnitude of a decoupling capacitor as Z = 1/(2 x pi x f x C), expressed in milliohms.",
  inputs: [
    {
      id: "frequencyMHz",
      label: "Frequency",
      kind: "number",
      unit: "MHz",
    },
    {
      id: "capacitanceUf",
      label: "Capacitance",
      kind: "number",
      unit: "\u00b5F",
    },
  ],
  outputs: [
    {
      id: "impedanceMilliohms",
      label: "Impedance",
      kind: "number",
      unit: "m\u03a9",
    },
  ],
  calculate: (input) => {
    const frequencyMHz = input.frequencyMHz as number;
    const capacitanceUf = input.capacitanceUf as number;
    if (!(frequencyMHz > 0))
      simpleError("frequencyMHz", "Frequency must be positive.");
    if (!(capacitanceUf > 0))
      simpleError("capacitanceUf", "Capacitance must be positive.");
    return {
      impedanceMilliohms: 1000 / (2 * Math.PI * frequencyMHz * capacitanceUf),
    };
  },
});
export const runDecouplingCapacitorImpedance =
  decouplingCapacitorImpedanceTool.execute;
export default decouplingCapacitorImpedanceTool;
