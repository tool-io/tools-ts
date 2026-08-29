import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WeakAcidPhInput = {
  readonly concM: number;
  readonly ka: number;
};

export type WeakAcidPhOutput = {
  readonly ph: number;
};

export const weakAcidPhExample = {
  input: { concM: 0.01, ka: 0.0001 },
  output: { ph: 3.021705686457112 },
} satisfies ToolExample<WeakAcidPhInput, WeakAcidPhOutput>;

export const weakAcidPhTool = createSimpleTool({
  id: "chemistry/weak-acid-ph",
  title: "Weak Acid pH",
  description:
    "Compute the ideal pH of a monoprotic weak acid by solving Ka = x²/(C-x), without the small-dissociation approximation.",
  inputs: [
    { id: "concM", label: "Acid concentration", kind: "number", unit: "M" },
    { id: "ka", label: "Ka", kind: "number" },
  ],
  outputs: [{ id: "ph", label: "pH", kind: "number" }],
  calculate: (input) => {
    const concM = input.concM as number;
    const ka = input.ka as number;
    if (concM <= 0)
      simpleError("concM", "Acid concentration must be positive.");
    if (ka <= 0) simpleError("ka", "Ka must be positive.");
    const h = (Math.sqrt(ka * ka + 4 * ka * concM) - ka) / 2;
    return { ph: -Math.log10(h) };
  },
});
export const runWeakAcidPh = weakAcidPhTool.execute;
export default weakAcidPhTool;
