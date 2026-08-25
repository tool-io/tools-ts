import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type EpirbDetectionRangeInput = {
  readonly satelliteAltitudeKm?: number;
};

export type EpirbDetectionRangeOutput = {
  readonly coverageRadiusNm: number;
};

const DEFAULT_SATELLITE_ALTITUDE_KM = 850;
const EARTH_RADIUS_KM = 6371.0088;
const KM_PER_NAUTICAL_MILE = 1.852;

export const epirbDetectionRangeExample = {
  input: { satelliteAltitudeKm: 850 },
  output: { coverageRadiusNm: 1685.962564825905 },
} satisfies ToolExample<EpirbDetectionRangeInput, EpirbDetectionRangeOutput>;

export const calculateEpirbDetectionRange = (
  input: EpirbDetectionRangeInput,
): EpirbDetectionRangeOutput => {
  const altitudeKm = input.satelliteAltitudeKm ?? DEFAULT_SATELLITE_ALTITUDE_KM;
  return {
    coverageRadiusNm:
      (EARTH_RADIUS_KM *
        Math.acos(EARTH_RADIUS_KM / (EARTH_RADIUS_KM + altitudeKm))) /
      KM_PER_NAUTICAL_MILE,
  };
};

export const epirbDetectionRangeTool = createSimpleTool({
  calculate: (input) =>
    calculateEpirbDetectionRange(input as unknown as EpirbDetectionRangeInput),
  description:
    "Calculate the geometric horizon footprint of an EPIRB search-and-rescue satellite from its orbital altitude. Actual detection also depends on the satellite network, beacon view, and link conditions.",
  id: "sailing/epirb-detection-range",
  inputs: [
    {
      default: DEFAULT_SATELLITE_ALTITUDE_KM,
      description:
        "Altitude of the receiving satellite above mean Earth radius.",
      id: "satelliteAltitudeKm",
      kind: "number",
      label: "Satellite altitude",
      minimum: 0,
      unit: "km",
    },
  ],
  outputs: [
    {
      description:
        "Maximum Earth-surface radius visible to the satellite at the geometric horizon.",
      format: "length-nm",
      id: "coverageRadiusNm",
      kind: "number",
      label: "Coverage radius",
      unit: "NM",
    },
  ],
  title: "EPIRB Satellite Footprint Radius",
});
export const runEpirbDetectionRange = epirbDetectionRangeTool.execute;
export default epirbDetectionRangeTool;
