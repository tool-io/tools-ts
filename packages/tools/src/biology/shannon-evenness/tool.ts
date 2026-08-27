import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type ShannonEvennessInput = {
  readonly hNatural: number;
  readonly speciesCountInt: number;
};

export type ShannonEvennessOutput = {
  readonly shannonEvenness: number;
};

export const shannonEvennessExample = {
  input: { hNatural: 0.6365141682948128, speciesCountInt: 2 },
  output: { shannonEvenness: 0.9182958340544894 },
} satisfies ToolExample<ShannonEvennessInput, ShannonEvennessOutput>;

export const shannonEvennessTool = createSimpleTool({
  id: "biology/shannon-evenness",
  title: "Shannon Evenness",
  description:
    "Compute Shannon evenness E = H / ln(S) from the Shannon natural-log diversity index and species count, requiring at least two species.",
  inputs: [
    {
      id: "hNatural",
      kind: "number",
      label: "Shannon index",
      minimum: 0,
    },
    {
      id: "speciesCountInt",
      kind: "integer",
      label: "Species count",
      minimum: 2,
      unit: "species",
    },
  ],
  outputs: [
    {
      id: "shannonEvenness",
      kind: "number",
      label: "Shannon evenness",
    },
  ],
  calculate: (input) => ({
    shannonEvenness:
      (input.hNatural as number) / Math.log(input.speciesCountInt as number),
  }),
});
export const runShannonEvenness = shannonEvennessTool.execute;
export default shannonEvennessTool;
