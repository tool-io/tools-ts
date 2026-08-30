import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RatioFromTwoSizesReverseEngineerInput = Readonly<{
  readonly lowerPixels: number;
  readonly higherPixels: number;
}>;
export type RatioFromTwoSizesReverseEngineerOutput = Readonly<{
  readonly scaleRatio: number;
}>;

export const calculateRatioFromTwoSizesReverseEngineer = (
  x: RatioFromTwoSizesReverseEngineerInput,
): RatioFromTwoSizesReverseEngineerOutput => {
  if (!Number.isFinite(x.lowerPixels) || x.lowerPixels <= 0)
    simpleError("lowerPixels", "Provide a finite positive number.");
  if (!Number.isFinite(x.higherPixels) || x.higherPixels <= 0)
    simpleError("higherPixels", "Provide a finite positive number.");
  const scaleRatio = x.higherPixels / x.lowerPixels;
  if (!Number.isFinite(scaleRatio))
    simpleError(
      "scaleRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { scaleRatio: Object.is(scaleRatio, -0) ? 0 : scaleRatio };
};

export const example = {
  input: {
    lowerPixels: 16,
    higherPixels: 20,
  },
  output: { scaleRatio: 1.25 },
} satisfies ToolExample<
  RatioFromTwoSizesReverseEngineerInput,
  RatioFromTwoSizesReverseEngineerOutput
>;

export const tool = createSimpleTool({
  id: "typography/ratio-from-two-sizes-reverse-engineer",
  title: "Ratio From Two Sizes Reverse Engineer",
  description:
    "Type-scale ratio between an adjacent lower and higher font size.",
  inputs: [
    {
      id: "lowerPixels",
      kind: "number",
      label: "Lower Pixels",
      unit: "px",
      minimum: 0,
    },
    {
      id: "higherPixels",
      kind: "number",
      label: "Higher Pixels",
      unit: "px",
      minimum: 0,
    },
  ],
  outputs: [{ id: "scaleRatio", kind: "number", label: "Scale Ratio" }],
  calculate: (input) =>
    calculateRatioFromTwoSizesReverseEngineer({
      lowerPixels: input.lowerPixels as number,
      higherPixels: input.higherPixels as number,
    }),
});
export const ratioFromTwoSizesReverseEngineerTool = tool;
export const runRatioFromTwoSizesReverseEngineer = tool.execute;
export default tool;
