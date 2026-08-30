import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly proteinIds: readonly string[];
  readonly peptideIds: readonly string[];
}>;
export type Output = Readonly<{
  readonly selectedProteinIds: readonly string[];
  readonly coveredPeptides: readonly string[];
  readonly uncoveredPeptides: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  const n = input.proteinIds.length;
  if (n === 0 || input.peptideIds.length !== n)
    simpleError("proteinIds", "Aligned protein and peptide evidence required.");
  const all = [...new Set(input.peptideIds)],
    proteinMap = new Map<string, Set<string>>();
  for (let i = 0; i < n; i++) {
    const group = proteinMap.get(input.proteinIds[i]) ?? new Set<string>();
    group.add(input.peptideIds[i]);
    proteinMap.set(input.proteinIds[i], group);
  }
  const uncovered = new Set(all),
    selectedProteinIds: string[] = [];
  while (uncovered.size) {
    const order = [...proteinMap.entries()]
        .map(([id, peptides]) => ({
          id,
          cover: [...peptides].filter((p) => uncovered.has(p)).length,
        }))
        .sort((a, b) => b.cover - a.cover || a.id.localeCompare(b.id)),
      best = order[0];
    if (!best || best.cover === 0) break;
    selectedProteinIds.push(best.id);
    for (const p of proteinMap.get(best.id)!) uncovered.delete(p);
  }
  return {
    selectedProteinIds,
    coveredPeptides: all.filter((v) => !uncovered.has(v)),
    uncoveredPeptides: [...uncovered],
  };
};
export const exampleInput = {
  proteinIds: ["A", "A", "B", "B"],
  peptideIds: ["x", "y", "y", "z"],
} satisfies Input;
export const exampleOutput = {
  selectedProteinIds: ["A", "B"],
  coveredPeptides: ["x", "y", "z"],
  uncoveredPeptides: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/protein-group-parsimony",
  title: "Protein Group Parsimony",
  description:
    "Greedily select a parsimonious protein group covering peptide evidence.",
  inputs: [
    { id: "proteinIds", label: "Protein ids", kind: "stringList" },
    { id: "peptideIds", label: "Peptide ids", kind: "stringList" },
  ],
  outputs: [
    {
      id: "selectedProteinIds",
      label: "Selected protein ids",
      kind: "stringList",
    },
    { id: "coveredPeptides", label: "Covered peptides", kind: "stringList" },
    {
      id: "uncoveredPeptides",
      label: "Uncovered peptides",
      kind: "stringList",
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
