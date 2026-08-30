import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly mu: number;
  readonly relativeSpeed: number;
  readonly soundSpeed: number;
}>;
export type Output = Readonly<{
  readonly accretionRadius: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.mu, "mu");
  nonnegative(input.relativeSpeed, "relativeSpeed");
  nonnegative(input.soundSpeed, "soundSpeed");
  const denominator = input.relativeSpeed ** 2 + input.soundSpeed ** 2;
  positive(denominator, "relativeSpeed");
  return { accretionRadius: (2 * input.mu) / denominator };
};
export const exampleInput = {
  mu: 10,
  relativeSpeed: 3,
  soundSpeed: 1,
} satisfies Input;
export const exampleOutput = { accretionRadius: 2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/bondi-hoyle-capture-radius",
  title: "Bondi Hoyle Capture Radius",
  description:
    "Compute the Bondi–Hoyle capture scale 2μ/(v²+c_s²) in consistent units; not an accretion-rate estimate.",
  inputs: [
    {
      id: "mu",
      label: "Mu",
      kind: "number",
      description:
        "Gravitational parameter, using the same distance and time units throughout; km³/s² for km and seconds.",
    },
    { id: "relativeSpeed", label: "Relative speed", kind: "number" },
    { id: "soundSpeed", label: "Sound speed", kind: "number" },
  ],
  outputs: [
    { id: "accretionRadius", label: "Accretion radius", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      mu: value.mu as number,
      relativeSpeed: value.relativeSpeed as number,
      soundSpeed: value.soundSpeed as number,
    }),
});
export const run = tool.execute;
export default tool;
