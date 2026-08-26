import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const meltingTempWallaceExample = {
  input: { sequence: "ATCGCGTA" },
} satisfies ToolExample<{ readonly sequence: string }>;

export const meltingTempWallaceTool = createSimpleTool({
  id: "biology/melting-temp-wallace",
  title: "Wallace Tm",
  description:
    "Estimate DNA melting temperature with the Wallace rule for sequences up to 14 bases.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    {
      id: "meltingTempC",
      label: "Melting temperature",
      kind: "number",
      unit: "°C",
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
    if (sequence.length > 14)
      simpleError(
        "sequence",
        "Wallace rule applies to sequences of at most 14 bases.",
        "invalid_length",
      );
    let atBases = 0;
    let gcBases = 0;
    for (const base of sequence) {
      if (base === "A" || base === "T") atBases += 1;
      if (base === "G" || base === "C") gcBases += 1;
    }
    return { meltingTempC: 2 * atBases + 4 * gcBases };
  },
});
export const runMeltingTempWallace = meltingTempWallaceTool.execute;
export default meltingTempWallaceTool;
