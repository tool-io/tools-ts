import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const sorensenEcologyExample = {
  input: { sharedSpecies: 6, speciesA: 10, speciesB: 12 },
  output: { sorensenIndex: 0.5454545454545454 },
} satisfies ToolExample<
  {
    readonly sharedSpecies: number;
    readonly speciesA: number;
    readonly speciesB: number;
  },
  { readonly sorensenIndex: number }
>;

export const sorensenEcologyTool = createSimpleTool({
  id: "biology/sorensen-ecology",
  title: "Sorensen Index",
  description:
    "Compute the Sorensen-Dice coefficient of community similarity as 2 times the number of shared species divided by the sum of species counts in both communities.",
  inputs: [
    {
      description: "Species count in community A; must not be negative.",
      id: "speciesA",
      label: "Species A",
      kind: "number",
    },
    {
      description: "Species count in community B; must not be negative.",
      id: "speciesB",
      label: "Species B",
      kind: "number",
    },
    {
      description:
        "Number of species shared by both communities; must not exceed either count.",
      id: "sharedSpecies",
      label: "Shared species",
      kind: "number",
    },
  ],
  outputs: [
    {
      description: "Sorensen index between 0 and 1.",
      id: "sorensenIndex",
      label: "Sorensen index",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const speciesA = input.speciesA as number;
    const speciesB = input.speciesB as number;
    const shared = input.sharedSpecies as number;
    if (!(speciesA >= 0))
      simpleError("speciesA", "Species A must not be negative.");
    if (!(speciesB >= 0))
      simpleError("speciesB", "Species B must not be negative.");
    if (!(shared >= 0))
      simpleError("sharedSpecies", "Shared species must not be negative.");
    if (shared > Math.min(speciesA, speciesB))
      simpleError(
        "sharedSpecies",
        "Shared species must not exceed the smaller community count.",
      );
    if (!(speciesA + speciesB > 0))
      simpleError(
        "speciesA",
        "The denominator requires a positive total species count.",
      );
    return { sorensenIndex: (2 * shared) / (speciesA + speciesB) };
  },
});
export const runSorensenEcology = sorensenEcologyTool.execute;
export default sorensenEcologyTool;
