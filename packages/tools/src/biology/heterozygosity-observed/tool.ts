import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeterozygosityObservedInput = {
  readonly heterozygotes: number;
  readonly totalIndividuals: number;
};

export type HeterozygosityObservedOutput = {
  readonly observedHeterozygosity: number;
};

export const heterozygosityObservedExample = {
  input: { heterozygotes: 45, totalIndividuals: 90 },
  output: { observedHeterozygosity: 0.5 },
} satisfies ToolExample<
  HeterozygosityObservedInput,
  HeterozygosityObservedOutput
>;

export const heterozygosityObservedTool = createSimpleTool({
  id: "biology/heterozygosity-observed",
  title: "Observed Heterozygosity",
  description:
    "Compute observed heterozygosity as the fraction of individuals that are heterozygous.",
  inputs: [
    {
      id: "heterozygotes",
      label: "Heterozygotes",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "totalIndividuals",
      label: "Total individuals",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "observedHeterozygosity",
      label: "Observed heterozygosity",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const heterozygotes = input.heterozygotes as number;
    const totalIndividuals = input.totalIndividuals as number;
    if (heterozygotes > totalIndividuals)
      simpleError(
        "heterozygotes",
        "Heterozygotes must not exceed total individuals.",
        "invalid_count",
      );
    return { observedHeterozygosity: heterozygotes / totalIndividuals };
  },
});
export const runHeterozygosityObserved = heterozygosityObservedTool.execute;
export default heterozygosityObservedTool;
