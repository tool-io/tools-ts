import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { rad, deg, j2Factor } from "../shared.js";

export type Input = Readonly<{
  readonly mu: number;
  readonly semimajorAxis: number;
  readonly eccentricity: number;
  readonly referenceRadius: number;
  readonly j2: number;
  readonly inclinationDegrees: number;
}>;
export type Output = Readonly<{
  readonly radiansPerSecond: number;
  readonly degreesPerDay: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.inclinationDegrees < 0 || input.inclinationDegrees > 180)
    simpleError("inclinationDegrees", "Inclination must be within [0,180].");
  const radiansPerSecond =
    -j2Factor(
      input.mu,
      input.semimajorAxis,
      input.eccentricity,
      input.referenceRadius,
      input.j2,
    ) * Math.cos(rad(input.inclinationDegrees));
  return { radiansPerSecond, degreesPerDay: deg(radiansPerSecond) * 86400 };
};
export const exampleInput = {
  mu: 1,
  semimajorAxis: 2,
  eccentricity: 0,
  referenceRadius: 1,
  j2: 0.01,
  inclinationDegrees: 0,
} satisfies Input;
export const exampleOutput = {
  radiansPerSecond: -0.0013258252147247767,
  degreesPerDay: -6563.305944785304,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/j2-nodal-precession",
  title: "J2 Nodal Precession",
  description:
    "Evaluate signed first-order J2 nodal precession for supplied mean elliptic elements in km and seconds.",
  inputs: [
    {
      id: "mu",
      label: "Mu",
      kind: "number",
      description:
        "Gravitational parameter, using the same distance and time units throughout; km³/s² for km and seconds.",
    },
    { id: "semimajorAxis", label: "Semimajor axis", kind: "number" },
    { id: "eccentricity", label: "Eccentricity", kind: "number" },
    { id: "referenceRadius", label: "Reference radius", kind: "number" },
    { id: "j2", label: "J 2", kind: "number" },
    { id: "inclinationDegrees", label: "Inclination degrees", kind: "number" },
  ],
  outputs: [
    { id: "radiansPerSecond", label: "Radians per second", kind: "number" },
    { id: "degreesPerDay", label: "Degrees per day", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      mu: value.mu as number,
      semimajorAxis: value.semimajorAxis as number,
      eccentricity: value.eccentricity as number,
      referenceRadius: value.referenceRadius as number,
      j2: value.j2 as number,
      inclinationDegrees: value.inclinationDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
