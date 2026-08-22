import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const circularSegmentAreaTool = createSimpleTool({
  id: "geometry/circular-segment-area",
  title: "Circular Segment Area Calculator",
  description:
    "Calculate the area of a circular segment as (r²/2)·(θ−sin θ) for a central angle in radians.",
  inputs: [
    {
      description: "Circle radius.",
      id: "radius",
      label: "Radius",
      kind: "number",
      minimum: 0,
    },
    {
      description: "Central angle in radians between zero and 2π.",
      id: "angleRadians",
      label: "Central angle",
      kind: "number",
      maximum: 6.283185307179586,
      minimum: 0,
      unit: "rad",
    },
  ],
  outputs: [{ id: "area", label: "Segment area", kind: "number" }],
  calculate: (input) => {
    const radius = input.radius as number;
    const angle = input.angleRadians as number;
    if (radius <= 0)
      simpleError(
        "radius",
        "The radius must be greater than zero.",
        "invalid_radius",
      );
    return {
      area: ((radius * radius) / 2) * (angle - Math.sin(angle)),
    };
  },
});
export const runCircularSegmentArea = circularSegmentAreaTool.execute;
export default circularSegmentAreaTool;

export type CircularSegmentAreaInput = {
  readonly radius: number;
  readonly angleRadians: number;
};

export type CircularSegmentAreaOutput = {
  readonly area: number;
};

export const circularSegmentAreaExample = {
  input: {
    radius: 1,
    angleRadians: 1,
  },
  output: {
    area: 0.07926450759605175,
  },
} satisfies ToolExample<CircularSegmentAreaInput, CircularSegmentAreaOutput>;
