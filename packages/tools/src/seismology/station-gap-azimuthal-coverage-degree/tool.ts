import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const stationGapAzimuthalCoverageDegreeExample = {
  input: { azimuthsDeg: [0, 90, 180, 270] },
  output: { maxGapDeg: 90, coverageQuality: "good" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const stationGapAzimuthalCoverageDegreeTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ azimuthsDeg }) => {
      const az = [...(azimuthsDeg as number[])]
        .map((a) => ((a % 360) + 360) % 360)
        .sort((a, b) => a - b);
      if (az.length < 2)
        simpleError("azimuthsDeg", "Need at least two stations.");
      let maxGapDeg = 360 - az[az.length - 1] + az[0];
      for (let i = 1; i < az.length; i++)
        maxGapDeg = Math.max(maxGapDeg, az[i] - az[i - 1]);
      const coverageQuality =
        maxGapDeg > 180 ? "poor" : maxGapDeg > 90 ? "fair" : "good";
      return { maxGapDeg, coverageQuality };
    })(input as never) as Record<string, unknown>,
  description:
    "Largest azimuthal gap between consecutive stations around an epicenter.",
  id: "seismology/station-gap-azimuthal-coverage-degree",
  inputs: [
    {
      description: "Station azimuths in degrees (0–360).",
      id: "azimuthsDeg",
      kind: "numberList",
      label: "az",
    },
  ],
  outputs: [
    {
      description: "Largest azimuthal gap.",
      id: "maxGapDeg",
      kind: "number",
      label: "Gap",
      unit: "°",
    },
    {
      description: "Coverage quality rating.",
      id: "coverageQuality",
      kind: "string",
      label: "Quality",
    },
  ],
  title: "Station Gap Azimuthal Coverage Degree Calculator",
});
export const runStationGapAzimuthalCoverageDegree =
  stationGapAzimuthalCoverageDegreeTool.execute;
export { stationGapAzimuthalCoverageDegreeExample as example };
export default stationGapAzimuthalCoverageDegreeTool;
