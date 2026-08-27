import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const primerHairpinTmExample = {
  input: { sequence: "ACGTTTTACGT" },
  output: { hairpinTempC: 12, stemLength: 4 },
} satisfies ToolExample<
  { readonly sequence: string },
  { readonly hairpinTempC: number; readonly stemLength: number }
>;

export const primerHairpinTmTool = createSimpleTool({
  id: "biology/primer-hairpin-tm",
  title: "Hairpin Tm Estimate",
  description:
    "Estimate primer hairpin stability by searching the sequence against its own reverse complement for the longest internal inverted-repeat stem of three to eight non-overlapping bases and applying the Wallace rule of four degrees per GC pair and two per AT pair.",
  inputs: [
    {
      description: "Primer sequence using only uppercase A, C, G and T.",
      id: "sequence",
      label: "Sequence",
      kind: "string",
    },
  ],
  outputs: [
    {
      description:
        "Length in bases of the longest non-overlapping internal inverted-repeat stem, or zero when no hairpin stem exists.",
      id: "stemLength",
      label: "Stem length",
      kind: "integer",
    },
    {
      description:
        "Wallace-rule melting temperature of the stem in degrees Celsius, or zero without a stem.",
      id: "hairpinTempC",
      label: "Hairpin temperature",
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
    const complements: Record<string, string> = {
      A: "T",
      C: "G",
      G: "C",
      T: "A",
    };
    const bases = [...sequence];
    const length = bases.length;
    const minimumLoopLength = 3;
    const maxK = Math.min(8, Math.floor((length - minimumLoopLength) / 2));
    let stemBases: readonly string[] | null = null;
    for (let k = maxK; k >= 3 && stemBases === null; k -= 1) {
      for (let i = 0; i + k <= length && stemBases === null; i += 1) {
        const arm = bases.slice(i, i + k);
        const target = arm.map((base) => complements[base]).reverse();
        for (let j = i + k + minimumLoopLength; j + k <= length; j += 1) {
          const other = bases.slice(j, j + k);
          if (other.every((base, index) => base === target[index])) {
            stemBases = arm;
            break;
          }
        }
      }
    }
    const gcPairs = (stemBases ?? []).filter(
      (base) => base === "G" || base === "C",
    ).length;
    return {
      stemLength: stemBases === null ? 0 : stemBases.length,
      hairpinTempC:
        stemBases === null ? 0 : 4 * gcPairs + 2 * (stemBases.length - gcPairs),
    };
  },
});
export const runPrimerHairpinTm = primerHairpinTmTool.execute;
export default primerHairpinTmTool;
