import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type OakStaveSurfaceAreaInput = {
  readonly lengthCm: number;
  readonly thicknessCm: number;
  readonly widthCm: number;
};

export type OakStaveSurfaceAreaOutput = {
  readonly wettedAreaCm2: number;
};

export const oakStaveSurfaceAreaExample = {
  input: {
    lengthCm: 90,
    thicknessCm: 2,
    widthCm: 5,
  },
  output: {
    wettedAreaCm2: 1280,
  },
} satisfies ToolExample<OakStaveSurfaceAreaInput, OakStaveSurfaceAreaOutput>;

export const calculateOakStaveSurfaceArea = (
  input: OakStaveSurfaceAreaInput,
): OakStaveSurfaceAreaOutput => {
  if (input.lengthCm <= 0 || input.widthCm <= 0 || input.thicknessCm <= 0)
    simpleError(
      "lengthCm",
      "Stave dimensions must be positive.",
      "invalid_value",
    );
  return {
    wettedAreaCm2: roundStatistic(
      2 * (input.lengthCm * input.widthCm) +
        2 * (input.lengthCm * input.thicknessCm) +
        2 * (input.widthCm * input.thicknessCm),
    ),
  };
};

export const oakStaveSurfaceAreaTool = createSimpleTool({
  calculate: (input) =>
    calculateOakStaveSurfaceArea(input as unknown as OakStaveSurfaceAreaInput),
  description:
    "Compute the total area of all six faces of a fully submerged rectangular oak stave; subtract covered or unwetted faces when the mounting blocks wine contact.",
  id: "oenology/oak-stave-surface-area",
  inputs: [
    {
      description: "Stave length along the wine column.",
      id: "lengthCm",
      kind: "number",
      label: "Length",
      minimum: 0,
      unit: "cm",
    },
    {
      description: "Stave width across the broad face.",
      id: "widthCm",
      kind: "number",
      label: "Width",
      minimum: 0,
      unit: "cm",
    },
    {
      description: "Stave thickness of the narrow edges.",
      id: "thicknessCm",
      kind: "number",
      label: "Thickness",
      minimum: 0,
      unit: "cm",
    },
  ],
  outputs: [
    {
      description: "Area of both broad faces, both long edges, and both ends.",
      id: "wettedAreaCm2",
      kind: "number",
      label: "Wetted area",
      unit: "cm²",
    },
  ],
  title: "Oak Stave Surface Area Calculator",
});
export const runOakStaveSurfaceArea = oakStaveSurfaceAreaTool.execute;
export default oakStaveSurfaceAreaTool;
