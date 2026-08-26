import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type MenhinickRichnessInput = {
  readonly individualsInt: number;
  readonly speciesCountInt: number;
};

export type MenhinickRichnessOutput = {
  readonly menhinickIndex: number;
};

export const menhinickRichnessExample = {
  input: { individualsInt: 225, speciesCountInt: 9 },
  output: { menhinickIndex: 0.6 },
} satisfies ToolExample<MenhinickRichnessInput, MenhinickRichnessOutput>;

export const menhinickRichnessTool = createSimpleTool({
  id: "biology/menhinick-richness",
  title: "Menhinick Richness",
  description:
    "Compute the Menhinick richness index as species count divided by the square root of individual count.",
  inputs: [
    {
      id: "individualsInt",
      kind: "integer",
      label: "Individuals",
      minimum: 1,
      unit: "individuals",
    },
    {
      id: "speciesCountInt",
      kind: "integer",
      label: "Species count",
      minimum: 1,
      unit: "species",
    },
  ],
  outputs: [
    {
      id: "menhinickIndex",
      kind: "number",
      label: "Menhinick index",
    },
  ],
  calculate: (input) => ({
    menhinickIndex:
      (input.speciesCountInt as number) /
      Math.sqrt(input.individualsInt as number),
  }),
});
export const runMenhinickRichness = menhinickRichnessTool.execute;
export default menhinickRichnessTool;
