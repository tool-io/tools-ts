import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StrongAcidPhInput = {
  readonly acidConcentrationM: number;
};

export type StrongAcidPhOutput = {
  readonly ph: number;
};

export const strongAcidPhExample = {
  input: { acidConcentrationM: 0.01 },
  output: { ph: 2 },
} satisfies ToolExample<StrongAcidPhInput, StrongAcidPhOutput>;

export const strongAcidPhTool = createSimpleTool({
  id: "chemistry/strong-acid-ph",
  title: "Strong Acid pH",
  description:
    "Compute the pH of a strong acid solution from its concentration.",
  inputs: [
    {
      id: "acidConcentrationM",
      label: "Acid concentration",
      kind: "number",
      unit: "M",
    },
  ],
  outputs: [{ id: "ph", label: "pH", kind: "number" }],
  calculate: (input) => {
    const acidConcentrationM = input.acidConcentrationM as number;
    if (acidConcentrationM <= 0)
      simpleError("acidConcentrationM", "Acid concentration must be positive.");
    return { ph: -Math.log10(acidConcentrationM) };
  },
});
export const runStrongAcidPh = strongAcidPhTool.execute;
export default strongAcidPhTool;
