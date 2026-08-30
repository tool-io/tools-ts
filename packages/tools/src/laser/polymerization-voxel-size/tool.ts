import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly lateralDiameterNanometers: number;
  readonly axialLengthNanometers: number;
}>;
export type Output = Readonly<{
  readonly aspectRatio: number;
  readonly ellipsoidVolumeCubicNanometers: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.lateralDiameterNanometers <= 0)
    simpleError(
      "lateralDiameterNanometers",
      "Lateral diameter must be positive.",
      "invalid_diameter",
    );
  return {
    aspectRatio: input.axialLengthNanometers / input.lateralDiameterNanometers,
    ellipsoidVolumeCubicNanometers:
      (Math.PI / 6) *
      input.lateralDiameterNanometers ** 2 *
      input.axialLengthNanometers,
  };
};

export const exampleInput = {
  lateralDiameterNanometers: 2,
  axialLengthNanometers: 3,
} satisfies Input;
export const exampleOutput = {
  aspectRatio: 1.5,
  ellipsoidVolumeCubicNanometers: 6.283185307179586,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      lateralDiameterNanometers: input.lateralDiameterNanometers as number,
      axialLengthNanometers: input.axialLengthNanometers as number,
    }),
  description:
    "Calculate two-photon-polymerization voxel aspect ratio and ellipsoidal volume.",
  id: "laser/polymerization-voxel-size",
  inputs: [
    {
      id: "lateralDiameterNanometers",
      label: "Lateral voxel diameter",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "axialLengthNanometers",
      label: "Axial voxel length",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
  ],
  outputs: [
    {
      id: "aspectRatio",
      label: "Axial-to-lateral aspect ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "ellipsoidVolumeCubicNanometers",
      label: "Ellipsoidal voxel volume",
      kind: "number",
      minimum: 0,
      unit: "nm³",
    },
  ],
  title: "Polymerization Voxel Size",
});

export const run = tool.execute;
export default tool;
