import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const ne555AstableFrequencyExample = {
  input: { capacitanceF: 0.000001, r1Ohms: 1000, r2Ohms: 2000 },
  output: { frequencyHz: 288 },
} satisfies ToolExample<
  {
    readonly capacitanceF: number;
    readonly r1Ohms: number;
    readonly r2Ohms: number;
  },
  { readonly frequencyHz: number }
>;

export const ne555AstableFrequencyTool = createSimpleTool({
  calculate: (input) => {
    const r1 = input.r1Ohms as number;
    const r2 = input.r2Ohms as number;
    const c = input.capacitanceF as number;
    if (!(r1 > 0))
      simpleError("r1Ohms", "R1 must be positive.", "invalid_resistance");
    if (!(r2 > 0))
      simpleError("r2Ohms", "R2 must be positive.", "invalid_resistance");
    if (!(c > 0))
      simpleError(
        "capacitanceF",
        "Capacitance must be positive.",
        "invalid_capacitance",
      );
    return { frequencyHz: 1.44 / ((r1 + 2 * r2) * c) };
  },
  description:
    "Compute the astable oscillation frequency of an NE555 timer from R1, R2 and the timing capacitor.",
  id: "electronics/ne555-astable-frequency",
  inputs: [
    { id: "r1Ohms", kind: "number", label: "R1", unit: "Ω" },
    { id: "r2Ohms", kind: "number", label: "R2", unit: "Ω" },
    {
      id: "capacitanceF",
      kind: "number",
      label: "Timing capacitor",
      unit: "F",
    },
  ],
  outputs: [
    { id: "frequencyHz", kind: "number", label: "Frequency", unit: "Hz" },
  ],
  title: "NE555 Astable Frequency",
});
export const runNe555AstableFrequency = ne555AstableFrequencyTool.execute;
export default ne555AstableFrequencyTool;
