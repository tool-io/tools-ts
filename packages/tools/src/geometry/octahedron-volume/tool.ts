import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const octahedronVolumeTool = createSimpleTool({
  id: "geometry/octahedron-volume",
  title: "Regular Octahedron Volume Calculator",
  description:
    "Calculate the volume of a regular octahedron from its edge length as (√2/3)·a³.",
  inputs: [
    {
      description: "Edge length of the octahedron.",
      id: "edge",
      label: "Edge",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [{ id: "volume", label: "Volume", kind: "number" }],
  calculate: (input) => {
    const edge = input.edge as number;
    return { volume: (Math.SQRT2 / 3) * edge ** 3 };
  },
});
export const runOctahedronVolume = octahedronVolumeTool.execute;
export default octahedronVolumeTool;

export type OctahedronVolumeInput = {
  readonly edge: number;
};

export type OctahedronVolumeOutput = {
  readonly volume: number;
};

export const octahedronVolumeExample = {
  input: {
    edge: 1,
  },
  output: {
    volume: 0.47140452079103173,
  },
} satisfies ToolExample<OctahedronVolumeInput, OctahedronVolumeOutput>;
