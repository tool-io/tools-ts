import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DistanceMode =
  | "2d-euclidean"
  | "3d-euclidean"
  | "geographic-haversine"
  | "geographic-lambert";

export type DistanceInput = {
  readonly mode: DistanceMode;
  readonly point1A: number;
  readonly point1B: number;
  readonly point1Z?: number;
  readonly point2A: number;
  readonly point2B: number;
  readonly point2Z?: number;
};

const earthMeanRadiusKm = 6371.0088;
const wgs84SemiMajorAxisKm = 6378.137;
const wgs84Flattening = 1 / 298.257223563;
const radians = (degrees: number): number => (degrees * Math.PI) / 180;

const centralAngle = (
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number,
): number => {
  const latitudeDifference = latitude2 - latitude1;
  const longitudeDifference = longitude2 - longitude1;
  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(latitude1) *
      Math.cos(latitude2) *
      Math.sin(longitudeDifference / 2) ** 2;
  const normalized = Math.min(1, Math.max(0, haversine));
  return 2 * Math.atan2(Math.sqrt(normalized), Math.sqrt(1 - normalized));
};

const validCoordinates = (input: DistanceInput): boolean =>
  input.point1A >= -90 &&
  input.point1A <= 90 &&
  input.point2A >= -90 &&
  input.point2A <= 90 &&
  input.point1B >= -180 &&
  input.point1B <= 180 &&
  input.point2B >= -180 &&
  input.point2B <= 180;

const calculateHaversine = (input: DistanceInput): number =>
  earthMeanRadiusKm *
  centralAngle(
    radians(input.point1A),
    radians(input.point1B),
    radians(input.point2A),
    radians(input.point2B),
  );

const calculateLambert = (input: DistanceInput): number | null => {
  const beta1 = Math.atan(
    (1 - wgs84Flattening) * Math.tan(radians(input.point1A)),
  );
  const beta2 = Math.atan(
    (1 - wgs84Flattening) * Math.tan(radians(input.point2A)),
  );
  const sigma = centralAngle(
    beta1,
    radians(input.point1B),
    beta2,
    radians(input.point2B),
  );
  if (sigma === 0) return 0;
  const cosineHalfSigmaSquared = Math.cos(sigma / 2) ** 2;
  const sineHalfSigmaSquared = Math.sin(sigma / 2) ** 2;
  if (
    cosineHalfSigmaSquared <= Number.EPSILON ||
    sineHalfSigmaSquared <= Number.EPSILON
  )
    return null;
  const meanLatitude = (beta1 + beta2) / 2;
  const halfLatitudeDifference = (beta2 - beta1) / 2;
  const x =
    ((sigma - Math.sin(sigma)) *
      Math.sin(meanLatitude) ** 2 *
      Math.cos(halfLatitudeDifference) ** 2) /
    cosineHalfSigmaSquared;
  const y =
    ((sigma + Math.sin(sigma)) *
      Math.cos(meanLatitude) ** 2 *
      Math.sin(halfLatitudeDifference) ** 2) /
    sineHalfSigmaSquared;
  const distance =
    wgs84SemiMajorAxisKm * (sigma - (wgs84Flattening / 2) * (x + y));
  return Number.isFinite(distance) && distance >= 0 ? distance : null;
};

export const calculateDistance = (input: DistanceInput): number | null => {
  const values = [
    input.point1A,
    input.point1B,
    input.point2A,
    input.point2B,
    input.point1Z,
    input.point2Z,
  ];
  if (values.some((value) => value !== undefined && !Number.isFinite(value)))
    return null;
  if (input.mode === "2d-euclidean") {
    if (input.point1Z !== undefined || input.point2Z !== undefined) return null;
    return Math.hypot(
      input.point2A - input.point1A,
      input.point2B - input.point1B,
    );
  }
  if (input.mode === "3d-euclidean") {
    if (input.point1Z === undefined || input.point2Z === undefined) return null;
    return Math.hypot(
      input.point2A - input.point1A,
      input.point2B - input.point1B,
      input.point2Z - input.point1Z,
    );
  }
  if (
    (input.mode === "geographic-haversine" ||
      input.mode === "geographic-lambert") &&
    input.point1Z === undefined &&
    input.point2Z === undefined &&
    validCoordinates(input)
  )
    return input.mode === "geographic-haversine"
      ? calculateHaversine(input)
      : calculateLambert(input);
  return null;
};

export const distanceExample = {
  input: {
    mode: "2d-euclidean",
    point1A: 0,
    point1B: 0,
    point2A: 3,
    point2B: 4,
  },
  output: { distance: 5 },
} satisfies ToolExample<DistanceInput, { readonly distance: number }>;

export const distanceTool = createSimpleTool({
  id: "geometry/distance",
  title: "2D, 3D, and Geographic Distance Calculator",
  description:
    "Calculate Euclidean distance in two or three dimensions or geographic distance with Haversine or Andoyer-Lambert.",
  inputs: [
    {
      enum: [
        "2d-euclidean",
        "3d-euclidean",
        "geographic-haversine",
        "geographic-lambert",
      ],
      id: "mode",
      kind: "string",
      label: "Distance calculation",
    },
    { id: "point1A", kind: "number", label: "Point 1: X or latitude" },
    { id: "point1B", kind: "number", label: "Point 1: Y or longitude" },
    { id: "point1Z", kind: "number", label: "Point 1: Z", required: false },
    { id: "point2A", kind: "number", label: "Point 2: X or latitude" },
    { id: "point2B", kind: "number", label: "Point 2: Y or longitude" },
    { id: "point2Z", kind: "number", label: "Point 2: Z", required: false },
  ],
  outputs: [{ id: "distance", kind: "number", label: "Distance" }],
  calculate: (input) => {
    const distance = calculateDistance(input as DistanceInput);
    if (distance === null || !Number.isFinite(distance))
      simpleError(
        "mode",
        "Enter coordinates valid for the selected calculation.",
      );
    return { distance };
  },
});

export const runDistance = distanceTool.execute;
export default distanceTool;
