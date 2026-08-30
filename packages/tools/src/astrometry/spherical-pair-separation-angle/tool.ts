import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { rad, deg, wrap, norm, dot, cross, skyVector } from "../shared.js";

export type Input = Readonly<{
  readonly firstRaDegrees: number;
  readonly firstDecDegrees: number;
  readonly secondRaDegrees: number;
  readonly secondDecDegrees: number;
}>;
export type Output = Readonly<{
  readonly separationDegrees: number;
  readonly positionAngleDegrees: number;
}>;
export const calculate = (input: Input): Output => {
  const u = skyVector(input.firstRaDegrees, input.firstDecDegrees),
    v = skyVector(input.secondRaDegrees, input.secondDecDegrees),
    sine = norm(cross(u, v));
  if (sine < 1e-14)
    simpleError(
      "secondRaDegrees",
      "Position angle is undefined for coincident or antipodal directions.",
    );
  const da = rad(input.secondRaDegrees - input.firstRaDegrees),
    d1 = rad(input.firstDecDegrees),
    d2 = rad(input.secondDecDegrees),
    y = Math.cos(d2) * Math.sin(da),
    x =
      Math.cos(d1) * Math.sin(d2) - Math.sin(d1) * Math.cos(d2) * Math.cos(da);
  return {
    separationDegrees: deg(Math.atan2(sine, dot(u, v))),
    positionAngleDegrees: wrap(deg(Math.atan2(y, x))),
  };
};
export const exampleInput = {
  firstRaDegrees: 0,
  firstDecDegrees: 0,
  secondRaDegrees: 90,
  secondDecDegrees: 0,
} satisfies Input;
export const exampleOutput = {
  separationDegrees: 90,
  positionAngleDegrees: 90,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/spherical-pair-separation-angle",
  title: "Spherical Pair Separation Angle",
  description:
    "Compute robust great-circle separation and first-to-second position angle east of north, rejecting directionally undefined coincident/antipodal pairs.",
  inputs: [
    { id: "firstRaDegrees", label: "First ra degrees", kind: "number" },
    { id: "firstDecDegrees", label: "First dec degrees", kind: "number" },
    { id: "secondRaDegrees", label: "Second ra degrees", kind: "number" },
    { id: "secondDecDegrees", label: "Second dec degrees", kind: "number" },
  ],
  outputs: [
    { id: "separationDegrees", label: "Separation degrees", kind: "number" },
    {
      id: "positionAngleDegrees",
      label: "Position angle degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstRaDegrees: value.firstRaDegrees as number,
      firstDecDegrees: value.firstDecDegrees as number,
      secondRaDegrees: value.secondRaDegrees as number,
      secondDecDegrees: value.secondDecDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
