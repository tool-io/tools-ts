import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const conditionalFormationConstantExample = {
  input: { alphaFraction: 0.35, formationConstantBeta: 200 },
} satisfies ToolExample<{
  readonly alphaFraction: number;
  readonly formationConstantBeta: number;
}>;

export const conditionalFormationConstantTool = createSimpleTool({
  id: "chemistry/conditional-formation-constant",
  title: "Conditional Kf Prime",
  description:
    "Compute the conditional formation constant Kf prime as the product of beta and the ligand alpha fraction.",
  inputs: [
    {
      id: "formationConstantBeta",
      label: "Formation constant beta",
      kind: "number",
    },
    {
      id: "alphaFraction",
      label: "Alpha fraction",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "conditionalFormationConstant",
      label: "Conditional formation constant",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const formationConstantBeta = input.formationConstantBeta as number;
    const alphaFraction = input.alphaFraction as number;
    if (!(formationConstantBeta > 0))
      simpleError(
        "formationConstantBeta",
        "Formation constant must be positive.",
      );
    return {
      conditionalFormationConstant: formationConstantBeta * alphaFraction,
    };
  },
});
export const runConditionalFormationConstant =
  conditionalFormationConstantTool.execute;
export default conditionalFormationConstantTool;
