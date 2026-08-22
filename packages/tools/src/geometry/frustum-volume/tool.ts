import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const frustumVolumeTool = createSimpleTool({
  id: "geometry/frustum-volume",
  title: "Frustum Volume Calculator",
  description:
    "Calculate the volume of a conical frustum as (π·h/3)·(R²+R·r+r²).",
  inputs: [
    {
      description: "Radius of the larger base.",
      id: "radiusTop",
      label: "Top radius",
      kind: "number",
      minimum: 0,
    },
    {
      description: "Radius of the smaller base.",
      id: "radiusBottom",
      label: "Bottom radius",
      kind: "number",
      minimum: 0,
    },
    {
      description: "Perpendicular height.",
      id: "height",
      label: "Height",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [{ id: "volume", label: "Volume", kind: "number" }],
  calculate: (input) => {
    const top = input.radiusTop as number;
    const bottom = input.radiusBottom as number;
    return {
      volume:
        ((Math.PI * (input.height as number)) / 3) *
        (top * top + top * bottom + bottom * bottom),
    };
  },
});
export const runFrustumVolume = frustumVolumeTool.execute;
export default frustumVolumeTool;

export type FrustumVolumeInput = {
  readonly radiusTop: number;
  readonly radiusBottom: number;
  readonly height: number;
};

export type FrustumVolumeOutput = {
  readonly volume: number;
};

export const frustumVolumeExample = {
  input: {
    radiusTop: 1,
    radiusBottom: 1,
    height: 1,
  },
  output: {
    volume: 3.141592653589793,
  },
} satisfies ToolExample<FrustumVolumeInput, FrustumVolumeOutput>;
