import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const meltingTempGcExample = {
  input: { sequence: "ACGTACGTACGTACGT" },
} satisfies ToolExample<{ readonly sequence: string }>;

export const meltingTempGcTool = createSimpleTool({
  id: "biology/melting-temp-gc",
  title: "GC Rule Tm",
  description:
    "Estimate DNA melting temperature with the GC rule for sequences longer than 13 bases.",
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
    if (sequence.length < 14)
      simpleError(
        "sequence",
        "GC rule applies to sequences longer than 13 bases.",
        "invalid_length",
      );
    let gcBases = 0;
    for (const base of sequence) if (base === "G" || base === "C") gcBases += 1;
    return {
      meltingTempC: 64.9 + (41 * (gcBases - 16.4)) / sequence.length,
    };
  },
});
export const runMeltingTempGc = meltingTempGcTool.execute;
export default meltingTempGcTool;
