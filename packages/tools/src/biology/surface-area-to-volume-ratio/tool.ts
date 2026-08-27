import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const surfaceAreaToVolumeRatioExample = {
  input: { sideLengthMm: 2 },
  output: { saVolumeRatio: 3 },
} satisfies ToolExample<
  { readonly sideLengthMm: number },
  { readonly saVolumeRatio: number }
>;

export const surfaceAreaToVolumeRatioTool = createSimpleTool({
  id: "biology/surface-area-to-volume-ratio",
  title: "SA/V Ratio",
  description:
    "Compute the surface-area-to-volume ratio of a cube with the given side length, where area is 6 times the square of the side and volume is its cube, giving 6 over the side length.",
  inputs: [
    {
      description: "Cube side length; must be greater than zero.",
      id: "sideLengthMm",
      label: "Side length",
      kind: "number",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Surface-area-to-volume ratio in inverse millimetres.",
      id: "saVolumeRatio",
      label: "SA/V ratio",
      kind: "number",
      unit: "1/mm",
    },
  ],
  calculate: (input) => {
    const sideLengthMm = input.sideLengthMm as number;
    if (!(sideLengthMm > 0))
      simpleError(
        "sideLengthMm",
        "The cube side length must be greater than zero.",
      );
    return { saVolumeRatio: 6 / sideLengthMm };
  },
});
export const runSurfaceAreaToVolumeRatio = surfaceAreaToVolumeRatioTool.execute;
export default surfaceAreaToVolumeRatioTool;
