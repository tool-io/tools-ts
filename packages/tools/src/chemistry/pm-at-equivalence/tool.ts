import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PmAtEquivalenceInput = {
  readonly ksp: number;
};

export type PmAtEquivalenceOutput = {
  readonly pM: number;
};

export const pmAtEquivalenceExample = {
  input: { ksp: 1e-12 },
  output: { pM: 6 },
} satisfies ToolExample<PmAtEquivalenceInput, PmAtEquivalenceOutput>;

export const pmAtEquivalenceTool = createSimpleTool({
  id: "chemistry/pm-at-equivalence",
  title: "pM At Equivalence",
  description:
    "Compute pM at the equivalence point of a 1:1 sparingly soluble salt as minus log base ten of the square root of Ksp.",
  inputs: [{ id: "ksp", label: "Solubility product", kind: "number" }],
  outputs: [{ id: "pM", label: "pM at equivalence", kind: "number" }],
  calculate: (input) => {
    const ksp = input.ksp as number;
    if (!(ksp > 0)) simpleError("ksp", "Ksp must be positive.", "invalid_ksp");
    return { pM: -Math.log10(Math.sqrt(ksp)) };
  },
});
export const runPmAtEquivalence = pmAtEquivalenceTool.execute;
export default pmAtEquivalenceTool;
