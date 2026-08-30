import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, rad, deg } from "../shared.js";

export type Input = Readonly<{
  readonly latitudeDegrees: number;
  readonly declinationDegrees: number;
  readonly hourAngleDegrees: number;
  readonly hourAngleRateRadiansPerSecond: number;
}>;
export type Output = Readonly<{
  readonly parallacticAngleDegrees: number;
  readonly rotationDegreesPerSecond: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    Math.abs(input.latitudeDegrees) >= 90 ||
    Math.abs(input.declinationDegrees) > 90
  )
    simpleError(
      "latitudeDegrees",
      "Nonpolar latitude and declination within ±90 degrees required.",
    );
  const phi = rad(input.latitudeDegrees),
    d = rad(input.declinationDegrees),
    H = rad(input.hourAngleDegrees),
    y = Math.sin(H),
    x = Math.tan(phi) * Math.cos(d) - Math.sin(d) * Math.cos(H),
    den = x * x + y * y;
  positive(den, "hourAngleDegrees");
  return {
    parallacticAngleDegrees: deg(Math.atan2(y, x)),
    rotationDegreesPerSecond: deg(
      ((Math.tan(phi) * Math.cos(d) * Math.cos(H) - Math.sin(d)) / den) *
        input.hourAngleRateRadiansPerSecond,
    ),
  };
};
export const exampleInput = {
  latitudeDegrees: 45,
  declinationDegrees: 0,
  hourAngleDegrees: 0,
  hourAngleRateRadiansPerSecond: 0.0001,
} satisfies Input;
export const exampleOutput = {
  parallacticAngleDegrees: 0,
  rotationDegreesPerSecond: 0.005729577951308233,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/parallactic-angle-field-rotation",
  title: "Parallactic Angle Field Rotation",
  description:
    "Evaluate parallactic angle and its analytic time derivative from a supplied hour-angle rate; the zenith singularity and exact geographic poles are excluded.",
  inputs: [
    { id: "latitudeDegrees", label: "Latitude degrees", kind: "number" },
    { id: "declinationDegrees", label: "Declination degrees", kind: "number" },
    { id: "hourAngleDegrees", label: "Hour angle degrees", kind: "number" },
    {
      id: "hourAngleRateRadiansPerSecond",
      label: "Hour angle rate radians per second",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "parallacticAngleDegrees",
      label: "Parallactic angle degrees",
      kind: "number",
    },
    {
      id: "rotationDegreesPerSecond",
      label: "Rotation degrees per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      latitudeDegrees: value.latitudeDegrees as number,
      declinationDegrees: value.declinationDegrees as number,
      hourAngleDegrees: value.hourAngleDegrees as number,
      hourAngleRateRadiansPerSecond:
        value.hourAngleRateRadiansPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
