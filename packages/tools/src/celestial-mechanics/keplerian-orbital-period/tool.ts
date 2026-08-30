import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { period } from "../shared.js";

export type Input = Readonly<{
  readonly mu: number;
  readonly semimajorAxis: number;
}>;
export type Output = Readonly<{
  readonly orbitalPeriod: number;
}>;
export const calculate = (input: Input): Output => {
  return { orbitalPeriod: period(input.mu, input.semimajorAxis) };
};
export const exampleInput = { mu: 1, semimajorAxis: 1 } satisfies Input;
export const exampleOutput = {
  orbitalPeriod: 6.283185307179586,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/keplerian-orbital-period",
  title: "Keplerian Orbital Period",
  description:
    "Compute a two-body elliptic orbital period from semimajor axis and total gravitational parameter, not a fixed planetary lookup.",
  inputs: [
    {
      id: "mu",
      label: "Mu",
      kind: "number",
      description:
        "Gravitational parameter, using the same distance and time units throughout; km³/s² for km and seconds.",
    },
    { id: "semimajorAxis", label: "Semimajor axis", kind: "number" },
  ],
  outputs: [{ id: "orbitalPeriod", label: "Orbital period", kind: "number" }],
  calculate: (value) =>
    calculate({
      mu: value.mu as number,
      semimajorAxis: value.semimajorAxis as number,
    }),
});
export const run = tool.execute;
export default tool;
