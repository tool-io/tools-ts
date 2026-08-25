import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BergerParkerDominanceInput = {
  readonly mostAbundantCount: number;
  readonly totalIndividualsInt: number;
};

export type BergerParkerDominanceOutput = {
  readonly bergerParkerDominance: number;
};

export const bergerParkerDominanceExample = {
  input: { mostAbundantCount: 35, totalIndividualsInt: 100 },
  output: { bergerParkerDominance: 0.35 },
} satisfies ToolExample<
  BergerParkerDominanceInput,
  BergerParkerDominanceOutput
>;

export const bergerParkerDominanceTool = createSimpleTool({
  id: "biology/berger-parker-dominance",
  title: "Berger-Parker Dominance",
  description:
    "Compute the Berger Parker dominance index as the most abundant count over total individuals.",
  inputs: [
    {
      id: "mostAbundantCount",
      kind: "integer",
      label: "Most abundant count",
      minimum: 0,
      unit: "individuals",
    },
    {
      id: "totalIndividualsInt",
      kind: "integer",
      label: "Total individuals",
      minimum: 1,
      unit: "individuals",
    },
  ],
  outputs: [
    {
      id: "bergerParkerDominance",
      kind: "number",
      label: "Berger-Parker dominance",
    },
  ],
  calculate: (input) => {
    const mostAbundantCount = input.mostAbundantCount as number;
    const totalIndividualsInt = input.totalIndividualsInt as number;
    if (mostAbundantCount > totalIndividualsInt)
      simpleError(
        "mostAbundantCount",
        "The most abundant count must not exceed the total individuals.",
        "invalid_counts",
      );
    return {
      bergerParkerDominance: mostAbundantCount / totalIndividualsInt,
    };
  },
});
export const runBergerParkerDominance = bergerParkerDominanceTool.execute;
export default bergerParkerDominanceTool;
