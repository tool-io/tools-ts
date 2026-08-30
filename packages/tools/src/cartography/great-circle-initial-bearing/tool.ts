import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GreatCircleInitialBearingInput = Readonly<{
  readonly latitude1Degrees: number;
  readonly longitude1Degrees: number;
  readonly latitude2Degrees: number;
  readonly longitude2Degrees: number;
}>;
export type GreatCircleInitialBearingOutput = Readonly<{
  readonly bearingDegrees: number;
}>;

export const calculateGreatCircleInitialBearing = (
  x: GreatCircleInitialBearingInput,
): GreatCircleInitialBearingOutput => {
  if (!Number.isFinite(x.latitude1Degrees))
    simpleError("latitude1Degrees", "Provide a finite number.");
  if (!Number.isFinite(x.longitude1Degrees))
    simpleError("longitude1Degrees", "Provide a finite number.");
  if (!Number.isFinite(x.latitude2Degrees))
    simpleError("latitude2Degrees", "Provide a finite number.");
  if (!Number.isFinite(x.longitude2Degrees))
    simpleError("longitude2Degrees", "Provide a finite number.");
  if (!(
    Math.abs(x.latitude1Degrees) <= 90 &&
    Math.abs(x.latitude2Degrees) <= 90 &&
    Math.abs(x.longitude1Degrees) <= 180 &&
    Math.abs(x.longitude2Degrees) <= 180 &&
    (x.latitude1Degrees !== x.latitude2Degrees ||
      x.longitude1Degrees !== x.longitude2Degrees)
  ))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const latitude1 = (x.latitude1Degrees * Math.PI) / 180;
  const latitude2 = (x.latitude2Degrees * Math.PI) / 180;
  const deltaLongitude =
    ((x.longitude2Degrees - x.longitude1Degrees) * Math.PI) / 180;
  const east = Math.sin(deltaLongitude) * Math.cos(latitude2);
  const north =
    Math.cos(latitude1) * Math.sin(latitude2) -
    Math.sin(latitude1) * Math.cos(latitude2) * Math.cos(deltaLongitude);
  if (Math.hypot(east, north) < 1e-12)
    simpleError(
      "input",
      "Initial bearing is undefined for coincident or antipodal points.",
    );
  const bearingDegrees =
    ((((Math.atan2(east, north) * 180) / Math.PI) % 360) + 360) % 360;
  if (!Number.isFinite(bearingDegrees))
    simpleError(
      "bearingDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { bearingDegrees: Object.is(bearingDegrees, -0) ? 0 : bearingDegrees };
};

export const example = {
  input: {
    latitude1Degrees: 0,
    longitude1Degrees: 0,
    latitude2Degrees: 0,
    longitude2Degrees: 90,
  },
  output: { bearingDegrees: 90 },
} satisfies ToolExample<
  GreatCircleInitialBearingInput,
  GreatCircleInitialBearingOutput
>;

export const tool = createSimpleTool({
  id: "cartography/great-circle-initial-bearing",
  title: "Great Circle Initial Bearing",
  description:
    "Initial spherical great-circle bearing from the first latitude/longitude to the second, normalized to [0,360).",
  inputs: [
    {
      id: "latitude1Degrees",
      kind: "number",
      label: "Latitude1Degrees",
      unit: "deg",
    },
    {
      id: "longitude1Degrees",
      kind: "number",
      label: "Longitude1Degrees",
      unit: "deg",
    },
    {
      id: "latitude2Degrees",
      kind: "number",
      label: "Latitude2Degrees",
      unit: "deg",
    },
    {
      id: "longitude2Degrees",
      kind: "number",
      label: "Longitude2Degrees",
      unit: "deg",
    },
  ],
  outputs: [
    {
      id: "bearingDegrees",
      kind: "number",
      label: "Bearing Degrees",
      unit: "deg",
    },
  ],
  calculate: (input) =>
    calculateGreatCircleInitialBearing({
      latitude1Degrees: input.latitude1Degrees as number,
      longitude1Degrees: input.longitude1Degrees as number,
      latitude2Degrees: input.latitude2Degrees as number,
      longitude2Degrees: input.longitude2Degrees as number,
    }),
});
export const greatCircleInitialBearingTool = tool;
export const runGreatCircleInitialBearing = tool.execute;
export default tool;
