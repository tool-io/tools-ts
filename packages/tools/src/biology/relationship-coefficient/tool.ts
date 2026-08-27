import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type RelationshipCoefficientInput = {
  readonly commonAncestorPathsInt: number;
  readonly generationsInt: number;
};

export type RelationshipCoefficientOutput = {
  readonly relationshipCoefficientR: number;
};

export const relationshipCoefficientExample = {
  input: { commonAncestorPathsInt: 2, generationsInt: 2 },
  output: { relationshipCoefficientR: 0.5 },
} satisfies ToolExample<
  RelationshipCoefficientInput,
  RelationshipCoefficientOutput
>;

export const relationshipCoefficientTool = createSimpleTool({
  id: "biology/relationship-coefficient",
  title: "Additive Relationship",
  description:
    "Compute the additive relationship contribution of one common ancestor path as the number of paths times 0.5 raised to the generation distance.",
  inputs: [
    {
      description: "Number of independent paths through the common ancestor.",
      id: "commonAncestorPathsInt",
      label: "Common ancestor paths",
      kind: "integer",
      minimum: 0,
    },
    {
      description: "Generations separating the individuals via the ancestor.",
      id: "generationsInt",
      label: "Generations",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "relationshipCoefficientR",
      label: "Relationship coefficient r",
      kind: "number",
    },
  ],
  calculate: (input) => ({
    relationshipCoefficientR:
      (input.commonAncestorPathsInt as number) *
      0.5 ** (input.generationsInt as number),
  }),
});
export const runRelationshipCoefficient = relationshipCoefficientTool.execute;
export default relationshipCoefficientTool;
