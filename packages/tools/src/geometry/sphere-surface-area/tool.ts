import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const SphereSurfaceAreaTool = createSimpleTool({
  id: "geometry/sphere-surface-area",
  title: "Sphere Surface Area Calculator",
  description: "Compute surface area of a sphere as 4*pi*r^2.",
  inputs: [{ id: "radius", label: "Radius", kind: "number", minimum: 0 }],
  outputs: [{ id: "surfaceArea", label: "Surface area", kind: "number" }],
  calculate: (input) => {
    return { surfaceArea: 4 * Math.PI * (input.radius as number) ** 2 };
  },
});
export default SphereSurfaceAreaTool;
export const runSphereSurfaceArea = SphereSurfaceAreaTool.execute;

export type SphereSurfaceAreaInput = {
  readonly radius: number;
};

export type SphereSurfaceAreaOutput = {
  readonly surfaceArea: number;
};

export const sphereSurfaceAreaExample = {
  input: {
    radius: 1,
  },
  output: {
    surfaceArea: 12.566370614359172,
  },
} satisfies ToolExample<SphereSurfaceAreaInput, SphereSurfaceAreaOutput>;
