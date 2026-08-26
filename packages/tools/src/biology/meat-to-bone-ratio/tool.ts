import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const meatToBoneRatioExample = {
  input: { boneMassKg: 20, leanMeatMassKg: 240 },
} satisfies ToolExample<{
  readonly boneMassKg: number;
  readonly leanMeatMassKg: number;
}>;

export const meatToBoneRatioTool = createSimpleTool({
  id: "biology/meat-to-bone-ratio",
  title: "Meat To Bone Ratio",
  description:
    "Compute the carcass meat to bone ratio from lean meat mass and bone mass.",
  inputs: [
    {
      id: "leanMeatMassKg",
      label: "Lean meat mass kg",
      kind: "number",
      minimum: 0,
    },
    { id: "boneMassKg", label: "Bone mass kg", kind: "number" },
  ],
  outputs: [
    {
      id: "meatToBoneRatio",
      label: "Meat to bone ratio",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const leanMeatMassKg = input.leanMeatMassKg as number;
    const boneMassKg = input.boneMassKg as number;
    if (boneMassKg <= 0)
      simpleError("boneMassKg", "Bone mass must be greater than zero.");
    return {
      meatToBoneRatio: leanMeatMassKg / boneMassKg,
    };
  },
});
export const runMeatToBoneRatio = meatToBoneRatioTool.execute;
export default meatToBoneRatioTool;
