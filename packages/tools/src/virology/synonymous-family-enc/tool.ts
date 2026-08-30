import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, count, aligned, mean } from "../shared.js";

export type Input = Readonly<{
  readonly familyDegeneracies: readonly number[];
  readonly codonCounts: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly familyHomozygosities: readonly number[];
  readonly effectiveCodonNumber: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.familyDegeneracies, input.codonCounts, "familyDegeneracies");
  const groups = new Map<number, number[]>(),
    familyHomozygosities = input.codonCounts.map((row, i) => {
      const degeneracy = input.familyDegeneracies[i];
      if (![2, 3, 4, 6].includes(degeneracy) || row.length !== degeneracy)
        simpleError(
          "codonCounts",
          "Each supplied synonymous family must contain its 2, 3, 4 or 6 codon counts.",
        );
      row.forEach((v) => count(v, "codonCounts"));
      const total = row.reduce((a, b) => a + b, 0);
      positive(total, "codonCounts");
      const homozygosity = row.reduce((sum, v) => sum + (v / total) ** 2, 0);
      if (!groups.has(degeneracy)) groups.set(degeneracy, []);
      groups.get(degeneracy)!.push(homozygosity);
      return homozygosity;
    });
  if ([2, 3, 4, 6].some((d) => !groups.has(d)))
    simpleError(
      "familyDegeneracies",
      "At least one represented family of each degeneracy is required.",
    );
  const effectiveCodonNumber = Math.min(
    61,
    2 +
      9 / mean(groups.get(2)!) +
      1 / mean(groups.get(3)!) +
      5 / mean(groups.get(4)!) +
      3 / mean(groups.get(6)!),
  );
  return { familyHomozygosities, effectiveCodonNumber };
};
export const exampleInput = {
  familyDegeneracies: [2, 3, 4, 6],
  codonCounts: [
    [5, 5],
    [3, 3, 3],
    [1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
  ],
} satisfies Input;
export const exampleOutput = {
  familyHomozygosities: [0.5, 0.3333333333333333, 0.25, 0.16666666666666666],
  effectiveCodonNumber: 61,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/synonymous-family-enc",
  title: "Synonymous Family ENC",
  description:
    "Estimate ENC from mean synonymous-family homozygosities, without finite-sample correction; caller supplies correctly grouped standard-code families.",
  inputs: [
    {
      id: "familyDegeneracies",
      label: "Family degeneracies",
      kind: "numberList",
    },
    { id: "codonCounts", label: "Codon counts", kind: "matrix" },
  ],
  outputs: [
    {
      id: "familyHomozygosities",
      label: "Family homozygosities",
      kind: "numberList",
    },
    {
      id: "effectiveCodonNumber",
      label: "Effective codon number",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      familyDegeneracies: value.familyDegeneracies as readonly number[],
      codonCounts: value.codonCounts as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
