import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly proteinIds: readonly string[];
  readonly peptideIds: readonly string[];
}>;
export type Output = Readonly<{
  readonly uniquePeptideCounts: readonly number[];
  readonly distinctPeptideCount: number;
}>;
export const calculate = (input: Input): Output => {
  const n = input.proteinIds.length;
  if (n === 0 || input.peptideIds.length !== n)
    simpleError("proteinIds", "Aligned protein/peptide assignments required.");
  const edges = new Map<string, Set<string>>();
  for (let i = 0; i < n; i++) {
    const set = edges.get(input.peptideIds[i]) ?? new Set<string>();
    set.add(input.proteinIds[i]);
    edges.set(input.peptideIds[i], set);
  }
  const ids = [...new Set(input.proteinIds)];
  return {
    uniquePeptideCounts: ids.map(
      (id) =>
        [...edges.values()].filter((set) => set.size === 1 && set.has(id))
          .length,
    ),
    distinctPeptideCount: edges.size,
  };
};
export const exampleInput = {
  proteinIds: ["A", "A", "B", "B"],
  peptideIds: ["x", "y", "y", "z"],
} satisfies Input;
export const exampleOutput = {
  uniquePeptideCounts: [1, 1],
  distinctPeptideCount: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/unique-peptide-tally",
  title: "Unique Peptide Tally",
  description:
    "Count peptides unique to each protein in the observed evidence graph.",
  inputs: [
    { id: "proteinIds", label: "Protein ids", kind: "stringList" },
    { id: "peptideIds", label: "Peptide ids", kind: "stringList" },
  ],
  outputs: [
    {
      id: "uniquePeptideCounts",
      label: "Unique peptide counts",
      kind: "numberList",
    },
    {
      id: "distinctPeptideCount",
      label: "Distinct peptide count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      proteinIds: value.proteinIds as readonly string[],
      peptideIds: value.peptideIds as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
