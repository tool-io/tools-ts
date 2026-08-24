import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WaferBowInput = {
  readonly curvatureRadiusMeters: number;
  readonly waferDiameterMm: number;
};

export type WaferBowOutput = {
  readonly bowUm: number;
};

export const waferBowExample = {
  input: { curvatureRadiusMeters: 100, waferDiameterMm: 300 },
  output: { bowUm: 112.50006328132119 },
} satisfies ToolExample<WaferBowInput, WaferBowOutput>;

export const waferBowTool = createSimpleTool({
  calculate: (input) => {
    const diameterMm = input.waferDiameterMm as number;
    if (!(diameterMm > 0))
      simpleError(
        "waferDiameterMm",
        "Wafer diameter must be positive.",
        "invalid_diameter",
      );
    const radius = input.curvatureRadiusMeters as number;
    const halfChordMeters = (diameterMm * 1e-3) / 2;
    if (!(radius > halfChordMeters))
      simpleError(
        "curvatureRadiusMeters",
        "Curvature radius must exceed half the chord length.",
        "invalid_curvature_radius",
      );
    const root = Math.sqrt(radius ** 2 - halfChordMeters ** 2);
    return {
      bowUm: (halfChordMeters * halfChordMeters * 1e6) / (radius + root),
    };
  },
  description:
    "Compute the sagitta bow of a wafer from its diameter and the radius of curvature of its free-form deformation.",
  id: "semiconductor/wafer-bow",
  inputs: [
    {
      description: "Radius of curvature of the best-fit sphere over the wafer.",
      id: "curvatureRadiusMeters",
      kind: "number",
      label: "Curvature radius",
      unit: "m",
    },
    {
      description: "Chord length across the wafer.",
      id: "waferDiameterMm",
      kind: "number",
      label: "Wafer diameter",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Sagitta magnitude at the wafer center.",
      id: "bowUm",
      kind: "number",
      label: "Bow",
      unit: "µm",
    },
  ],
  title: "Wafer Bow Calculator",
});
export const runWaferBow = waferBowTool.execute;
export default waferBowTool;
