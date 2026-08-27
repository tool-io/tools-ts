import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const complements: Record<string, string> = {
  A: "T",
  C: "G",
  G: "C",
  T: "A",
};

export const primerHairpinCheckExample = {
  input: { sequence: "ACGTTTTACGT" },
} satisfies ToolExample<{ readonly sequence: string }>;

export const primerHairpinCheckTool = createSimpleTool({
  id: "biology/primer-hairpin-check",
  title: "Primer Hairpin Risk",
  description:
    "Heuristic primer-hairpin screen that looks for non-overlapping reverse-complementary stems of at least four bases separated by a loop of at least three bases.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    { id: "hairpinRisk", label: "Hairpin risk", kind: "boolean" },
    {
      id: "longestMatch",
      label: "Longest complementary match",
      kind: "integer",
    },
  ],
  calculate: (input) => {
    const sequence = input.sequence as string;
    if (!/^[ACGT]+$/.test(sequence))
      simpleError(
        "sequence",
        "Sequence must contain only uppercase A, C, G and T.",
        "invalid_sequence",
      );
    if (sequence.length < 8)
      simpleError(
        "sequence",
        "Sequence must be at least 8 bases.",
        "invalid_length",
      );
    const reverseComplement = (window: string): string =>
      [...window]
        .map((base) => complements[base])
        .reverse()
        .join("");
    const minimumLoopLength = 3;
    const longestPossibleStem = Math.floor(
      (sequence.length - minimumLoopLength) / 2,
    );
    for (let k = longestPossibleStem; k >= 4; k -= 1) {
      for (
        let left = 0;
        left + 2 * k + minimumLoopLength <= sequence.length;
        left += 1
      ) {
        const target = reverseComplement(sequence.slice(left, left + k));
        for (
          let right = left + k + minimumLoopLength;
          right + k <= sequence.length;
          right += 1
        ) {
          if (sequence.slice(right, right + k) === target)
            return { hairpinRisk: true, longestMatch: k };
        }
      }
    }
    return { hairpinRisk: false, longestMatch: 0 };
  },
});
export const runPrimerHairpinCheck = primerHairpinCheckTool.execute;
export default primerHairpinCheckTool;
