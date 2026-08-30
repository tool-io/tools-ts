import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, deg } from "../shared.js";

export type Input = Readonly<{
  readonly mu: number;
  readonly impactParameter: number;
  readonly excessSpeed: number;
}>;
export type Output = Readonly<{
  readonly turnDegrees: number;
  readonly periapsisRadius: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.mu, "mu");
  positive(input.impactParameter, "impactParameter");
  positive(input.excessSpeed, "excessSpeed");
  const scale = input.mu / input.excessSpeed ** 2,
    b = input.impactParameter;
  return {
    turnDegrees: deg(2 * Math.atan(scale / b)),
    periapsisRadius: (b * b) / (Math.hypot(scale, b) + scale),
  };
};
export const exampleInput = {
  mu: 1,
  impactParameter: 1,
  excessSpeed: 1,
} satisfies Input;
export const exampleOutput = {
  turnDegrees: 90,
  periapsisRadius: 0.41421356237309515,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/impact-parameter-flyby-turn",
  title: "Impact Parameter Flyby Turn",
  description:
    "Compute ideal hyperbolic flyby turn and periapsis from impact parameter and excess speed, with cancellation-resistant periapsis arithmetic.",
  inputs: [
    {
      id: "mu",
      label: "Mu",
      kind: "number",
      description:
        "Gravitational parameter, using the same distance and time units throughout; km³/s² for km and seconds.",
    },
    { id: "impactParameter", label: "Impact parameter", kind: "number" },
    { id: "excessSpeed", label: "Excess speed", kind: "number" },
  ],
  outputs: [
    { id: "turnDegrees", label: "Turn degrees", kind: "number" },
    { id: "periapsisRadius", label: "Periapsis radius", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      mu: value.mu as number,
      impactParameter: value.impactParameter as number,
      excessSpeed: value.excessSpeed as number,
    }),
});
export const run = tool.execute;
export default tool;
