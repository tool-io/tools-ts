import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const Distance3dTool = createSimpleTool({
  id: "geometry/distance-3d",
  title: "3D Euclidean Distance Calculator",
  description: "Compute Euclidean distance between two 3D points.",
  inputs: [
    { id: "x1", label: "X1", kind: "number" },
    { id: "y1", label: "Y1", kind: "number" },
    { id: "z1", label: "Z1", kind: "number" },
    { id: "x2", label: "X2", kind: "number" },
    { id: "y2", label: "Y2", kind: "number" },
    { id: "z2", label: "Z2", kind: "number" },
  ],
  outputs: [{ id: "distance", label: "Distance", kind: "number" }],
  calculate: (input) => {
    return {
      distance: Math.sqrt(
        ((input.x2 as number) - (input.x1 as number)) ** 2 +
          ((input.y2 as number) - (input.y1 as number)) ** 2 +
          ((input.z2 as number) - (input.z1 as number)) ** 2,
      ),
    };
  },
});
export default Distance3dTool;
export const runDistance3d = Distance3dTool.execute;

export type Distance3dInput = {
  readonly x1: number;
  readonly y1: number;
  readonly z1: number;
  readonly x2: number;
  readonly y2: number;
  readonly z2: number;
};

export type Distance3dOutput = {
  readonly distance: number;
};

export const distance3dExample = {
  input: {
    x1: 1,
    y1: 1,
    z1: 1,
    x2: 1,
    y2: 1,
    z2: 1,
  },
  output: {
    distance: 0,
  },
} satisfies ToolExample<Distance3dInput, Distance3dOutput>;
