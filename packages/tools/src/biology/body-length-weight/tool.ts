import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const bodyLengthWeightExample = {
  input: { bodyLengthCm: 160, chestGirthCm: 190 },
} satisfies ToolExample<{
  readonly bodyLengthCm: number;
  readonly chestGirthCm: number;
}>;

export const bodyLengthWeightTool = createSimpleTool({
  id: "biology/body-length-weight",
  title: "Body Length Weight",
  description:
    "Estimate cattle weight in kilograms from body length and chest girth with the same-family length formula.",
  inputs: [
    { id: "bodyLengthCm", label: "Body length cm", kind: "number" },
    { id: "chestGirthCm", label: "Chest girth cm", kind: "number" },
  ],
  outputs: [
    {
      id: "estimatedWeightKg",
      label: "Estimated weight kg",
      kind: "number",
      unit: "kg",
    },
  ],
  calculate: (input) => {
    const bodyLengthCm = input.bodyLengthCm as number;
    const chestGirthCm = input.chestGirthCm as number;
    if (bodyLengthCm <= 0)
      simpleError("bodyLengthCm", "Body length must be greater than zero.");
    if (chestGirthCm <= 0)
      simpleError("chestGirthCm", "Chest girth must be greater than zero.");
    return {
      estimatedWeightKg: (bodyLengthCm * Math.pow(chestGirthCm, 2)) / 10838,
    };
  },
});
export const runBodyLengthWeight = bodyLengthWeightTool.execute;
export default bodyLengthWeightTool;
