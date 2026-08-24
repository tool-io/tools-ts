import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BoundingBoxInput = {
  readonly centerLatitudeDeg: number;
  readonly centerLongitudeDeg: number;
  readonly radiusM: number;
};

export type BoundingBoxOutput = {
  readonly minLatitudeDeg: number;
  readonly maxLatitudeDeg: number;
  readonly minLongitudeDeg: number;
  readonly maxLongitudeDeg: number;
  readonly crossesPoles: boolean;
};

export const calculateBoundingBox = (
  input: BoundingBoxInput,
): BoundingBoxOutput => {
  if (!(input.radiusM > 0))
    return simpleError("radiusM", "Radius must be positive.", "invalid_radius");
  if (!(input.radiusM <= 20015114.442035925))
    return simpleError(
      "radiusM",
      "Radius must not exceed half of Earth's circumference (about 20 015 km).",
      "radius_too_large",
    );
  const toRad = Math.PI / 180;
  const angularRadius = input.radiusM / 6371008.8;
  const latDeltaDeg = (angularRadius * 180) / Math.PI;
  const crossesPoles = Math.abs(input.centerLatitudeDeg) + latDeltaDeg >= 90;
  const lonDeltaDeg = crossesPoles
    ? 180
    : (Math.asin(
        Math.sin(angularRadius) / Math.cos(input.centerLatitudeDeg * toRad),
      ) *
        180) /
      Math.PI;
  return {
    minLatitudeDeg: Math.max(-90, input.centerLatitudeDeg - latDeltaDeg),
    maxLatitudeDeg: Math.min(90, input.centerLatitudeDeg + latDeltaDeg),
    minLongitudeDeg: input.centerLongitudeDeg - lonDeltaDeg,
    maxLongitudeDeg: input.centerLongitudeDeg + lonDeltaDeg,
    crossesPoles,
  };
};

export const boundingBoxExample = {
  input: {
    centerLatitudeDeg: 48.8566,
    centerLongitudeDeg: 2.3522,
    radiusM: 10000,
  },
  output: {
    minLatitudeDeg: 48.76666796362755,
    maxLatitudeDeg: 48.94653203637245,
    minLongitudeDeg: 2.2155138528863,
    maxLongitudeDeg: 2.4888861471137,
    crossesPoles: false,
  },
} satisfies ToolExample<BoundingBoxInput, BoundingBoxOutput>;

export const boundingBoxTool = createSimpleTool({
  id: "geography/bounding-box",
  title: "Geographic Bounding Box Calculator",
  description:
    "Compute the latitude and unwrapped longitude extents of a radius around a center point on a spherical Earth of mean radius 6371008.8 m. Longitude bounds may fall outside −180° to 180° when the interval crosses the antimeridian.",
  inputs: [
    {
      description: "Latitude of the box center in decimal degrees.",
      id: "centerLatitudeDeg",
      kind: "number",
      label: "Center latitude",
      minimum: -90,
      maximum: 90,
    },
    {
      description: "Longitude of the box center in decimal degrees.",
      id: "centerLongitudeDeg",
      kind: "number",
      label: "Center longitude",
      minimum: -180,
      maximum: 180,
    },
    {
      description: "Radius of the circular region in meters.",
      id: "radiusM",
      kind: "number",
      label: "Radius",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Southern edge of the box in decimal degrees.",
      id: "minLatitudeDeg",
      kind: "number",
      label: "Minimum latitude",
    },
    {
      description: "Northern edge of the box in decimal degrees.",
      id: "maxLatitudeDeg",
      kind: "number",
      label: "Maximum latitude",
    },
    {
      description:
        "Western edge of the unwrapped interval; may be below −180° across the antimeridian.",
      id: "minLongitudeDeg",
      kind: "number",
      label: "Minimum longitude",
    },
    {
      description:
        "Eastern edge of the unwrapped interval; may exceed 180° across the antimeridian.",
      id: "maxLongitudeDeg",
      kind: "number",
      label: "Maximum longitude",
    },
    {
      description:
        "True when the circle contains a pole and spans all longitudes.",
      id: "crossesPoles",
      kind: "boolean",
      label: "Crosses poles",
    },
  ],
  calculate: (input) =>
    calculateBoundingBox({
      centerLatitudeDeg: input.centerLatitudeDeg as number,
      centerLongitudeDeg: input.centerLongitudeDeg as number,
      radiusM: input.radiusM as number,
    }),
});

export const runBoundingBox = boundingBoxTool.execute;
export default boundingBoxTool;
