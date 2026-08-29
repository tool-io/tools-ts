import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const standardEntropyFormationExample = {
  input: { moles: 3, standardEntropyJPerMolK: 205 },
  output: { entropyContributionJPerK: 615 },
} satisfies ToolExample<
  {
    readonly moles: number;
    readonly standardEntropyJPerMolK: number;
  },
  { readonly entropyContributionJPerK: number }
>;

export const standardEntropyFormationTool = createSimpleTool({
  id: "chemistry/standard-entropy-formation",
  title: "Entropy Contribution",
  description:
    "Scale a standard molar entropy to a total entropy contribution for a given amount in moles.",
  inputs: [
    { id: "moles", label: "Amount", kind: "number", unit: "mol" },
    {
      id: "standardEntropyJPerMolK",
      label: "Standard molar entropy",
      kind: "number",
      unit: "J/(mol·K)",
    },
  ],
  outputs: [
    {
      id: "entropyContributionJPerK",
      label: "Entropy contribution",
      kind: "number",
      unit: "J/K",
    },
  ],
  calculate: (input) => {
    const moles = input.moles as number;
    const standardEntropyJPerMolK = input.standardEntropyJPerMolK as number;
    if (!(moles > 0)) simpleError("moles", "Moles must be positive.");
    return { entropyContributionJPerK: moles * standardEntropyJPerMolK };
  },
});
export const runStandardEntropyFormation = standardEntropyFormationTool.execute;
export default standardEntropyFormationTool;
