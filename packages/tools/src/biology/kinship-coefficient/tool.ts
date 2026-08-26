import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KinshipCoefficientInput = {
  readonly commonAncestorInbreedingF?: number;
  readonly pathLength: number;
};

export type KinshipCoefficientOutput = {
  readonly kinshipCoefficient: number;
};

export const kinshipCoefficientExample = {
  input: { pathLength: 2 },
  output: { kinshipCoefficient: 0.125 },
} satisfies ToolExample<KinshipCoefficientInput, KinshipCoefficientOutput>;

export const kinshipCoefficientTool = createSimpleTool({
  id: "biology/kinship-coefficient",
  title: "Kinship From Path",
  description:
    "Compute one common-ancestor path contribution to the kinship coefficient as (1/2)^(n₁+n₂+1) × (1+Fₐ), where the path length is the combined generations from both individuals to the ancestor.",
  inputs: [
    {
      default: 0,
      id: "commonAncestorInbreedingF",
      label: "Common ancestor inbreeding",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Number of generations on the connecting pedigree path.",
      id: "pathLength",
      label: "Path length",
      kind: "integer",
    },
  ],
  outputs: [
    {
      id: "kinshipCoefficient",
      label: "Kinship coefficient",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const pathLength = input.pathLength as number;
    if (!(pathLength >= 1))
      simpleError(
        "pathLength",
        "Path length must be an integer of at least one.",
        "invalid_path",
      );
    return {
      kinshipCoefficient:
        Math.pow(0.5, pathLength + 1) *
        (1 + (input.commonAncestorInbreedingF as number)),
    };
  },
});
export const runKinshipCoefficient = kinshipCoefficientTool.execute;
export default kinshipCoefficientTool;
