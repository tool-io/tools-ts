import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const pielouCorrectedExample = {
  input: { hNatural: 0.5, speciesCountInt: 4 },
  output: { pielouCorrectedEvenness: 0.36067376022224085 },
} satisfies ToolExample<
  { readonly hNatural: number; readonly speciesCountInt: number },
  { readonly pielouCorrectedEvenness: number }
>;

export const pielouCorrectedTool = createSimpleTool({
  id: "biology/evenness-pielou-corrected",
  title: "Pielou Corrected",
  description:
    "Compute corrected Pielou evenness as natural Shannon entropy divided by the natural logarithm of the species count, returning exactly zero when entropy is zero.",
  inputs: [
    {
      id: "hNatural",
      label: "Shannon entropy",
      kind: "number",
      minimum: 0,
    },
    {
      id: "speciesCountInt",
      label: "Species count",
      kind: "integer",
      minimum: 2,
    },
  ],
  outputs: [
    {
      id: "pielouCorrectedEvenness",
      label: "Corrected Pielou evenness",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const hNatural = input.hNatural as number;
    const speciesCountInt = input.speciesCountInt as number;
    if (hNatural > Math.log(speciesCountInt) + 1e-12)
      simpleError(
        "hNatural",
        "Shannon entropy cannot exceed ln(species count).",
        "invalid_entropy",
      );
    if (hNatural === 0) return { pielouCorrectedEvenness: 0 };
    return {
      pielouCorrectedEvenness: hNatural / Math.log(speciesCountInt),
    };
  },
});
export const runPielouCorrected = pielouCorrectedTool.execute;
export default pielouCorrectedTool;
