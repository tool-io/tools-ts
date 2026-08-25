import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const chestGirthWeightExample = {
  input: { chestGirthCm: 180 },
} satisfies ToolExample<{
  readonly chestGirthCm: number;
}>;

export const chestGirthWeightTool = createSimpleTool({
  id: "biology/chest-girth-weight",
  title: "Chest Girth Weight",
  description:
    "Estimate cattle weight in kilograms from the chest girth with the documented cubic approximation.",
  inputs: [{ id: "chestGirthCm", label: "Chest girth cm", kind: "number" }],
  outputs: [
    {
      id: "estimatedWeightKg",
      label: "Estimated weight kg",
      kind: "number",
      unit: "kg",
    },
  ],
  calculate: (input) => {
    const chestGirthCm = input.chestGirthCm as number;
    if (chestGirthCm <= 0)
      simpleError("chestGirthCm", "Chest girth must be greater than zero.");
    return {
      estimatedWeightKg: Math.pow(chestGirthCm, 3) / 11900,
    };
  },
});
export const runChestGirthWeight = chestGirthWeightTool.execute;
export default chestGirthWeightTool;
