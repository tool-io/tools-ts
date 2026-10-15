import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  stationRadiusMeters: number;
  satelliteRadiusMeters: number;
  geocentricSeparationDegrees: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "stationRadiusMeters",
    label: "Station radius meters",
    kind: "number",
    unit: "m",
  },
  {
    id: "satelliteRadiusMeters",
    label: "Satellite radius meters",
    kind: "number",
    unit: "m",
  },
  {
    id: "geocentricSeparationDegrees",
    label: "Geocentric separation degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(
    i.stationRadiusMeters > 0 &&
      i.stationRadiusMeters <= 1e8 &&
      i.satelliteRadiusMeters > i.stationRadiusMeters &&
      i.satelliteRadiusMeters <= 1e9 &&
      i.geocentricSeparationDegrees >= 0 &&
      i.geocentricSeparationDegrees <= 180,
  );
  const angle = H.rad(i.geocentricSeparationDegrees),
    up = i.satelliteRadiusMeters * Math.cos(angle) - i.stationRadiusMeters,
    horizontal = i.satelliteRadiusMeters * Math.sin(angle);
  return H.finish({
    elevationDegrees: H.deg(Math.atan2(up, horizontal)),
    slantRangeMeters: Math.hypot(up, horizontal),
  });
};
export const example = {
  input: {
    stationRadiusMeters: 10,
    satelliteRadiusMeters: 20,
    geocentricSeparationDegrees: 0,
  },
  output: { result: { elevationDegrees: 90, slantRangeMeters: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Satellite Elevation Angle from Range Geometry Simplified Calculator",
      "surveying",
    ],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/satellite-elevation-range-simplified",
  title: "Satellite Elevation Angle from Range Geometry Simplified Calculator",
  description:
    "Compute spherical station satellite elevation and slant range from geocentric radii and central separation, retaining below-horizon elevations; no orbital propagation or atmospheric refraction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          elevationDegrees: { type: "number" },
          slantRangeMeters: { type: "number" },
        },
        required: ["elevationDegrees", "slantRangeMeters"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
