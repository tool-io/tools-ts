import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UnitCellVolumeInput = {
  readonly edgeAPicometers: number;
  readonly edgeBPicometers: number;
  readonly edgeCPicometers: number;
};

export type UnitCellVolumeOutput = {
  readonly volumeCubicPicometers: number;
};

export const unitCellVolumeExample = {
  input: {
    edgeAPicometers: 500,
    edgeBPicometers: 400,
    edgeCPicometers: 300,
  },
  output: { volumeCubicPicometers: 60000000 },
} satisfies ToolExample<UnitCellVolumeInput, UnitCellVolumeOutput>;

export const calculateUnitCellVolume = (
  input: UnitCellVolumeInput,
): UnitCellVolumeOutput => {
  if (
    input.edgeAPicometers <= 0 ||
    input.edgeBPicometers <= 0 ||
    input.edgeCPicometers <= 0
  )
    simpleError(
      "edgeAPicometers",
      "All cell edges must be positive.",
      "invalid_value",
    );
  return {
    volumeCubicPicometers:
      input.edgeAPicometers * input.edgeBPicometers * input.edgeCPicometers,
  };
};

export const UnitCellVolumeTool = createSimpleTool({
  calculate: (input) =>
    calculateUnitCellVolume(input as unknown as UnitCellVolumeInput),
  description:
    "Compute the orthogonal unit cell volume as the product of the three lattice edges; equal edges give the cubic cell volume.",
  id: "chemistry/unit-cell-volume",
  inputs: [
    {
      description: "First lattice edge length in picometres.",
      id: "edgeAPicometers",
      kind: "number",
      label: "Edge a",
      minimum: 0,
      unit: "pm",
    },
    {
      description: "Second lattice edge length in picometres.",
      id: "edgeBPicometers",
      kind: "number",
      label: "Edge b",
      minimum: 0,
      unit: "pm",
    },
    {
      description: "Third lattice edge length in picometres.",
      id: "edgeCPicometers",
      kind: "number",
      label: "Edge c",
      minimum: 0,
      unit: "pm",
    },
  ],
  outputs: [
    {
      description: "Volume enclosed by the unit cell.",
      id: "volumeCubicPicometers",
      kind: "number",
      label: "Unit cell volume",
      unit: "pm³",
    },
  ],
  title: "Unit Cell Volume Calculator",
});
export const runUnitCellVolume = UnitCellVolumeTool.execute;
export default UnitCellVolumeTool;
