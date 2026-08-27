import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const EARTH_RADIUS_KM = 6371;

export type EpicentralDistanceInput = {
  readonly eventLatitudeDegrees: number;
  readonly eventLongitudeDegrees: number;
  readonly stationLatitudeDegrees: number;
  readonly stationLongitudeDegrees: number;
};

export type EpicentralDistanceOutput = {
  readonly centralAngleDegrees: number;
  readonly distanceKilometers: number;
};

const radians = (degrees: number): number => (degrees * Math.PI) / 180;

export const calculateEpicentralDistance = (
  input: EpicentralDistanceInput,
): EpicentralDistanceOutput => {
  for (const key of ["eventLatitudeDegrees", "stationLatitudeDegrees"] as const)
    if (!(input[key] >= -90 && input[key] <= 90))
      simpleError(
        key,
        "Latitudes must lie between -90 and 90 degrees.",
        "invalid_latitude",
      );
  for (const key of [
    "eventLongitudeDegrees",
    "stationLongitudeDegrees",
  ] as const)
    if (!(input[key] >= -180 && input[key] <= 180))
      simpleError(
        key,
        "Longitudes must lie between -180 and 180 degrees.",
        "invalid_longitude",
      );
  const phi1 = radians(input.eventLatitudeDegrees);
  const phi2 = radians(input.stationLatitudeDegrees);
  const deltaPhi = radians(
    input.stationLatitudeDegrees - input.eventLatitudeDegrees,
  );
  const deltaLambda = radians(
    input.stationLongitudeDegrees - input.eventLongitudeDegrees,
  );
  const haversine =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
  const centralAngleRadians =
    2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  return {
    centralAngleDegrees: centralAngleRadians * (180 / Math.PI),
    distanceKilometers: EARTH_RADIUS_KM * centralAngleRadians,
  };
};

export const epicentralDistanceExample = {
  input: {
    eventLatitudeDegrees: 0,
    eventLongitudeDegrees: 0,
    stationLatitudeDegrees: 0,
    stationLongitudeDegrees: 1,
  },
  output: { centralAngleDegrees: 1, distanceKilometers: 111.19492664455873 },
} satisfies ToolExample<EpicentralDistanceInput, EpicentralDistanceOutput>;

export const epicentralDistanceTool = createSimpleTool({
  id: "geology/epicentral-distance",
  title: "Epicentral Distance Calculator",
  description:
    "Great-circle epicentral distance from event to station via the haversine formula on a spherical Earth of mean radius 6371 km.",
  inputs: [
    {
      description: "Event latitude in decimal degrees.",
      id: "eventLatitudeDegrees",
      kind: "number",
      label: "Event latitude",
      maximum: 90,
      minimum: -90,
    },
    {
      description: "Event longitude in decimal degrees.",
      id: "eventLongitudeDegrees",
      kind: "number",
      label: "Event longitude",
      maximum: 180,
      minimum: -180,
    },
    {
      description: "Station latitude in decimal degrees.",
      id: "stationLatitudeDegrees",
      kind: "number",
      label: "Station latitude",
      maximum: 90,
      minimum: -90,
    },
    {
      description: "Station longitude in decimal degrees.",
      id: "stationLongitudeDegrees",
      kind: "number",
      label: "Station longitude",
      maximum: 180,
      minimum: -180,
    },
  ],
  outputs: [
    {
      description: "Great-circle central angle in degrees.",
      id: "centralAngleDegrees",
      kind: "number",
      label: "Central angle",
    },
    {
      description: "Epicentral distance along the surface in kilometers.",
      id: "distanceKilometers",
      kind: "number",
      label: "Distance",
    },
  ],
  calculate: (input) =>
    calculateEpicentralDistance(input as unknown as EpicentralDistanceInput),
});

export const runEpicentralDistance = epicentralDistanceTool.execute;
export default epicentralDistanceTool;
