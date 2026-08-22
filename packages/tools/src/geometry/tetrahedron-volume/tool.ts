import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const tetrahedronVolumeTool = createSimpleTool({
  id: "geometry/tetrahedron-volume",
  title: "Regular Tetrahedron Volume Calculator",
  description:
    "Calculate the volume of a regular tetrahedron from its edge length as a³/(6√2).",
  inputs: [
    {
      description: "Edge length of the tetrahedron.",
      id: "edge",
      label: "Edge",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [{ id: "volume", label: "Volume", kind: "number" }],
  calculate: (input) => {
    const edge = input.edge as number;
    return { volume: edge ** 3 / (6 * Math.SQRT2) };
  },
});
export const runTetrahedronVolume = tetrahedronVolumeTool.execute;
export default tetrahedronVolumeTool;

export type TetrahedronVolumeInput = {
  readonly edge: number;
};

export type TetrahedronVolumeOutput = {
  readonly volume: number;
};

export const tetrahedronVolumeExample = {
  input: {
    edge: 1,
  },
  output: {
    volume: 0.1178511301977579,
  },
} satisfies ToolExample<TetrahedronVolumeInput, TetrahedronVolumeOutput>;
