import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const parallelResonantImpedanceExample = {
  input: { cFarads: 1e-9, lHenry: 0.001, windingResistanceOhms: 8 },
} satisfies ToolExample<{
  readonly cFarads: number;
  readonly lHenry: number;
  readonly windingResistanceOhms: number;
}>;

export const parallelResonantImpedanceTool = createSimpleTool({
  id: "electronics/parallel-resonant-impedance",
  title: "Parallel Resonant Impedance",
  description:
    "Compute the dynamic impedance in ohms of a parallel resonant LC circuit at resonance.",
  inputs: [
    { id: "lHenry", label: "Inductance", kind: "number" },
    { id: "cFarads", label: "Capacitance", kind: "number" },
    {
      id: "windingResistanceOhms",
      label: "Winding resistance",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "parallelImpedanceOhms",
      label: "Parallel impedance",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const lHenry = input.lHenry as number;
    const cFarads = input.cFarads as number;
    const windingResistanceOhms = input.windingResistanceOhms as number;
    if (lHenry <= 0)
      simpleError("lHenry", "Inductance must be greater than zero.");
    if (cFarads <= 0)
      simpleError("cFarads", "Capacitance must be greater than zero.");
    if (windingResistanceOhms <= 0)
      simpleError(
        "windingResistanceOhms",
        "Winding resistance must be greater than zero.",
      );
    return {
      parallelImpedanceOhms: lHenry / (cFarads * windingResistanceOhms),
    };
  },
});
export const runParallelResonantImpedance =
  parallelResonantImpedanceTool.execute;
export default parallelResonantImpedanceTool;
