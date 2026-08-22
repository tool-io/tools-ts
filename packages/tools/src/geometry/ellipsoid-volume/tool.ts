import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const ellipsoidVolumeTool = createSimpleTool({
  id: "geometry/ellipsoid-volume",
  title: "Ellipsoid Volume Calculator",
  description:
    "Calculate the volume of an ellipsoid from its three semi-axes as (4/3)π·a·b·c.",
  inputs: [
    {
      description: "First semi-axis length.",
      id: "semiAxisA",
      label: "Semi-axis a",
      kind: "number",
      minimum: 0,
    },
    {
      description: "Second semi-axis length.",
      id: "semiAxisB",
      label: "Semi-axis b",
      kind: "number",
      minimum: 0,
    },
    {
      description: "Third semi-axis length.",
      id: "semiAxisC",
      label: "Semi-axis c",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [{ id: "volume", label: "Volume", kind: "number" }],
  calculate: (input) => {
    return {
      volume:
        (4 / 3) *
        Math.PI *
        (input.semiAxisA as number) *
        (input.semiAxisB as number) *
        (input.semiAxisC as number),
    };
  },
});
export const runEllipsoidVolume = ellipsoidVolumeTool.execute;
export default ellipsoidVolumeTool;

export type EllipsoidVolumeInput = {
  readonly semiAxisA: number;
  readonly semiAxisB: number;
  readonly semiAxisC: number;
};

export type EllipsoidVolumeOutput = {
  readonly volume: number;
};

export const ellipsoidVolumeExample = {
  input: {
    semiAxisA: 1,
    semiAxisB: 1,
    semiAxisC: 1,
  },
  output: {
    volume: 4.1887902047863905,
  },
} satisfies ToolExample<EllipsoidVolumeInput, EllipsoidVolumeOutput>;
