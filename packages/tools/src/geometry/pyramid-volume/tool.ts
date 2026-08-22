import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const pyramidVolumeTool = createSimpleTool({
  id: "geometry/pyramid-volume",
  title: "Square Pyramid Volume Calculator",
  description:
    "Calculate the volume of a right square pyramid from its base edge and perpendicular height as (a²·h)/3.",
  inputs: [
    {
      description: "Base edge length.",
      id: "baseEdge",
      label: "Base edge",
      kind: "number",
      minimum: 0,
    },
    {
      description: "Perpendicular height.",
      id: "height",
      label: "Height",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [{ id: "volume", label: "Volume", kind: "number" }],
  calculate: (input) => {
    return {
      volume: ((input.baseEdge as number) ** 2 * (input.height as number)) / 3,
    };
  },
});
export const runPyramidVolume = pyramidVolumeTool.execute;
export default pyramidVolumeTool;

export type PyramidVolumeInput = {
  readonly baseEdge: number;
  readonly height: number;
};

export type PyramidVolumeOutput = {
  readonly volume: number;
};

export const pyramidVolumeExample = {
  input: {
    baseEdge: 1,
    height: 1,
  },
  output: {
    volume: 0.3333333333333333,
  },
} satisfies ToolExample<PyramidVolumeInput, PyramidVolumeOutput>;
