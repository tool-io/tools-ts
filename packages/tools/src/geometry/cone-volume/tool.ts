import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const coneVolumeExample = {
  input: { height: 6, radius: 2 },
  output: { volume: 8 * Math.PI },
} satisfies ToolExample<ConeVolumeInput, ConeVolumeOutput>;

export type ConeVolumeInput = {
  readonly radius: number;
  readonly height: number;
};
export type ConeVolumeOutput = { readonly volume: number };

export const calculateConeVolume = (
  input: ConeVolumeInput,
): ConeVolumeOutput => {
  if (input.radius < 0 || input.height < 0)
    simpleError(
      "radius",
      "Radius and height must be positive.",
      "invalid_input",
    );
  return { volume: (Math.PI * input.radius ** 2 * input.height) / 3 };
};

export const coneVolumeTool = createSimpleTool({
  calculate: (input) =>
    calculateConeVolume(input as unknown as ConeVolumeInput),
  description: "Compute the volume of a cone from its base radius and height.",
  id: "geometry/cone-volume",
  inputs: [
    { id: "radius", kind: "number", label: "Base radius", minimum: 0 },
    { id: "height", kind: "number", label: "Height", minimum: 0 },
  ],
  outputs: [{ id: "volume", kind: "number", label: "Volume" }],
  title: "Cone Volume Calculator",
});
export const runConeVolume = coneVolumeTool.execute;
export default coneVolumeTool;
