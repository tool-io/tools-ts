import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StrongBasePhInput = {
  readonly baseConcM: number;
};

export type StrongBasePhOutput = {
  readonly ph: number;
};

export const strongBasePhExample = {
  input: { baseConcM: 0.01 },
  output: { ph: 12 },
} satisfies ToolExample<StrongBasePhInput, StrongBasePhOutput>;

export const strongBasePhTool = createSimpleTool({
  id: "chemistry/strong-base-ph",
  title: "Strong Base pH",
  description:
    "Compute the pH of a strong base solution from its concentration.",
  inputs: [
    {
      id: "baseConcM",
      label: "Base concentration",
      kind: "number",
      unit: "M",
    },
  ],
  outputs: [{ id: "ph", label: "pH", kind: "number" }],
  calculate: (input) => {
    const baseConcM = input.baseConcM as number;
    if (baseConcM <= 0)
      simpleError("baseConcM", "Base concentration must be positive.");
    const poh = -Math.log10(baseConcM);
    return { ph: 14 - poh };
  },
});
export const runStrongBasePh = strongBasePhTool.execute;
export default strongBasePhTool;
