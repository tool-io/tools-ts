import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const capacitiveSusceptanceExample = {
  input: { capacitanceF: 0.00001, frequencyHz: 50 },
} satisfies ToolExample<{
  readonly capacitanceF: number;
  readonly frequencyHz: number;
}>;

export const capacitiveSusceptanceTool = createSimpleTool({
  id: "electronics/susceptance-capacitive",
  title: "Capacitive Susceptance",
  description:
    "Calculate the capacitive susceptance of a capacitor at a given frequency.",
  inputs: [
    { id: "frequencyHz", label: "Frequency", kind: "number", unit: "Hz" },
    { id: "capacitanceF", label: "Capacitance", kind: "number", unit: "F" },
  ],
  outputs: [
    {
      id: "susceptanceSiemens",
      label: "Capacitive susceptance",
      kind: "number",
      unit: "S",
    },
  ],
  calculate: (input) => {
    const frequencyHz = input.frequencyHz as number;
    const capacitanceF = input.capacitanceF as number;
    if (frequencyHz <= 0)
      simpleError("frequencyHz", "Frequency must be positive.");
    if (capacitanceF <= 0)
      simpleError("capacitanceF", "Capacitance must be positive.");
    return { susceptanceSiemens: 2 * Math.PI * frequencyHz * capacitanceF };
  },
});
export const runCapacitiveSusceptance = capacitiveSusceptanceTool.execute;
export default capacitiveSusceptanceTool;
