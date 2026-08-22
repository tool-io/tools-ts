import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const CircleCircumferenceTool = createSimpleTool({
  id: "geometry/circle-circumference",
  title: "Circle Circumference Calculator",
  description: "Compute circumference of a circle as 2*pi*r.",
  inputs: [{ id: "radius", label: "Radius", kind: "number", minimum: 0 }],
  outputs: [{ id: "circumference", label: "Circumference", kind: "number" }],
  calculate: (input) => {
    return { circumference: 2 * Math.PI * (input.radius as number) };
  },
});
export default CircleCircumferenceTool;
export const runCircleCircumference = CircleCircumferenceTool.execute;

export type CircleCircumferenceInput = {
  readonly radius: number;
};

export type CircleCircumferenceOutput = {
  readonly circumference: number;
};

export const circleCircumferenceExample = {
  input: {
    radius: 1,
  },
  output: {
    circumference: 6.283185307179586,
  },
} satisfies ToolExample<CircleCircumferenceInput, CircleCircumferenceOutput>;
