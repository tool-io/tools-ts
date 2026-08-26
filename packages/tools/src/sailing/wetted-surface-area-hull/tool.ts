import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WettedSurfaceAreaHullInput = {
  readonly displacementTonnes: number;
  readonly wettedCoefficient?: number;
};

export type WettedSurfaceAreaHullOutput = {
  readonly wettedSurfaceAreaM2: number;
};

const DEFAULT_WETTED_COEFFICIENT = 2.5;

export const wettedSurfaceAreaHullExample = {
  input: { displacementTonnes: 8 },
  output: { wettedSurfaceAreaM2: 10 },
} satisfies ToolExample<
  WettedSurfaceAreaHullInput,
  WettedSurfaceAreaHullOutput
>;

export const wettedSurfaceAreaHullTool = createSimpleTool({
  calculate: (input) => {
    const displacementTonnes = input.displacementTonnes as number;
    if (displacementTonnes <= 0)
      simpleError(
        "displacementTonnes",
        "Displacement must be positive.",
        "invalid_displacement",
      );
    return {
      wettedSurfaceAreaM2:
        Math.cbrt(displacementTonnes) ** 2 *
        (input.wettedCoefficient as number),
    };
  },
  description:
    "Estimate wetted surface from displacement using wettedSurfaceAreaM2 = displacementTonnes^(2/3) * wettedCoefficient with a default coefficient of 2.5.",
  id: "sailing/wetted-surface-area-hull",
  inputs: [
    {
      description: "Displacement of the hull in tonnes.",
      id: "displacementTonnes",
      kind: "number",
      label: "Displacement",
      minimum: 0,
      unit: "t",
    },
    {
      default: DEFAULT_WETTED_COEFFICIENT,
      description: "Wetted surface scaling coefficient between 1 and 4.",
      id: "wettedCoefficient",
      kind: "number",
      label: "Wetted coefficient",
      maximum: 4,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Estimated area of the hull wetted surface.",
      format: "area-m2",
      id: "wettedSurfaceAreaM2",
      kind: "number",
      label: "Wetted surface area",
      unit: "m\u00B2",
    },
  ],
  title: "Wetted Surface Estimate",
});
export const runWettedSurfaceAreaHull = wettedSurfaceAreaHullTool.execute;
export default wettedSurfaceAreaHullTool;
