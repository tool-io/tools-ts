import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { rad, deg, wrap, clamp } from "../shared.js";

export type Input = Readonly<{
  readonly latitudeDegrees: number;
  readonly declinationDegrees: number;
  readonly hourAngleDegrees: number;
}>;
export type Output = Readonly<{
  readonly altitudeDegrees: number;
  readonly azimuthDegrees: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    Math.abs(input.latitudeDegrees) > 90 ||
    Math.abs(input.declinationDegrees) > 90
  )
    simpleError(
      "declinationDegrees",
      "Latitude and declination must lie within ±90 degrees.",
    );
  const phi = rad(input.latitudeDegrees),
    d = rad(input.declinationDegrees),
    H = rad(input.hourAngleDegrees),
    east = -Math.cos(d) * Math.sin(H),
    north =
      Math.sin(d) * Math.cos(phi) - Math.cos(d) * Math.cos(H) * Math.sin(phi),
    up =
      Math.sin(d) * Math.sin(phi) + Math.cos(d) * Math.cos(H) * Math.cos(phi);
  if (Math.hypot(east, north) < 1e-14)
    simpleError(
      "hourAngleDegrees",
      "Azimuth is undefined at the zenith or nadir.",
    );
  return {
    altitudeDegrees: deg(Math.asin(clamp(up))),
    azimuthDegrees: wrap(deg(Math.atan2(east, north))),
  };
};
export const exampleInput = {
  latitudeDegrees: 45,
  declinationDegrees: 0,
  hourAngleDegrees: 0,
} satisfies Input;
export const exampleOutput = {
  altitudeDegrees: 45,
  azimuthDegrees: 180,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/equatorial-horizontal-coordinates",
  title: "Equatorial Horizontal Coordinates",
  description:
    "Transform geometric hour angle and declination to altitude and azimuth north-through-east; no refraction or time-to-hour-angle conversion is inferred.",
  inputs: [
    { id: "latitudeDegrees", label: "Latitude degrees", kind: "number" },
    { id: "declinationDegrees", label: "Declination degrees", kind: "number" },
    { id: "hourAngleDegrees", label: "Hour angle degrees", kind: "number" },
  ],
  outputs: [
    { id: "altitudeDegrees", label: "Altitude degrees", kind: "number" },
    { id: "azimuthDegrees", label: "Azimuth degrees", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      latitudeDegrees: value.latitudeDegrees as number,
      declinationDegrees: value.declinationDegrees as number,
      hourAngleDegrees: value.hourAngleDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
