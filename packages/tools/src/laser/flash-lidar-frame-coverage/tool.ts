import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly horizontalPixels: number;
  readonly verticalPixels: number;
  readonly horizontalFieldDegrees: number;
  readonly verticalFieldDegrees: number;
}>;
export type Output = Readonly<{
  readonly pointsPerFrame: number;
  readonly horizontalDegreesPerPixel: number;
  readonly verticalDegreesPerPixel: number;
}>;

export const calculate = (input: Input): Output => {
  return {
    pointsPerFrame: input.horizontalPixels * input.verticalPixels,
    horizontalDegreesPerPixel:
      input.horizontalFieldDegrees / input.horizontalPixels,
    verticalDegreesPerPixel: input.verticalFieldDegrees / input.verticalPixels,
  };
};

export const exampleInput = {
  horizontalPixels: 1024,
  verticalPixels: 512,
  horizontalFieldDegrees: 60,
  verticalFieldDegrees: 30,
} satisfies Input;
export const exampleOutput = {
  pointsPerFrame: 524288,
  horizontalDegreesPerPixel: 0.05859375,
  verticalDegreesPerPixel: 0.05859375,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      horizontalPixels: input.horizontalPixels as number,
      verticalPixels: input.verticalPixels as number,
      horizontalFieldDegrees: input.horizontalFieldDegrees as number,
      verticalFieldDegrees: input.verticalFieldDegrees as number,
    }),
  description:
    "Calculate flash-lidar points per frame and angular pixel pitch.",
  id: "laser/flash-lidar-frame-coverage",
  inputs: [
    {
      id: "horizontalPixels",
      label: "Horizontal pixels",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "verticalPixels",
      label: "Vertical pixels",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "horizontalFieldDegrees",
      label: "Horizontal field of view",
      kind: "number",
      minimum: 0,
      unit: "°",
    },
    {
      id: "verticalFieldDegrees",
      label: "Vertical field of view",
      kind: "number",
      minimum: 0,
      unit: "°",
    },
  ],
  outputs: [
    {
      id: "pointsPerFrame",
      label: "Points per frame",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "horizontalDegreesPerPixel",
      label: "Horizontal angular pitch",
      kind: "number",
      minimum: 0,
      unit: "°/px",
    },
    {
      id: "verticalDegreesPerPixel",
      label: "Vertical angular pitch",
      kind: "number",
      minimum: 0,
      unit: "°/px",
    },
  ],
  title: "Flash-Lidar Frame Coverage",
});

export const run = tool.execute;
export default tool;
