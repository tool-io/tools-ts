import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CanopyHeightModelInput = {
  readonly maxSurfaceElevationMeters: number;
  readonly groundElevationMeters: number;
};

export type CanopyHeightModelOutput = {
  readonly canopyHeightMeters: number;
};

export const canopyHeightModelExample = {
  input: { maxSurfaceElevationMeters: 125.5, groundElevationMeters: 120 },
  output: { canopyHeightMeters: 5.5 },
} satisfies ToolExample<CanopyHeightModelInput, CanopyHeightModelOutput>;

export const canopyHeightModelTool = createSimpleTool({
  id: "biology/canopy-height-model",
  title: "Canopy Height Difference",
  description:
    "Derive canopy height by subtracting the ground elevation from the maximum surface elevation of a canopy height model.",
  inputs: [
    {
      id: "maxSurfaceElevationMeters",
      kind: "number",
      label: "Maximum surface elevation",
      unit: "m",
    },
    {
      id: "groundElevationMeters",
      kind: "number",
      label: "Ground elevation",
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "canopyHeightMeters",
      kind: "number",
      label: "Canopy height",
      unit: "m",
    },
  ],
  calculate: (input) => {
    const maxSurfaceElevationMeters = input.maxSurfaceElevationMeters as number;
    const groundElevationMeters = input.groundElevationMeters as number;
    if (maxSurfaceElevationMeters < groundElevationMeters)
      simpleError(
        "maxSurfaceElevationMeters",
        "The maximum surface elevation must not fall below the ground elevation.",
        "negative_height",
      );
    return {
      canopyHeightMeters: maxSurfaceElevationMeters - groundElevationMeters,
    };
  },
});
export const runCanopyHeightModel = canopyHeightModelTool.execute;
export default canopyHeightModelTool;
