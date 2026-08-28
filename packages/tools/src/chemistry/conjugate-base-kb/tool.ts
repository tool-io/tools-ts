import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const conjugateBaseKbExample = {
  input: { conjugateAcidKa: 1.8e-5 },
} satisfies ToolExample<{
  readonly conjugateAcidKa: number;
}>;

export const conjugateBaseKbTool = createSimpleTool({
  id: "chemistry/conjugate-base-kb",
  title: "Conjugate Base Kb",
  description:
    "Compute the Kb of a conjugate base from the Ka of its conjugate acid as Kw divided by Ka.",
  inputs: [
    { id: "conjugateAcidKa", label: "Conjugate acid Ka", kind: "number" },
  ],
  outputs: [
    { id: "conjugateBaseKb", label: "Conjugate base Kb", kind: "number" },
  ],
  calculate: (input) => {
    const conjugateAcidKa = input.conjugateAcidKa as number;
    if (!(conjugateAcidKa > 0))
      simpleError("conjugateAcidKa", "Conjugate acid Ka must be positive.");
    return { conjugateBaseKb: 1e-14 / conjugateAcidKa };
  },
});
export const runConjugateBaseKb = conjugateBaseKbTool.execute;
export default conjugateBaseKbTool;
