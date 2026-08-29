import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const tsunamiRunupEmpiricalOkalSynolakisLookupExample = {
  input: { magnitudeMw: 8, shoreDistanceKm: 1000 },
  output: { runupMeters: 7.924465962305569, hazardBand: "destructive" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const tsunamiRunupEmpiricalOkalSynolakisLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ magnitudeMw, shoreDistanceKm }) => {
      if (shoreDistanceKm <= 0)
        simpleError("shoreDistanceKm", "Distance must be positive.");
      const runupMeters =
        (0.05 * Math.pow(10, 0.5 * magnitudeMw)) /
        Math.pow(shoreDistanceKm, 0.6);
      return {
        runupMeters,
        hazardBand:
          runupMeters >= 3
            ? "destructive"
            : runupMeters >= 1
              ? "damaging"
              : runupMeters >= 0.3
                ? "noticeable"
                : "negligible",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "First-order far-field tsunami runup scaling with magnitude and distance (heuristic exponents).",
  id: "seismology/tsunami-runup-empirical-okal-synolakis-lookup",
  inputs: [
    {
      description: "Source magnitude.",
      id: "magnitudeMw",
      kind: "number",
      label: "M",
    },
    {
      minimum: 0,
      description: "Distance from source to shore.",
      id: "shoreDistanceKm",
      kind: "number",
      label: "R",
      unit: "km",
    },
  ],
  outputs: [
    {
      description: "Estimated maximum runup.",
      id: "runupMeters",
      kind: "number",
      label: "R_u",
      unit: "m",
    },
    {
      description: "Qualitative hazard band.",
      id: "hazardBand",
      kind: "string",
      label: "Band",
    },
  ],
  title: "Tsunami Runup Empirical Okal Synolakis Lookup",
});
export const runTsunamiRunupEmpiricalOkalSynolakisLookup =
  tsunamiRunupEmpiricalOkalSynolakisLookupTool.execute;
export { tsunamiRunupEmpiricalOkalSynolakisLookupExample as example };
export default tsunamiRunupEmpiricalOkalSynolakisLookupTool;
