import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const primerDimerCheckExample = {
  input: { primerA: "TTACGT", primerB: "GGACGT" },
} satisfies ToolExample<{
  readonly primerA: string;
  readonly primerB: string;
}>;

export const primerDimerCheckTool = createSimpleTool({
  id: "biology/primer-dimer-check",
  title: "Primer Dimer Risk",
  description:
    "Heuristic primer-dimer screen that aligns one primer with the reverse complement of the other and flags four or more contiguous complementary bases.",
  inputs: [
    { id: "primerA", label: "Primer A", kind: "string" },
    { id: "primerB", label: "Primer B", kind: "string" },
  ],
  outputs: [
    {
      id: "maxComplementaryOverlap",
      label: "Max complementary overlap",
      kind: "integer",
    },
    { id: "dimerRisk", label: "Dimer risk", kind: "boolean" },
  ],
  calculate: (input) => {
    const primerA = (input.primerA as string).toUpperCase();
    const primerB = (input.primerB as string).toUpperCase();
    if (!/^[ACGT]+$/.test(primerA))
      simpleError(
        "primerA",
        "Primer must contain only uppercase A, C, G and T.",
        "invalid_sequence",
      );
    if (!/^[ACGT]+$/.test(primerB))
      simpleError(
        "primerB",
        "Primer must contain only uppercase A, C, G and T.",
        "invalid_sequence",
      );
    const complements: Record<string, string> = {
      A: "T",
      C: "G",
      G: "C",
      T: "A",
    };
    const reverseComplementB = [...primerB]
      .map((base) => complements[base])
      .reverse()
      .join("");
    let maxComplementaryOverlap = 0;
    for (
      let offset = -reverseComplementB.length + 1;
      offset < primerA.length;
      offset += 1
    ) {
      let run = 0;
      for (
        let indexA = Math.max(0, offset);
        indexA < Math.min(primerA.length, offset + reverseComplementB.length);
        indexA += 1
      ) {
        const indexB = indexA - offset;
        if (primerA[indexA] === reverseComplementB[indexB]) {
          run += 1;
          maxComplementaryOverlap = Math.max(maxComplementaryOverlap, run);
        } else {
          run = 0;
        }
      }
    }
    return {
      maxComplementaryOverlap,
      dimerRisk: maxComplementaryOverlap >= 4,
    };
  },
});
export const runPrimerDimerCheck = primerDimerCheckTool.execute;
export default primerDimerCheckTool;
