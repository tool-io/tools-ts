import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const bonePercentageExample = {
  input: { boneMassKg: 20, carcassWeightKg: 320 },
} satisfies ToolExample<{
  readonly boneMassKg: number;
  readonly carcassWeightKg: number;
}>;

export const bonePercentageTool = createSimpleTool({
  id: "biology/bone-percentage",
  title: "Bone Percentage",
  description: "Compute the bone mass percentage of a dressed carcass weight.",
  inputs: [
    { id: "boneMassKg", label: "Bone mass kg", kind: "number", minimum: 0 },
    {
      id: "carcassWeightKg",
      label: "Carcass weight kg",
      kind: "number",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "bonePercentage",
      label: "Bone percentage",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const boneMassKg = input.boneMassKg as number;
    const carcassWeightKg = input.carcassWeightKg as number;
    if (boneMassKg < 0)
      simpleError("boneMassKg", "Bone mass cannot be negative.");
    if (carcassWeightKg <= 0)
      simpleError(
        "carcassWeightKg",
        "Carcass weight must be greater than zero.",
      );
    if (boneMassKg > carcassWeightKg)
      simpleError("boneMassKg", "Bone mass must not exceed carcass weight.");
    return {
      bonePercentage: (boneMassKg / carcassWeightKg) * 100,
    };
  },
});
export const runBonePercentage = bonePercentageTool.execute;
export default bonePercentageTool;
