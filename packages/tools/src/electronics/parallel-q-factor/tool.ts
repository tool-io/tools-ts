import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const parallelQFactorExample = {
  input: { cFarads: 1e-9, lHenry: 0.001, rOhms: 8 },
} satisfies ToolExample<{
  readonly cFarads: number;
  readonly lHenry: number;
  readonly rOhms: number;
}>;

export const parallelQFactorTool = createSimpleTool({
  id: "electronics/parallel-q-factor",
  title: "Parallel Q Factor",
  description:
    "Compute the Q factor of a parallel resonant LC circuit from its winding resistance, inductance, and capacitance.",
  inputs: [
    { id: "rOhms", label: "Winding resistance", kind: "number" },
    { id: "lHenry", label: "Inductance", kind: "number" },
    { id: "cFarads", label: "Capacitance", kind: "number" },
  ],
  outputs: [{ id: "qFactorParallel", label: "Q factor", kind: "number" }],
  calculate: (input) => {
    const rOhms = input.rOhms as number;
    const lHenry = input.lHenry as number;
    const cFarads = input.cFarads as number;
    if (rOhms <= 0)
      simpleError("rOhms", "Winding resistance must be greater than zero.");
    if (lHenry <= 0)
      simpleError("lHenry", "Inductance must be greater than zero.");
    if (cFarads <= 0)
      simpleError("cFarads", "Capacitance must be greater than zero.");
    return { qFactorParallel: (1 / rOhms) * Math.sqrt(lHenry / cFarads) };
  },
});
export const runParallelQFactor = parallelQFactorTool.execute;
export default parallelQFactorTool;
