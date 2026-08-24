import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HaversineDistanceInput = {
  readonly startLatitudeDeg: number;
  readonly startLongitudeDeg: number;
  readonly endLatitudeDeg: number;
  readonly endLongitudeDeg: number;
};

export type HaversineDistanceOutput = {
  readonly distanceM: number;
};

export const calculateHaversineDistance = (
  input: HaversineDistanceInput,
): HaversineDistanceOutput => {
  const toRad = Math.PI / 180;
  const phi1 = input.startLatitudeDeg * toRad;
  const phi2 = input.endLatitudeDeg * toRad;
  const dPhi = (input.endLatitudeDeg - input.startLatitudeDeg) * toRad;
  const dLambda = (input.endLongitudeDeg - input.startLongitudeDeg) * toRad;
  const aRaw =
    Math.sin(dPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2;
  const a = Math.min(1, Math.max(0, aRaw));
  return {
    distanceM: 6371008.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
  };
};

export const haversineDistanceExample = {
  input: {
    startLatitudeDeg: 51.5074,
    startLongitudeDeg: -0.1278,
    endLatitudeDeg: 48.8566,
    endLongitudeDeg: 2.3522,
  },
  output: {
    distanceM: 343556.5348808833,
  },
} satisfies ToolExample<HaversineDistanceInput, HaversineDistanceOutput>;

export const haversineDistanceTool = createSimpleTool({
  id: "geography/haversine-distance",
  title: "Haversine Distance Calculator",
  description:
    "Calculate the great-circle distance between two points on a spherical Earth of mean radius 6371008.8 m using the haversine formula.",
  inputs: [
    {
      description: "Latitude of the start point in decimal degrees.",
      id: "startLatitudeDeg",
      kind: "number",
      label: "Start latitude",
      minimum: -90,
      maximum: 90,
    },
    {
      description: "Longitude of the start point in decimal degrees.",
      id: "startLongitudeDeg",
      kind: "number",
      label: "Start longitude",
      minimum: -180,
      maximum: 180,
    },
    {
      description: "Latitude of the end point in decimal degrees.",
      id: "endLatitudeDeg",
      kind: "number",
      label: "End latitude",
      minimum: -90,
      maximum: 90,
    },
    {
      description: "Longitude of the end point in decimal degrees.",
      id: "endLongitudeDeg",
      kind: "number",
      label: "End longitude",
      minimum: -180,
      maximum: 180,
    },
  ],
  outputs: [
    {
      description: "Great-circle distance in meters.",
      id: "distanceM",
      kind: "number",
      label: "Distance",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateHaversineDistance({
      endLatitudeDeg: input.endLatitudeDeg as number,
      endLongitudeDeg: input.endLongitudeDeg as number,
      startLatitudeDeg: input.startLatitudeDeg as number,
      startLongitudeDeg: input.startLongitudeDeg as number,
    }),
});

export const runHaversineDistance = haversineDistanceTool.execute;
export default haversineDistanceTool;
