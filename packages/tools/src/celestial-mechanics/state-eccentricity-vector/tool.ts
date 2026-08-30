import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, vector, norm, cross } from "../shared.js";

export type Input = Readonly<{
  readonly position: readonly number[];
  readonly velocity: readonly number[];
  readonly mu: number;
}>;
export type Output = Readonly<{
  readonly eccentricityVector: readonly number[];
  readonly eccentricityMagnitude: number;
  readonly conicClass: string;
}>;
export const calculate = (input: Input): Output => {
  vector(input.position, "position");
  vector(input.velocity, "velocity");
  positive(input.mu, "mu");
  const r = positive(norm(input.position), "position"),
    h = cross(input.position, input.velocity);
  positive(norm(h), "velocity");
  const vxh = cross(input.velocity, h),
    eccentricityVector = vxh.map(
      (v, i) => v / input.mu - input.position[i] / r,
    ),
    eccentricityMagnitude = norm(eccentricityVector);
  return {
    eccentricityVector,
    eccentricityMagnitude,
    conicClass:
      eccentricityMagnitude < 1
        ? "elliptic"
        : eccentricityMagnitude > 1
          ? "hyperbolic"
          : "parabolic",
  };
};
export const exampleInput = {
  position: [1, 0, 0],
  velocity: [0, 1, 0],
  mu: 1,
} satisfies Input;
export const exampleOutput = {
  eccentricityVector: [0, 0, 0],
  eccentricityMagnitude: 0,
  conicClass: "elliptic",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/state-eccentricity-vector",
  title: "State Eccentricity Vector",
  description:
    "Derive the eccentricity vector and mathematical conic class from a nonradial two-body Cartesian state; floating values near one require physical uncertainty assessment.",
  inputs: [
    { id: "position", label: "Position", kind: "numberList" },
    { id: "velocity", label: "Velocity", kind: "numberList" },
    {
      id: "mu",
      label: "Mu",
      kind: "number",
      description:
        "Gravitational parameter, using the same distance and time units throughout; km³/s² for km and seconds.",
    },
  ],
  outputs: [
    {
      id: "eccentricityVector",
      label: "Eccentricity vector",
      kind: "numberList",
    },
    {
      id: "eccentricityMagnitude",
      label: "Eccentricity magnitude",
      kind: "number",
    },
    { id: "conicClass", label: "Conic class", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      position: value.position as readonly number[],
      velocity: value.velocity as readonly number[],
      mu: value.mu as number,
    }),
});
export const run = tool.execute;
export default tool;
