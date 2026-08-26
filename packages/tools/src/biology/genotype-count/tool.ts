import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GenotypeCountInput = {
  readonly aaIndividuals: number;
  readonly abIndividuals: number;
  readonly bbIndividuals: number;
  readonly optionalTotal?: number;
};

export type GenotypeCountOutput = {
  readonly totalCount: number;
};

export const genotypeCountExample = {
  input: {
    aaIndividuals: 12,
    abIndividuals: 30,
    bbIndividuals: 8,
    optionalTotal: 50,
  },
  output: { totalCount: 50 },
} satisfies ToolExample<GenotypeCountInput, GenotypeCountOutput>;

export const genotypeCountTool = createSimpleTool({
  id: "biology/genotype-count",
  title: "Genotype Count Check",
  description:
    "Sum genotype counts and, when a total is supplied, verify the counts reconcile with it.",
  inputs: [
    {
      id: "aaIndividuals",
      label: "AA individuals",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "abIndividuals",
      label: "AB individuals",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "bbIndividuals",
      label: "BB individuals",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "optionalTotal",
      label: "Expected total",
      kind: "integer",
      minimum: 0,
      required: false,
    },
  ],
  outputs: [{ id: "totalCount", label: "Total count", kind: "integer" }],
  calculate: (input) => {
    const sum =
      (input.aaIndividuals as number) +
      (input.abIndividuals as number) +
      (input.bbIndividuals as number);
    const optionalTotal = input.optionalTotal as number | undefined;
    if (optionalTotal !== undefined && sum !== optionalTotal)
      simpleError(
        "optionalTotal",
        "Genotype counts do not sum to the provided total.",
        "count_mismatch",
      );
    return { totalCount: sum };
  },
});
export const runGenotypeCount = genotypeCountTool.execute;
export default genotypeCountTool;
