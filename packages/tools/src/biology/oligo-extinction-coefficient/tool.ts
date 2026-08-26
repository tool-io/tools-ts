import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const oligoExtinctionCoefficientExample = {
  input: { sequence: "GATTACA" },
} satisfies ToolExample<{ readonly sequence: string }>;

export const oligoExtinctionCoefficientTool = createSimpleTool({
  id: "biology/oligo-extinction-coefficient",
  title: "Oligo Extinction Coefficient",
  description:
    "Estimate the molar extinction coefficient of an oligonucleotide from base composition using nearest-neighbor-less base constants.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    {
      id: "extinctionCoefficient",
      label: "Extinction coefficient",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const sequence = input.sequence as string;
    if (sequence === "")
      simpleError("sequence", "Sequence must not be empty.", "empty_sequence");
    if (!/^[ACGT]+$/.test(sequence))
      simpleError(
        "sequence",
        "Sequence must contain only uppercase A, C, G and T.",
        "invalid_sequence",
      );
    let countA = 0;
    let countC = 0;
    let countG = 0;
    let countT = 0;
    for (const base of sequence) {
      if (base === "A") countA += 1;
      else if (base === "C") countC += 1;
      else if (base === "G") countG += 1;
      else countT += 1;
    }
    return {
      extinctionCoefficient:
        countA * 15400 + countC * 7400 + countG * 11500 + countT * 8700,
    };
  },
});
export const runOligoExtinctionCoefficient =
  oligoExtinctionCoefficientTool.execute;
export default oligoExtinctionCoefficientTool;
