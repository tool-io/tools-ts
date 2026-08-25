import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const cfseMeanFluorescenceExample = {
  input: { currentMfi: 64, parentGenerationMfi: 256 },
} satisfies ToolExample<{
  readonly currentMfi: number;
  readonly parentGenerationMfi: number;
}>;

export const cfseMeanFluorescenceTool = createSimpleTool({
  id: "biology/cfse-mean-fluorescence",
  title: "CFSE MFI Halving",
  description:
    "Infer the number of CFSE fluorescence halvings, and hence cell generations, from parent and current mean fluorescence intensities.",
  inputs: [
    {
      id: "parentGenerationMfi",
      label: "Parent generation MFI",
      kind: "number",
    },
    { id: "currentMfi", label: "Current MFI", kind: "number" },
  ],
  outputs: [
    { id: "generationHalvings", label: "Generation halvings", kind: "number" },
  ],
  calculate: (input) => {
    const parentGenerationMfi = input.parentGenerationMfi as number;
    const currentMfi = input.currentMfi as number;
    if (parentGenerationMfi <= 0 || currentMfi <= 0)
      simpleError("currentMfi", "MFI values must be positive.", "invalid_mfi");
    if (currentMfi > parentGenerationMfi)
      simpleError(
        "currentMfi",
        "Current MFI must not exceed the parent generation MFI.",
        "no_division",
      );
    return {
      generationHalvings: Math.log2(parentGenerationMfi / currentMfi),
    };
  },
});
export const runCfseMeanFluorescence = cfseMeanFluorescenceTool.execute;
export default cfseMeanFluorescenceTool;
