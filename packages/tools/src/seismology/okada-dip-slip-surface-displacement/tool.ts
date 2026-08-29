import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const okadaDipSlipSurfaceDisplacementExample = {
  input: { slipM: 2, lengthKm: 100, widthKm: 50, dipDeg: 20 },
  output: {
    maxVerticalM: 0.45602685776755825,
    coseismicMomentNm: 300000000000000000000,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const okadaDipSlipSurfaceDisplacementTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ slipM, lengthKm, widthKm, dipDeg }) => {
      if (lengthKm <= 0 || widthKm <= 0)
        simpleError("lengthKm", "Fault length and width must be positive.");
      const rad = (dipDeg * Math.PI) / 180;
      const areaM2 = lengthKm * 1000 * widthKm * 1000;
      const moment = 3e10 * slipM * areaM2;
      const maxVerticalM =
        slipM * Math.sin(rad) * (widthKm / (lengthKm + widthKm)) * 2;
      return { maxVerticalM, coseismicMomentNm: moment };
    })(input as never) as Record<string, unknown>,
  description:
    "Seismic moment and average dislocation estimate for a dip-slip rupture: geodetic moment M₀ = μ·A·ū plus a heuristic vertical offset scale; this tool does NOT solve the Okada (1992) elastic half-space displacement field.",
  id: "seismology/okada-dip-slip-surface-displacement",
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
    {
      minimum: 0,
      maximum: 90,
      description: "Dip angle.",
      id: "dipDeg",
      kind: "number",
      label: "δ",
      unit: "°",
    },
  ],
  outputs: [
    {
      description:
        "Heuristic vertical offset scale (sin δ-weighted ū/2), not an Okada spatial solution.",
      id: "maxVerticalM",
      kind: "number",
      label: "u_z scale",
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
  title: "Dip-Slip Seismic Moment and Average Dislocation Estimate",
});
export const runOkadaDipSlipSurfaceDisplacement =
  okadaDipSlipSurfaceDisplacementTool.execute;
export { okadaDipSlipSurfaceDisplacementExample as example };
export default okadaDipSlipSurfaceDisplacementTool;
