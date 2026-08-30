import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, vector, norm } from "../shared.js";

export type Input = Readonly<{
  readonly firstPosition: readonly number[];
  readonly secondPosition: readonly number[];
  readonly mu: number;
  readonly timeOfFlight: number;
}>;
export type Output = Readonly<{
  readonly parabolicTimeBound: number;
  readonly ellipticTimeAboveBound: boolean;
}>;
export const calculate = (input: Input): Output => {
  vector(input.firstPosition, "firstPosition");
  vector(input.secondPosition, "secondPosition");
  positive(input.mu, "mu");
  positive(input.timeOfFlight, "timeOfFlight");
  const r1 = positive(norm(input.firstPosition), "firstPosition"),
    r2 = positive(norm(input.secondPosition), "secondPosition"),
    chord = positive(
      norm(input.firstPosition.map((v, i) => v - input.secondPosition[i])),
      "secondPosition",
    ),
    s = (r1 + r2 + chord) / 2;
  const parabolicTimeBound =
    (Math.sqrt(2 / input.mu) / 3) * (s ** 1.5 - Math.max(0, s - chord) ** 1.5);
  return {
    parabolicTimeBound,
    ellipticTimeAboveBound: input.timeOfFlight > parabolicTimeBound,
  };
};
export const exampleInput = {
  firstPosition: [1, 0, 0],
  secondPosition: [0, 1, 0],
  mu: 1,
  timeOfFlight: 2,
} satisfies Input;
export const exampleOutput = {
  parabolicTimeBound: 0.9767170884383225,
  ellipticTimeAboveBound: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/shortway-elliptic-lambert-time-bound",
  title: "Shortway Elliptic Lambert Time Bound",
  description:
    "Screen the zero-revolution short-way elliptic Lambert branch against its parabolic time limit; faster hyperbolic transfers may remain possible, so this is not overall feasibility.",
  inputs: [
    { id: "firstPosition", label: "First position", kind: "numberList" },
    { id: "secondPosition", label: "Second position", kind: "numberList" },
    {
      id: "mu",
      label: "Mu",
      kind: "number",
      description:
        "Gravitational parameter, using the same distance and time units throughout; km³/s² for km and seconds.",
    },
    { id: "timeOfFlight", label: "Time of flight", kind: "number" },
  ],
  outputs: [
    { id: "parabolicTimeBound", label: "Parabolic time bound", kind: "number" },
    {
      id: "ellipticTimeAboveBound",
      label: "Elliptic time above bound",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      firstPosition: value.firstPosition as readonly number[],
      secondPosition: value.secondPosition as readonly number[],
      mu: value.mu as number,
      timeOfFlight: value.timeOfFlight as number,
    }),
});
export const run = tool.execute;
export default tool;
