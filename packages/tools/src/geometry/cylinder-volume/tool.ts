import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const cylinderVolumeExample = {
  input: { height: 5, radius: 2 },
  output: { volume: 20 * Math.PI },
} satisfies ToolExample<CylinderVolumeInput, CylinderVolumeOutput>;

export type CylinderVolumeInput = {
  readonly radius: number;
  readonly height: number;
};
export type CylinderVolumeOutput = { readonly volume: number };

export const calculateCylinderVolume = (
  input: CylinderVolumeInput,
): CylinderVolumeOutput => {
  if (input.radius < 0 || input.height < 0)
    simpleError(
      "radius",
      "Radius and height must be positive.",
      "invalid_input",
    );
  return { volume: Math.PI * input.radius ** 2 * input.height };
};

export const cylinderVolumeTool = createSimpleTool({
  calculate: (input) =>
    calculateCylinderVolume(input as unknown as CylinderVolumeInput),
  description: "Compute the volume of a cylinder from its radius and height.",
  id: "geometry/cylinder-volume",
  inputs: [
    { id: "radius", kind: "number", label: "Radius", minimum: 0 },
    { id: "height", kind: "number", label: "Height", minimum: 0 },
  ],
  outputs: [{ id: "volume", kind: "number", label: "Volume" }],
  title: "Cylinder Volume Calculator",
});
export const runCylinderVolume = cylinderVolumeTool.execute;
export default cylinderVolumeTool;
