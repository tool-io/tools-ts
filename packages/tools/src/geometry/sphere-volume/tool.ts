import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const sphereVolumeExample = {
  input: { radius: 3 },
  output: { volume: 113.09733552923254 },
} satisfies ToolExample<SphereVolumeInput, SphereVolumeOutput>;

export type SphereVolumeInput = { readonly radius: number };
export type SphereVolumeOutput = { readonly volume: number };

export const calculateSphereVolume = (
  input: SphereVolumeInput,
): SphereVolumeOutput => {
  if (input.radius < 0)
    simpleError("radius", "The radius must be positive.", "invalid_radius");
  return { volume: (4 / 3) * Math.PI * input.radius ** 3 };
};

export const sphereVolumeTool = createSimpleTool({
  calculate: (input) =>
    calculateSphereVolume(input as unknown as SphereVolumeInput),
  description: "Compute the volume of a sphere from its radius.",
  id: "geometry/sphere-volume",
  inputs: [{ id: "radius", kind: "number", label: "Radius", minimum: 0 }],
  outputs: [{ id: "volume", kind: "number", label: "Volume" }],
  title: "Sphere Volume Calculator",
});
export const runSphereVolume = sphereVolumeTool.execute;
export default sphereVolumeTool;
