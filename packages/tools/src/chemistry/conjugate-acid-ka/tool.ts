import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const conjugateAcidKaExample = {
  input: { conjugateBaseKb: 1.8e-5 },
} satisfies ToolExample<{
  readonly conjugateBaseKb: number;
}>;

export const conjugateAcidKaTool = createSimpleTool({
  id: "chemistry/conjugate-acid-ka",
  title: "Conjugate Acid Ka",
  description:
    "Compute the Ka of a conjugate acid from the Kb of its conjugate base as Kw divided by Kb.",
  inputs: [
    { id: "conjugateBaseKb", label: "Conjugate base Kb", kind: "number" },
  ],
  outputs: [
    { id: "conjugateAcidKa", label: "Conjugate acid Ka", kind: "number" },
  ],
  calculate: (input) => {
    const conjugateBaseKb = input.conjugateBaseKb as number;
    if (!(conjugateBaseKb > 0))
      simpleError("conjugateBaseKb", "Conjugate base Kb must be positive.");
    return { conjugateAcidKa: 1e-14 / conjugateBaseKb };
  },
});
export const runConjugateAcidKa = conjugateAcidKaTool.execute;
export default conjugateAcidKaTool;
