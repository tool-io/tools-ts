import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { dna, codonAminoAcid } from "../shared.js";

export type Input = Readonly<{
  readonly codon: string;
}>;
export type Output = Readonly<{
  readonly synonymousFractionsByPosition: readonly number[];
  readonly synonymousSiteCount: number;
  readonly nonsynonymousSiteCount: number;
}>;
export const calculate = (input: Input): Output => {
  const codon = dna(input.codon),
    original = codonAminoAcid(codon);
  if (original === "*") simpleError("codon", "A sense codon is required.");
  const synonymousFractionsByPosition = [0, 1, 2].map((i) => {
      let synonymous = 0;
      for (const base of "ACGT")
        if (
          base !== codon[i] &&
          codonAminoAcid(codon.slice(0, i) + base + codon.slice(i + 1)) ===
            original
        )
          synonymous++;
      return synonymous / 3;
    }),
    synonymousSiteCount = synonymousFractionsByPosition.reduce(
      (a, b) => a + b,
      0,
    );
  return {
    synonymousFractionsByPosition,
    synonymousSiteCount,
    nonsynonymousSiteCount: 3 - synonymousSiteCount,
  };
};
export const exampleInput = { codon: "GCT" } satisfies Input;
export const exampleOutput = {
  synonymousFractionsByPosition: [0, 0, 1],
  synonymousSiteCount: 1,
  nonsynonymousSiteCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/synonymous-codon-sites",
  title: "Synonymous Codon Sites",
  description:
    "Count equally weighted synonymous single-base alternatives by codon position using the standard code.",
  inputs: [{ id: "codon", label: "Codon", kind: "string" }],
  outputs: [
    {
      id: "synonymousFractionsByPosition",
      label: "Synonymous fractions by position",
      kind: "numberList",
    },
    {
      id: "synonymousSiteCount",
      label: "Synonymous site count",
      kind: "number",
    },
    {
      id: "nonsynonymousSiteCount",
      label: "Nonsynonymous site count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      codon: value.codon as string,
    }),
});
export const run = tool.execute;
export default tool;
