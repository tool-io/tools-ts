import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type PielouEvennessInput = {
  readonly hNatural: number;
  readonly speciesCountInt: number;
};

export type PielouEvennessOutput = {
  readonly pielouEvenness: number;
};

export const pielouEvennessExample = {
  input: { hNatural: 0.6931471805599453, speciesCountInt: 2 },
  output: { pielouEvenness: 1 },
} satisfies ToolExample<PielouEvennessInput, PielouEvennessOutput>;

export const pielouEvennessTool = createSimpleTool({
  id: "biology/pielou-evenness",
  title: "Pielou Evenness",
  description:
    "Compute Pielou evenness J = H / ln(S) from the Shannon index and species count, requiring at least two species.",
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
      id: "pielouEvenness",
      kind: "number",
      label: "Pielou evenness",
    },
  ],
  calculate: (input) => ({
    pielouEvenness:
      (input.hNatural as number) / Math.log(input.speciesCountInt as number),
  }),
});
export const runPielouEvenness = pielouEvennessTool.execute;
export default pielouEvennessTool;
