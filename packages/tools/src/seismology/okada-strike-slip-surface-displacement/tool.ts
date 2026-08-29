import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const okadaStrikeSlipSurfaceDisplacementExample = {
  input: { slipM: 4, lengthKm: 120, widthKm: 15 },
  output: { peakHorizontalM: 2, coseismicMomentNm: 216000000000000000000 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const okadaStrikeSlipSurfaceDisplacementTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ slipM, lengthKm, widthKm }) => {
      if (lengthKm <= 0 || widthKm <= 0)
        simpleError("lengthKm", "Fault length and width must be positive.");
      const moment = 3e10 * slipM * lengthKm * 1000 * widthKm * 1000;
      return { peakHorizontalM: slipM * 0.5, coseismicMomentNm: moment };
    })(input as never) as Record<string, unknown>,
  description:
    "Seismic moment and average dislocation estimate for a strike-slip rupture: geodetic moment M₀ = μ·A·ū and a half-slip (ū/2) offset scale; this heuristic does NOT compute the Okada (1992) elastic half-space spatial displacement field.",
  id: "seismology/okada-strike-slip-surface-displacement",
  inputs: [
    {
      minimum: 0,
      description: "Average slip.",
      id: "slipM",
      kind: "number",
      label: "u",
      unit: "m",
    },
    {
      minimum: 0,
      description: "Fault length.",
      id: "lengthKm",
      kind: "number",
      label: "L",
      unit: "km",
    },
    {
      minimum: 0,
      description: "Fault width.",
      id: "widthKm",
      kind: "number",
      label: "W",
      unit: "km",
    },
  ],
  outputs: [
    {
      description:
        "Half-slip horizontal offset scale (ū/2), not an Okada spatial solution.",
      id: "peakHorizontalM",
      kind: "number",
      label: "ū/2 scale",
      unit: "m",
    },
    {
      description: "Geodetic moment μ·A·ū.",
      id: "coseismicMomentNm",
      kind: "number",
      label: "M₀",
      unit: "N·m",
    },
  ],
  title: "Strike-Slip Seismic Moment and Average Dislocation Estimate",
});
export const runOkadaStrikeSlipSurfaceDisplacement =
  okadaStrikeSlipSurfaceDisplacementTool.execute;
export { okadaStrikeSlipSurfaceDisplacementExample as example };
export default okadaStrikeSlipSurfaceDisplacementTool;
