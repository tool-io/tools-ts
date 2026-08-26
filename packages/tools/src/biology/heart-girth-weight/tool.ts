import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const heartGirthWeightExample = {
  input: { bodyLengthCm: 160, girthCm: 190 },
} satisfies ToolExample<{
  readonly bodyLengthCm: number;
  readonly girthCm: number;
}>;

export const heartGirthWeightTool = createSimpleTool({
  id: "biology/heart-girth-weight",
  title: "Heart Girth Weight Estimate",
  description:
    "Estimate livestock weight in kilograms from heart girth and body length with the documented heart girth formula.",
  inputs: [
    { id: "girthCm", label: "Heart girth cm", kind: "number" },
    { id: "bodyLengthCm", label: "Body length cm", kind: "number" },
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
    const girthCm = input.girthCm as number;
    const bodyLengthCm = input.bodyLengthCm as number;
    if (girthCm <= 0)
      simpleError("girthCm", "Heart girth must be greater than zero.");
    if (bodyLengthCm <= 0)
      simpleError("bodyLengthCm", "Body length must be greater than zero.");
    return {
      estimatedWeightKg: (Math.pow(girthCm, 2) * bodyLengthCm) / 10839,
    };
  },
});
export const runHeartGirthWeight = heartGirthWeightTool.execute;
export default heartGirthWeightTool;
