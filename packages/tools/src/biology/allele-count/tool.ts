import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type AlleleCountInput = {
  readonly individuals: number;
};

export type AlleleCountOutput = {
  readonly alleleCopies: number;
};

export const alleleCountExample = {
  input: { individuals: 150 },
  output: { alleleCopies: 300 },
} satisfies ToolExample<AlleleCountInput, AlleleCountOutput>;

export const alleleCountTool = createSimpleTool({
  id: "biology/allele-count",
  title: "Allele Count Total",
  description:
    "Count total allele copies at a diploid locus as twice the number of individuals.",
  inputs: [
    { id: "individuals", label: "Individuals", kind: "integer", minimum: 0 },
  ],
  outputs: [{ id: "alleleCopies", label: "Allele copies", kind: "integer" }],
  calculate: (input) => ({ alleleCopies: 2 * (input.individuals as number) }),
});
export const runAlleleCount = alleleCountTool.execute;
export default alleleCountTool;
