import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SubstrateWarpageInput = {
  readonly curvaturePerMeter: number;
  readonly panelDiagonalMm: number;
};

export type SubstrateWarpageOutput = {
  readonly warpageUm: number;
};

export const substrateWarpageExample = {
  input: { curvaturePerMeter: 0.01, panelDiagonalMm: 500 },
  output: { warpageUm: 312.5004882827759 },
} satisfies ToolExample<SubstrateWarpageInput, SubstrateWarpageOutput>;

export const substrateWarpageTool = createSimpleTool({
  calculate: (input) => {
    const diagonal = input.panelDiagonalMm as number;
    if (!(diagonal > 0))
      simpleError(
        "panelDiagonalMm",
        "Panel diagonal must be positive.",
        "invalid_panel_diagonal",
      );
    const curvaturePerMeter = input.curvaturePerMeter as number;
    if (!(curvaturePerMeter > 0))
      simpleError(
        "curvaturePerMeter",
        "Curvature magnitude must be positive.",
        "invalid_curvature",
      );
    const radiusMeters = 1 / curvaturePerMeter;
    const halfChordMeters = diagonal / 2000;
    if (!(radiusMeters > halfChordMeters))
      simpleError(
        "curvaturePerMeter",
        "Curvature radius must exceed half the panel diagonal.",
        "invalid_curvature",
      );
    const root = Math.sqrt(
      radiusMeters * radiusMeters - halfChordMeters * halfChordMeters,
    );
    return {
      warpageUm:
        (halfChordMeters * halfChordMeters * 1e6) / (radiusMeters + root),
    };
  },
  description:
    "Calculate package-substrate warpage as the circular-arc sagitta from measured curvature magnitude and panel diagonal.",
  id: "semiconductor/substrate-warpage",
  inputs: [
    {
      description: "Magnitude of the measured panel curvature.",
      id: "curvaturePerMeter",
      kind: "number",
      label: "Curvature",
      unit: "m^-1",
    },
    {
      description: "Diagonal length of the substrate panel.",
      id: "panelDiagonalMm",
      kind: "number",
      label: "Panel diagonal",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Center-to-edge sagitta magnitude for a circular arc.",
      id: "warpageUm",
      kind: "number",
      label: "Warpage",
      unit: "µm",
    },
  ],
  title: "Substrate Curvature Warpage Calculator",
});
export const runSubstrateWarpage = substrateWarpageTool.execute;
export default substrateWarpageTool;
