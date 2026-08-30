import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, deg, j2Factor } from "../shared.js";

export type Input = Readonly<{
  readonly mu: number;
  readonly semimajorAxis: number;
  readonly eccentricity: number;
  readonly referenceRadius: number;
  readonly j2: number;
  readonly desiredRadiansPerSecond: number;
}>;
export type Output = Readonly<{
  readonly requiredInclinationDegrees: number;
}>;
export const calculate = (input: Input): Output => {
  const factor = j2Factor(
    input.mu,
    input.semimajorAxis,
    input.eccentricity,
    input.referenceRadius,
    input.j2,
  );
  positive(factor, "j2");
  const cosine = -input.desiredRadiansPerSecond / factor;
  if (Math.abs(cosine) > 1)
    simpleError(
      "desiredRadiansPerSecond",
      "Desired nodal rate is not feasible in the supplied first-order J2 model.",
    );
  return { requiredInclinationDegrees: deg(Math.acos(cosine)) };
};
export const exampleInput = {
  mu: 1,
  semimajorAxis: 2,
  eccentricity: 0,
  referenceRadius: 1,
  j2: 0.01,
  desiredRadiansPerSecond: 0,
} satisfies Input;
export const exampleOutput = {
  requiredInclinationDegrees: 90,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/sun-synchronous-inclination-solve",
  title: "Sun Synchronous Inclination Solve",
  description:
    "Invert first-order J2 nodal precession for an inclination matching a caller-supplied sun-synchronous target rate.",
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
    {
      id: "desiredRadiansPerSecond",
      label: "Desired radians per second",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "requiredInclinationDegrees",
      label: "Required inclination degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      mu: value.mu as number,
      semimajorAxis: value.semimajorAxis as number,
      eccentricity: value.eccentricity as number,
      referenceRadius: value.referenceRadius as number,
      j2: value.j2 as number,
      desiredRadiansPerSecond: value.desiredRadiansPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
