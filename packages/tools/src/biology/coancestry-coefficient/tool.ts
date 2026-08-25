import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type CoancestryCoefficientInput = {
  readonly relationshipCoefficient: number;
};

export type CoancestryCoefficientOutput = {
  readonly coancestryPhi: number;
};

export const coancestryCoefficientExample = {
  input: { relationshipCoefficient: 0.5 },
  output: { coancestryPhi: 0.25 },
} satisfies ToolExample<
  CoancestryCoefficientInput,
  CoancestryCoefficientOutput
>;

export const coancestryCoefficientTool = createSimpleTool({
  id: "biology/coancestry-coefficient",
  title: "Coancestry Coefficient",
  description:
    "Compute the coancestry or kinship phi of two individuals as half of their additive relationship coefficient.",
  inputs: [
    {
      id: "relationshipCoefficient",
      label: "Relationship coefficient",
      kind: "number",
      maximum: 1,
      minimum: -1,
    },
  ],
  outputs: [{ id: "coancestryPhi", label: "Coancestry phi", kind: "number" }],
  calculate: (input) => ({
    coancestryPhi: (input.relationshipCoefficient as number) / 2,
  }),
});
export const runCoancestryCoefficient = coancestryCoefficientTool.execute;
export default coancestryCoefficientTool;
