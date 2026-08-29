import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WeakBasePhInput = {
  readonly concM: number;
  readonly kb: number;
};

export type WeakBasePhOutput = {
  readonly ph: number;
};

export const weakBasePhExample = {
  input: { concM: 0.1, kb: 1.8e-5 },
  output: { ph: 11.124722938449864 },
} satisfies ToolExample<WeakBasePhInput, WeakBasePhOutput>;

export const weakBasePhTool = createSimpleTool({
  id: "chemistry/weak-base-ph",
  title: "Weak Base pH",
  description:
    "Compute the ideal pH of a weak base by solving Kb = x²/(C-x), then converting pOH to pH at 25 °C.",
  inputs: [
    { id: "concM", label: "Base concentration", kind: "number", unit: "M" },
    { id: "kb", label: "Kb", kind: "number" },
  ],
  outputs: [{ id: "ph", label: "pH", kind: "number" }],
  calculate: (input) => {
    const concM = input.concM as number;
    const kb = input.kb as number;
    if (concM <= 0)
      simpleError("concM", "Base concentration must be positive.");
    if (kb <= 0) simpleError("kb", "Kb must be positive.");
    const oh = (Math.sqrt(kb * kb + 4 * kb * concM) - kb) / 2;
    return { ph: 14 + Math.log10(oh) };
  },
});
export const runWeakBasePh = weakBasePhTool.execute;
export default weakBasePhTool;
