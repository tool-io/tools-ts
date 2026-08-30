import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { rad, rotate, skyVector, skyAngles } from "../shared.js";

export type Input = Readonly<{
  readonly longitudeDegrees: number;
  readonly latitudeDegrees: number;
  readonly obliquityDegrees: number;
  readonly direction: string;
}>;
export type Output = Readonly<{
  readonly transformedLongitudeDegrees: number;
  readonly transformedLatitudeDegrees: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.obliquityDegrees < 0 ||
    input.obliquityDegrees > 90 ||
    !["equatorial-to-ecliptic", "ecliptic-to-equatorial"].includes(
      input.direction,
    )
  )
    simpleError(
      "direction",
      "A supported frame direction and obliquity in [0,90] degrees required.",
    );
  const v = skyVector(input.longitudeDegrees, input.latitudeDegrees),
    rotated = rotate(
      v,
      [1, 0, 0],
      rad(input.obliquityDegrees) *
        (input.direction === "equatorial-to-ecliptic" ? -1 : 1),
    ),
    angles = skyAngles(rotated);
  return {
    transformedLongitudeDegrees: angles[0],
    transformedLatitudeDegrees: angles[1],
  };
};
export const exampleInput = {
  longitudeDegrees: 90,
  latitudeDegrees: 0,
  obliquityDegrees: 30,
  direction: "equatorial-to-ecliptic",
} satisfies Input;
export const exampleOutput = {
  transformedLongitudeDegrees: 90,
  transformedLatitudeDegrees: -30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/equatorial-ecliptic-axis-rotation",
  title: "Equatorial Ecliptic Axis Rotation",
  description:
    "Rotate a sky direction between equatorial and ecliptic axes using supplied obliquity; the same epoch must be used for both frames.",
  inputs: [
    { id: "longitudeDegrees", label: "Longitude degrees", kind: "number" },
    { id: "latitudeDegrees", label: "Latitude degrees", kind: "number" },
    { id: "obliquityDegrees", label: "Obliquity degrees", kind: "number" },
    { id: "direction", label: "Direction", kind: "string" },
  ],
  outputs: [
    {
      id: "transformedLongitudeDegrees",
      label: "Transformed longitude degrees",
      kind: "number",
    },
    {
      id: "transformedLatitudeDegrees",
      label: "Transformed latitude degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      longitudeDegrees: value.longitudeDegrees as number,
      latitudeDegrees: value.latitudeDegrees as number,
      obliquityDegrees: value.obliquityDegrees as number,
      direction: value.direction as string,
    }),
});
export const run = tool.execute;
export default tool;
