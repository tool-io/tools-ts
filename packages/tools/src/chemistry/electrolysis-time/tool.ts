import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const F_FARADAY = 96485.33212;

export const electrolysisTimeExample = {
  input: { currentAmps: 2, electronCount: 2, molesMetal: 1 },
} satisfies ToolExample<{
  readonly currentAmps: number;
  readonly electronCount: number;
  readonly molesMetal: number;
}>;

export const electrolysisTimeTool = createSimpleTool({
  id: "chemistry/electrolysis-time",
  title: "Electrolysis Time Calculator",
  description:
    "Compute the electrolysis time as moles of metal times electron count times the Faraday constant divided by the current.",
  inputs: [
    { id: "molesMetal", label: "Moles of metal", kind: "number", unit: "mol" },
    {
      id: "electronCount",
      label: "Electrons transferred",
      kind: "integer",
      minimum: 1,
    },
    { id: "currentAmps", label: "Current", kind: "number", unit: "A" },
  ],
  outputs: [
    {
      id: "timeSeconds",
      label: "Electrolysis time",
      kind: "number",
      unit: "s",
    },
  ],
  calculate: (input) => {
    const molesMetal = input.molesMetal as number;
    const currentAmps = input.currentAmps as number;
    if (!(molesMetal > 0))
      simpleError("molesMetal", "Moles of metal must be positive.");
    if (!(currentAmps > 0))
      simpleError("currentAmps", "Current must be positive.");
    return {
      timeSeconds:
        (molesMetal * (input.electronCount as number) * F_FARADAY) /
        currentAmps,
    };
  },
});
export const runElectrolysisTime = electrolysisTimeTool.execute;
export default electrolysisTimeTool;
