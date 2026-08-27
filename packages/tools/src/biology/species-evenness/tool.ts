import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const speciesEvennessExample = {
  input: { hNatural: 0.6931471805599453, speciesCount: 4 },
  output: { pielouEvenness: 0.5 },
} satisfies ToolExample<
  { readonly hNatural: number; readonly speciesCount: number },
  { readonly pielouEvenness: number }
>;

export const speciesEvennessTool = createSimpleTool({
  id: "biology/species-evenness",
  title: "Species Evenness Pielou",
  description:
    "Compute Pielou evenness from natural-log Shannon entropy and species count.",
  inputs: [
    {
      id: "hNatural",
      kind: "number",
      label: "Shannon entropy (natural log)",
      minimum: 0,
    },
    {
      id: "speciesCount",
      kind: "integer",
      label: "Species count",
      minimum: 2,
    },
  ],
  outputs: [
    {
      id: "pielouEvenness",
      kind: "number",
      label: "Pielou evenness",
    },
  ],
  calculate: (input) => {
    const hNatural = input.hNatural as number;
    if (hNatural === 0)
      simpleError(
        "hNatural",
        "Zero Shannon entropy indicates a monoculture.",
        "monoculture",
      );
    return {
      pielouEvenness: hNatural / Math.log(input.speciesCount as number),
    };
  },
});
export const runSpeciesEvenness = speciesEvennessTool.execute;
export default speciesEvennessTool;
