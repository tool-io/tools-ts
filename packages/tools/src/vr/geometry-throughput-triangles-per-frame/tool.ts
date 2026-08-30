import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GeometryThroughputTrianglesPerFrameInput = Readonly<{
  readonly trianglesPerSecond: number;
  readonly framesPerSecond: number;
}>;
export type GeometryThroughputTrianglesPerFrameOutput = Readonly<{
  readonly trianglesPerFrame: number;
}>;

export const calculateGeometryThroughputTrianglesPerFrame = (
  x: GeometryThroughputTrianglesPerFrameInput,
): GeometryThroughputTrianglesPerFrameOutput => {
  if (!Number.isFinite(x.trianglesPerSecond) || x.trianglesPerSecond < 0)
    simpleError("trianglesPerSecond", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.framesPerSecond) || x.framesPerSecond <= 0)
    simpleError("framesPerSecond", "Provide a finite positive number.");
  const trianglesPerFrame = x.trianglesPerSecond / x.framesPerSecond;
  if (!Number.isFinite(trianglesPerFrame))
    simpleError(
      "trianglesPerFrame",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    trianglesPerFrame: Object.is(trianglesPerFrame, -0) ? 0 : trianglesPerFrame,
  };
};

export const example = {
  input: {
    trianglesPerSecond: 9000000,
    framesPerSecond: 90,
  },
  output: { trianglesPerFrame: 100000 },
} satisfies ToolExample<
  GeometryThroughputTrianglesPerFrameInput,
  GeometryThroughputTrianglesPerFrameOutput
>;

export const tool = createSimpleTool({
  id: "vr/geometry-throughput-triangles-per-frame",
  title: "Geometry Throughput Triangles Per Frame",
  description:
    "Average triangles rendered per frame from triangles per second and rendered frames per second.",
  inputs: [
    {
      id: "trianglesPerSecond",
      kind: "number",
      label: "Triangles Per Second",
      unit: "tri/s",
      minimum: 0,
    },
    {
      id: "framesPerSecond",
      kind: "number",
      label: "Frames Per Second",
      unit: "fps",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "trianglesPerFrame",
      kind: "number",
      label: "Triangles Per Frame",
      unit: "tri/frame",
    },
  ],
  calculate: (input) =>
    calculateGeometryThroughputTrianglesPerFrame({
      trianglesPerSecond: input.trianglesPerSecond as number,
      framesPerSecond: input.framesPerSecond as number,
    }),
});
export const geometryThroughputTrianglesPerFrameTool = tool;
export const runGeometryThroughputTrianglesPerFrame = tool.execute;
export default tool;
