import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly mu: number;
  readonly radius: number;
  readonly orbitalSpeed: number;
}>;
export type Output = Readonly<{
  readonly specificEnergy: number;
  readonly energyClass: string;
}>;
export const calculate = (input: Input): Output => {
  positive(input.mu, "mu");
  positive(input.radius, "radius");
  nonnegative(input.orbitalSpeed, "orbitalSpeed");
  const specificEnergy = input.orbitalSpeed ** 2 / 2 - input.mu / input.radius;
  return {
    specificEnergy,
    energyClass:
      specificEnergy < 0
        ? "bound"
        : specificEnergy > 0
          ? "unbound"
          : "parabolic-boundary",
  };
};
export const exampleInput = {
  mu: 1,
  radius: 1,
  orbitalSpeed: 1,
} satisfies Input;
export const exampleOutput = {
  specificEnergy: -0.5,
  energyClass: "bound",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/specific-orbital-energy",
  title: "Specific Orbital Energy",
  description:
    "Evaluate specific two-body orbital energy v²/2−μ/r in consistent units; this does not determine angular momentum or collision safety.",
  inputs: [
    {
      id: "mu",
      label: "Mu",
      kind: "number",
      description:
        "Gravitational parameter, using the same distance and time units throughout; km³/s² for km and seconds.",
    },
    { id: "radius", label: "Radius", kind: "number" },
    { id: "orbitalSpeed", label: "Orbital speed", kind: "number" },
  ],
  outputs: [
    { id: "specificEnergy", label: "Specific energy", kind: "number" },
    { id: "energyClass", label: "Energy class", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      mu: value.mu as number,
      radius: value.radius as number,
      orbitalSpeed: value.orbitalSpeed as number,
    }),
});
export const run = tool.execute;
export default tool;
