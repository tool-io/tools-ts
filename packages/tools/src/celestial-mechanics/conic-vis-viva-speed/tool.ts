import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { speed } from "../shared.js";

export type Input = Readonly<{
  readonly mu: number;
  readonly radius: number;
  readonly semimajorAxis: number;
}>;
export type Output = Readonly<{
  readonly orbitalSpeed: number;
}>;
export const calculate = (input: Input): Output => {
  return { orbitalSpeed: speed(input.mu, input.radius, input.semimajorAxis) };
};
export const exampleInput = {
  mu: 1,
  radius: 1,
  semimajorAxis: 2,
} satisfies Input;
export const exampleOutput = {
  orbitalSpeed: 1.224744871391589,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/conic-vis-viva-speed",
  title: "Conic Vis Viva Speed",
  description:
    "Evaluate vis-viva for elliptic positive-a or hyperbolic negative-a states with an accessible radius, extending the existing circular-orbit operation.",
  inputs: [
    {
      id: "mu",
      label: "Mu",
      kind: "number",
      description:
        "Gravitational parameter, using the same distance and time units throughout; km³/s² for km and seconds.",
    },
    { id: "radius", label: "Radius", kind: "number" },
    { id: "semimajorAxis", label: "Semimajor axis", kind: "number" },
  ],
  outputs: [{ id: "orbitalSpeed", label: "Orbital speed", kind: "number" }],
  calculate: (value) =>
    calculate({
      mu: value.mu as number,
      radius: value.radius as number,
      semimajorAxis: value.semimajorAxis as number,
    }),
});
export const run = tool.execute;
export default tool;
