import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type WilliamsAlphaInput = {
  readonly habitatsSampledInt: number;
  readonly regionalSpeciesInt: number;
};

export type WilliamsAlphaOutput = {
  readonly williamsAlpha: number;
};

export const williamsAlphaExample = {
  input: { habitatsSampledInt: 5, regionalSpeciesInt: 60 },
  output: { williamsAlpha: 12 },
} satisfies ToolExample<WilliamsAlphaInput, WilliamsAlphaOutput>;

export const williamsAlphaTool = createSimpleTool({
  id: "biology/williams-alpha",
  title: "Williams Alpha",
  description:
    "Compute Williams alpha diversity as the regional species count divided by the number of habitats sampled.",
  inputs: [
    {
      id: "regionalSpeciesInt",
      kind: "integer",
      label: "Regional species",
      minimum: 1,
      unit: "species",
    },
    {
      id: "habitatsSampledInt",
      kind: "integer",
      label: "Habitats sampled",
      minimum: 1,
      unit: "habitats",
    },
  ],
  outputs: [
    {
      id: "williamsAlpha",
      kind: "number",
      label: "Williams alpha diversity",
    },
  ],
  calculate: (input) => {
    const regionalSpeciesInt = input.regionalSpeciesInt as number;
    const habitatsSampledInt = input.habitatsSampledInt as number;
    return {
      williamsAlpha: regionalSpeciesInt / habitatsSampledInt,
    };
  },
});
export const runWilliamsAlpha = williamsAlphaTool.execute;
export default williamsAlphaTool;
