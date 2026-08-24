import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type DestinationPointInput = {
  readonly latitudeDeg: number;
  readonly longitudeDeg: number;
  readonly bearingDeg: number;
  readonly distanceM: number;
};

export type DestinationPointOutput = {
  readonly destinationLatitudeDeg: number;
  readonly destinationLongitudeDeg: number;
};

export const calculateDestinationPoint = (
  input: DestinationPointInput,
): DestinationPointOutput => {
  const toRad = Math.PI / 180;
  const phi1 = input.latitudeDeg * toRad;
  const lambda1 = input.longitudeDeg * toRad;
  const theta = input.bearingDeg * toRad;
  const delta = input.distanceM / 6371008.8;
  const phi2 = Math.asin(
    Math.sin(phi1) * Math.cos(delta) +
      Math.cos(phi1) * Math.sin(delta) * Math.cos(theta),
  );
  const lambda2 =
    lambda1 +
    Math.atan2(
      Math.sin(theta) * Math.sin(delta) * Math.cos(phi1),
      Math.cos(delta) - Math.sin(phi1) * Math.sin(phi2),
    );
  return {
    destinationLatitudeDeg: (phi2 * 180) / Math.PI,
    destinationLongitudeDeg: (((lambda2 * 180) / Math.PI + 540) % 360) - 180,
  };
};

export const destinationPointExample = {
  input: {
    latitudeDeg: 52.2053,
    longitudeDeg: 0.1191,
    bearingDeg: 90,
    distanceM: 100000,
  },
  output: {
    destinationLatitudeDeg: 52.196200375310696,
    destinationLongitudeDeg: 1.5863777044695553,
  },
} satisfies ToolExample<DestinationPointInput, DestinationPointOutput>;

export const destinationPointTool = createSimpleTool({
  id: "geography/destination-point",
  title: "Destination Point Calculator",
  description:
    "Compute the destination latitude and longitude reached when traveling a given distance from a start point along a fixed initial bearing on a spherical Earth of mean radius 6371008.8 m.",
  inputs: [
    {
      description: "Latitude of the start point in decimal degrees.",
      id: "latitudeDeg",
      kind: "number",
      label: "Start latitude",
      minimum: -90,
      maximum: 90,
    },
    {
      description: "Longitude of the start point in decimal degrees.",
      id: "longitudeDeg",
      kind: "number",
      label: "Start longitude",
      minimum: -180,
      maximum: 180,
    },
    {
      description:
        "Initial bearing measured clockwise from true north, in degrees.",
      id: "bearingDeg",
      kind: "number",
      label: "Bearing",
      minimum: 0,
      maximum: 360,
    },
    {
      description: "Travel distance along the great circle in meters.",
      id: "distanceM",
      kind: "number",
      label: "Distance",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Latitude of the destination point in decimal degrees.",
      id: "destinationLatitudeDeg",
      kind: "number",
      label: "Destination latitude",
    },
    {
      description:
        "Longitude of the destination point in decimal degrees within [-180, 180).",
      id: "destinationLongitudeDeg",
      kind: "number",
      label: "Destination longitude",
    },
  ],
  calculate: (input) =>
    calculateDestinationPoint({
      bearingDeg: input.bearingDeg as number,
      distanceM: input.distanceM as number,
      latitudeDeg: input.latitudeDeg as number,
      longitudeDeg: input.longitudeDeg as number,
    }),
});

export const runDestinationPoint = destinationPointTool.execute;
export default destinationPointTool;
