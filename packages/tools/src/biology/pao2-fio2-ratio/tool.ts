import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const pao2Fio2RatioExample = {
  input: { fiO2Fraction: 0.4, pao2Mmhg: 95 },
  output: { pfRatio: 237.5 },
} satisfies ToolExample<
  { readonly fiO2Fraction: number; readonly pao2Mmhg: number },
  { readonly pfRatio: number }
>;

export const pao2Fio2RatioTool = createSimpleTool({
  id: "biology/pao2-fio2-ratio",
  title: "P/F Ratio",
  description:
    "Compute the PaO2/FiO2 ratio used to grade oxygenation impairment; the inspired fraction must lie strictly between 0 and 1.",
  inputs: [
    { id: "pao2Mmhg", label: "Arterial O2", kind: "number", unit: "mmHg" },
    {
      id: "fiO2Fraction",
      label: "Inspired oxygen fraction",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [{ id: "pfRatio", label: "P/F ratio", kind: "number" }],
  calculate: (input) => {
    const pao2Mmhg = input.pao2Mmhg as number;
    const fiO2Fraction = input.fiO2Fraction as number;
    if (pao2Mmhg <= 0)
      simpleError("pao2Mmhg", "Arterial O2 must be greater than zero.");
    if (fiO2Fraction <= 0 || fiO2Fraction >= 1)
      simpleError(
        "fiO2Fraction",
        "Inspired oxygen fraction must be strictly between 0 and 1.",
      );
    return { pfRatio: pao2Mmhg / fiO2Fraction };
  },
});
export const runPao2Fio2Ratio = pao2Fio2RatioTool.execute;
export default pao2Fio2RatioTool;
