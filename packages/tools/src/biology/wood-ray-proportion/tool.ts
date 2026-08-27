import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WoodRayProportionInput = {
  readonly rayAreaPixels: number;
  readonly totalSectionPixels: number;
};

export type WoodRayProportionOutput = {
  readonly woodRayProportionPercent: number;
};

export const woodRayProportionExample = {
  input: { rayAreaPixels: 250, totalSectionPixels: 1000 },
  output: { woodRayProportionPercent: 25 },
} satisfies ToolExample<WoodRayProportionInput, WoodRayProportionOutput>;

export const woodRayProportionTool = createSimpleTool({
  id: "biology/wood-ray-proportion",
  title: "Ray Proportion Percent",
  description:
    "Compute the wood ray proportion in percent as the ray pixel area divided by the total cross-section pixel area times one hundred.",
  inputs: [
    {
      id: "rayAreaPixels",
      kind: "integer",
      label: "Ray area",
      minimum: 0,
      unit: "pixels",
    },
    {
      id: "totalSectionPixels",
      kind: "integer",
      label: "Total section area",
      minimum: 1,
      unit: "pixels",
    },
  ],
  outputs: [
    {
      id: "woodRayProportionPercent",
      kind: "number",
      label: "Wood ray proportion",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const rayAreaPixels = input.rayAreaPixels as number;
    const totalSectionPixels = input.totalSectionPixels as number;
    if (rayAreaPixels > totalSectionPixels)
      simpleError(
        "rayAreaPixels",
        "The ray area cannot exceed the total section area.",
        "invalid_counts",
      );
    return {
      woodRayProportionPercent: (rayAreaPixels / totalSectionPixels) * 100,
    };
  },
});
export const runWoodRayProportion = woodRayProportionTool.execute;
export default woodRayProportionTool;
