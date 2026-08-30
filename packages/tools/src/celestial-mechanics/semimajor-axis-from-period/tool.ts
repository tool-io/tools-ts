import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly mu: number;
  readonly orbitalPeriod: number;
}>;
export type Output = Readonly<{
  readonly semimajorAxis: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.mu, "mu");
  positive(input.orbitalPeriod, "orbitalPeriod");
  return {
    semimajorAxis: Math.cbrt(
      input.mu * (input.orbitalPeriod / (2 * Math.PI)) ** 2,
    ),
  };
};
export const exampleInput = {
  mu: 1,
  orbitalPeriod: 6.283185307179586,
} satisfies Input;
export const exampleOutput = { semimajorAxis: 1 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/semimajor-axis-from-period",
  title: "Semimajor Axis From Period",
  description:
    "Invert Kepler third law for a positive elliptic semimajor axis using total gravitational parameter and period in compatible units.",
  inputs: [
    {
      id: "mu",
      label: "Mu",
      kind: "number",
      description:
        "Gravitational parameter, using the same distance and time units throughout; km³/s² for km and seconds.",
    },
    { id: "orbitalPeriod", label: "Orbital period", kind: "number" },
  ],
  outputs: [{ id: "semimajorAxis", label: "Semimajor axis", kind: "number" }],
  calculate: (value) =>
    calculate({
      mu: value.mu as number,
      orbitalPeriod: value.orbitalPeriod as number,
    }),
});
export const run = tool.execute;
export default tool;
