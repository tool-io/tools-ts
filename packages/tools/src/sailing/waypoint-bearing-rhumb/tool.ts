import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WaypointBearingRhumbInput = {
  readonly fromLatitudeDeg: number;
  readonly fromLongitudeDeg: number;
  readonly toLatitudeDeg: number;
  readonly toLongitudeDeg: number;
};

export type WaypointBearingRhumbOutput = {
  readonly rhumbBearingDeg: number;
};

export const waypointBearingRhumbExample = {
  input: {
    fromLatitudeDeg: 51.5,
    fromLongitudeDeg: 0,
    toLatitudeDeg: 48.85,
    toLongitudeDeg: -2.35,
  },
  output: { rhumbBearingDeg: 209.5855446216006 },
} satisfies ToolExample<WaypointBearingRhumbInput, WaypointBearingRhumbOutput>;

export const waypointBearingRhumbTool = createSimpleTool({
  id: "sailing/waypoint-bearing-rhumb",
  title: "Waypoint Rhumb Bearing Calculator",
  description:
    "Calculate the constant rhumb line bearing from one geographic position to another.",
  inputs: [
    {
      id: "fromLatitudeDeg",
      kind: "number",
      label: "From latitude",
      maximum: 90,
      minimum: -90,
    },
    {
      id: "fromLongitudeDeg",
      kind: "number",
      label: "From longitude",
      maximum: 180,
      minimum: -180,
    },
    {
      id: "toLatitudeDeg",
      kind: "number",
      label: "To latitude",
      maximum: 90,
      minimum: -90,
    },
    {
      id: "toLongitudeDeg",
      kind: "number",
      label: "To longitude",
      maximum: 180,
      minimum: -180,
    },
  ],
  outputs: [{ id: "rhumbBearingDeg", kind: "number", label: "Rhumb bearing" }],
  calculate: (input) => {
    const toRad = Math.PI / 180;
    const fromLatitudeDeg = input.fromLatitudeDeg as number;
    const fromLongitudeDeg = input.fromLongitudeDeg as number;
    const toLatitudeDeg = input.toLatitudeDeg as number;
    const toLongitudeDeg = input.toLongitudeDeg as number;
    if (
      fromLatitudeDeg === toLatitudeDeg &&
      fromLongitudeDeg === toLongitudeDeg
    )
      simpleError("", "The two positions are identical.", "same_position");
    if (Math.abs(fromLatitudeDeg) === 90 || Math.abs(toLatitudeDeg) === 90)
      simpleError(
        "toLatitudeDeg",
        "A rhumb bearing is undefined at a geographic pole.",
        "polar_position",
      );
    let deltaLongitude = (toLongitudeDeg - fromLongitudeDeg) * toRad;
    if (Math.abs(deltaLongitude) > Math.PI)
      deltaLongitude += deltaLongitude > 0 ? -2 * Math.PI : 2 * Math.PI;
    const fromLatitudeRad = fromLatitudeDeg * toRad;
    const toLatitudeRad = toLatitudeDeg * toRad;
    const deltaMercatorLatitude = Math.log(
      Math.tan(Math.PI / 4 + toLatitudeRad / 2) /
        Math.tan(Math.PI / 4 + fromLatitudeRad / 2),
    );
    return {
      rhumbBearingDeg:
        ((Math.atan2(deltaLongitude, deltaMercatorLatitude) * 180) / Math.PI +
          360) %
        360,
    };
  },
});
export const runWaypointBearingRhumb = waypointBearingRhumbTool.execute;
export default waypointBearingRhumbTool;
