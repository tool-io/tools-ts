import type { ToolExample } from "../core/example.js";
import { createSimpleTool, simpleError } from "../core/simple.js";
export const calculateWaistToHip = (
  waist: number,
  hip: number,
): number | null =>
  Number.isFinite(waist) && Number.isFinite(hip) && waist > 0 && hip > 0
    ? waist / hip
    : null;
export const waistToHipExample = {
  input: { hip: 80, waist: 70 },
  output: { ratio: 0.875 },
} satisfies ToolExample<
  { readonly hip: number; readonly waist: number },
  { readonly ratio: number }
>;
export const waistToHipTool = createSimpleTool({
  id: "waist-to-hip",
  title: "Waist-to-Hip Ratio Calculator",
  description:
    "Calculate waist circumference divided by hip circumference using matching units.",
  inputs: [
    {
      id: "waist",
      kind: "number",
      label: "Waist circumference",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "hip",
      kind: "number",
      label: "Hip circumference",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      format: "ratio/waist-to-hip",
      id: "ratio",
      kind: "number",
      label: "Waist-to-hip ratio",
    },
  ],
  calculate: (input) => {
    const ratio = calculateWaistToHip(
      input.waist as number,
      input.hip as number,
    );
    if (ratio === null)
      return simpleError(
        "hip",
        "Waist and hip circumferences must be positive.",
      );
    return { ratio };
  },
});
export const runWaistToHip = waistToHipTool.execute;
export default waistToHipTool;
