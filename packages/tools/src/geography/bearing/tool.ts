import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BearingInput = {
  readonly startLatitudeDeg: number;
  readonly startLongitudeDeg: number;
  readonly endLatitudeDeg: number;
  readonly endLongitudeDeg: number;
};

export type BearingOutput = {
  readonly initialBearingDeg: number;
};

export const calculateBearing = (input: BearingInput): BearingOutput => {
  const toRad = Math.PI / 180;
  const phi1 = input.startLatitudeDeg * toRad;
  const phi2 = input.endLatitudeDeg * toRad;
  const dLambda = (input.endLongitudeDeg - input.startLongitudeDeg) * toRad;
  const y = Math.sin(dLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLambda);
  if (Math.abs(x) < 1e-15 && Math.abs(y) < 1e-15)
    simpleError(
      "endLatitudeDeg",
      "The initial bearing is undefined for coincident or antipodal points.",
    );
  return {
    initialBearingDeg: ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360,
  };
};

export const bearingExample = {
  input: {
    startLatitudeDeg: 51.5074,
    startLongitudeDeg: -0.1278,
    endLatitudeDeg: 48.8566,
    endLongitudeDeg: 2.3522,
  },
  output: {
    initialBearingDeg: 148.1156168710533,
  },
} satisfies ToolExample<BearingInput, BearingOutput>;

export const bearingTool = createSimpleTool({
  id: "geography/bearing",
  title: "Geographic Bearing Calculator",
  description:
    "Calculate the initial forward azimuth in degrees from a start point to an end point on a spherical Earth.",
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
      description:
        "Initial bearing measured clockwise from true north, in degrees within [0, 360).",
      id: "initialBearingDeg",
      kind: "number",
      label: "Initial bearing",
      unit: "deg",
    },
  ],
  calculate: (input) =>
    calculateBearing({
      endLatitudeDeg: input.endLatitudeDeg as number,
      endLongitudeDeg: input.endLongitudeDeg as number,
      startLatitudeDeg: input.startLatitudeDeg as number,
      startLongitudeDeg: input.startLongitudeDeg as number,
    }),
});

export const runBearing = bearingTool.execute;
export default bearingTool;
