import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HendersonHasselbalchInput = {
  readonly acidM: number;
  readonly conjugateBaseM: number;
  readonly pKa: number;
};

export type HendersonHasselbalchOutput = {
  readonly ph: number;
};

export const hendersonHasselbalchExample = {
  input: { acidM: 0.05, conjugateBaseM: 0.5, pKa: 4.76 },
  output: { ph: 5.76 },
} satisfies ToolExample<HendersonHasselbalchInput, HendersonHasselbalchOutput>;

export const hendersonHasselbalchTool = createSimpleTool({
  id: "chemistry/henderson-hasselbalch",
  title: "Henderson-Hasselbalch pH",
  description:
    "Estimate buffer pH from pKa and the ratio of conjugate base to acid concentrations.",
  inputs: [
    { id: "acidM", label: "Acid concentration", kind: "number", unit: "M" },
    {
      id: "conjugateBaseM",
      label: "Conjugate base concentration",
      kind: "number",
      unit: "M",
    },
    { id: "pKa", label: "pKa", kind: "number" },
  ],
  outputs: [{ id: "ph", label: "pH", kind: "number" }],
  calculate: (input) => {
    const acidM = input.acidM as number;
    const conjugateBaseM = input.conjugateBaseM as number;
    const pKa = input.pKa as number;
    if (acidM <= 0)
      simpleError("acidM", "Acid concentration must be positive.");
    if (conjugateBaseM <= 0)
      simpleError(
        "conjugateBaseM",
        "Conjugate base concentration must be positive.",
      );
    return { ph: pKa + Math.log10(conjugateBaseM / acidM) };
  },
});
export const runHendersonHasselbalch = hendersonHasselbalchTool.execute;
export default hendersonHasselbalchTool;
