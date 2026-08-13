import type { ToolExample } from "../core/example.js";
import { createSimpleTool, simpleError } from "../core/simple.js";
export const calculateWaistToHeight = (
  waist: number,
  height: number,
): number | null =>
  Number.isFinite(waist) && Number.isFinite(height) && waist > 0 && height > 0
    ? waist / height
    : null;
export const waistToHeightExample = {
  input: { height: 180, waist: 80 },
  output: { ratio: 0.4444444444444444 },
} satisfies ToolExample<
  { readonly height: number; readonly waist: number },
  { readonly ratio: number }
>;
export const waistToHeightTool = createSimpleTool({
  id: "waist-to-height",
  title: "Waist-to-Height Ratio Calculator",
  description:
    "Calculate waist circumference divided by height using matching units.",
  inputs: [
    {
      id: "waist",
      kind: "number",
      label: "Waist circumference",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "height",
      kind: "number",
      label: "Height",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      format: "ratio/waist-to-height",
      id: "ratio",
      kind: "number",
      label: "Waist-to-height ratio",
    },
  ],
  calculate: (input) => {
    const ratio = calculateWaistToHeight(
      input.waist as number,
      input.height as number,
    );
    if (ratio === null)
      return simpleError("height", "Waist and height must be positive.");
    return { ratio };
  },
});
export const runWaistToHeight = waistToHeightTool.execute;
export default waistToHeightTool;
