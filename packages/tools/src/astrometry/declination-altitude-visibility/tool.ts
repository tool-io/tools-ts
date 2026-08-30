import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { rad, deg, clamp } from "../shared.js";

export type Input = Readonly<{
  readonly latitudeDegrees: number;
  readonly declinationDegrees: number;
  readonly altitudeBoundaryDegrees: number;
}>;
export type Output = Readonly<{
  readonly minimumAltitudeDegrees: number;
  readonly maximumAltitudeDegrees: number;
  readonly visibility: string;
}>;
export const calculate = (input: Input): Output => {
  if (
    Math.abs(input.latitudeDegrees) > 90 ||
    Math.abs(input.declinationDegrees) > 90 ||
    Math.abs(input.altitudeBoundaryDegrees) > 90
  )
    simpleError(
      "latitudeDegrees",
      "Latitude, declination and altitude boundary must lie within ±90 degrees.",
    );
  const a =
      Math.sin(rad(input.latitudeDegrees)) *
      Math.sin(rad(input.declinationDegrees)),
    b =
      Math.cos(rad(input.latitudeDegrees)) *
      Math.cos(rad(input.declinationDegrees)),
    minimumAltitudeDegrees = deg(Math.asin(clamp(a - b))),
    maximumAltitudeDegrees = deg(Math.asin(clamp(a + b)));
  return {
    minimumAltitudeDegrees,
    maximumAltitudeDegrees,
    visibility:
      minimumAltitudeDegrees > input.altitudeBoundaryDegrees
        ? "always-above"
        : maximumAltitudeDegrees < input.altitudeBoundaryDegrees
          ? "never-above"
          : "crosses-or-touches",
  };
};
export const exampleInput = {
  latitudeDegrees: 60,
  declinationDegrees: 40,
  altitudeBoundaryDegrees: 0,
} satisfies Input;
export const exampleOutput = {
  minimumAltitudeDegrees: 10,
  maximumAltitudeDegrees: 70,
  visibility: "always-above",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/declination-altitude-visibility",
  title: "Declination Altitude Visibility",
  description:
    "Compute geometric daily altitude extrema and visibility relative to a supplied horizon boundary, including both circumpolar and never-rising cases; refraction is excluded.",
  inputs: [
    { id: "latitudeDegrees", label: "Latitude degrees", kind: "number" },
    { id: "declinationDegrees", label: "Declination degrees", kind: "number" },
    {
      id: "altitudeBoundaryDegrees",
      label: "Altitude boundary degrees",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "minimumAltitudeDegrees",
      label: "Minimum altitude degrees",
      kind: "number",
    },
    {
      id: "maximumAltitudeDegrees",
      label: "Maximum altitude degrees",
      kind: "number",
    },
    { id: "visibility", label: "Visibility", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      latitudeDegrees: value.latitudeDegrees as number,
      declinationDegrees: value.declinationDegrees as number,
      altitudeBoundaryDegrees: value.altitudeBoundaryDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
