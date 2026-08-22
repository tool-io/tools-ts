import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const CuboidVolumeTool = createSimpleTool({
  id: "geometry/cuboid-volume",
  title: "Cuboid Volume Calculator",
  description: "Compute volume of a cuboid as length*width*height.",
  inputs: [
    { id: "length", label: "Length", kind: "number", minimum: 0 },
    { id: "width", label: "Width", kind: "number", minimum: 0 },
    { id: "height", label: "Height", kind: "number", minimum: 0 },
  ],
  outputs: [{ id: "volume", label: "Volume", kind: "number" }],
  calculate: (input) => {
    return {
      volume:
        (input.length as number) *
        (input.width as number) *
        (input.height as number),
    };
  },
});
export default CuboidVolumeTool;
export const runCuboidVolume = CuboidVolumeTool.execute;

export type CuboidVolumeInput = {
  readonly length: number;
  readonly width: number;
  readonly height: number;
};

export type CuboidVolumeOutput = {
  readonly volume: number;
};

export const cuboidVolumeExample = {
  input: {
    length: 1,
    width: 1,
    height: 1,
  },
  output: {
    volume: 1,
  },
} satisfies ToolExample<CuboidVolumeInput, CuboidVolumeOutput>;
