import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const circleSectorAreaExample = {
  input: { angleDeg: 90, radius: 2 },
  output: { area: Math.PI },
} satisfies ToolExample<CircleSectorAreaInput, CircleSectorAreaOutput>;

export type CircleSectorAreaInput = {
  readonly angleDeg: number;
  readonly radius: number;
};
export type CircleSectorAreaOutput = { readonly area: number };

export const calculateCircleSectorArea = (
  input: CircleSectorAreaInput,
): CircleSectorAreaOutput => {
  if (input.angleDeg < 0 || input.angleDeg > 360 || input.radius < 0)
    simpleError(
      "angleDeg",
      "Angle must be between zero and three-sixty.",
      "invalid_angle",
    );
  return {
    area: (input.angleDeg / 360) * Math.PI * input.radius ** 2,
  };
};

export const circleSectorAreaTool = createSimpleTool({
  calculate: (input) =>
    calculateCircleSectorArea(input as unknown as CircleSectorAreaInput),
  description:
    "Compute the area of a circular sector from its central angle and radius.",
  id: "geometry/circle-sector-area",
  inputs: [
    {
      description: "Central angle of the sector.",
      id: "angleDeg",
      kind: "number",
      label: "Angle",
      unit: "°",
      maximum: 360,
      minimum: 0,
    },
    {
      description: "Radius of the circle.",
      id: "radius",
      kind: "number",
      label: "Radius",
      minimum: 0,
    },
  ],
  outputs: [{ id: "area", kind: "number", label: "Sector area" }],
  title: "Circle Sector Area Calculator",
});
export const runCircleSectorArea = circleSectorAreaTool.execute;
export default circleSectorAreaTool;
