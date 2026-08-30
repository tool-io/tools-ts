import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative, speed } from "../shared.js";

export type Input = Readonly<{
  readonly mu: number;
  readonly periapsisRadius: number;
  readonly hyperbolicExcessSpeed: number;
  readonly targetSemimajorAxis: number;
}>;
export type Output = Readonly<{
  readonly incomingPeriapsisSpeed: number;
  readonly targetPeriapsisSpeed: number;
  readonly captureDeltaV: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.mu, "mu");
  positive(input.periapsisRadius, "periapsisRadius");
  nonnegative(input.hyperbolicExcessSpeed, "hyperbolicExcessSpeed");
  positive(input.targetSemimajorAxis, "targetSemimajorAxis");
  if (input.targetSemimajorAxis < input.periapsisRadius)
    simpleError(
      "targetSemimajorAxis",
      "Target periapsis cannot exceed its elliptical semimajor axis.",
    );
  const incomingPeriapsisSpeed = Math.sqrt(
      input.hyperbolicExcessSpeed ** 2 + (2 * input.mu) / input.periapsisRadius,
    ),
    targetPeriapsisSpeed = speed(
      input.mu,
      input.periapsisRadius,
      input.targetSemimajorAxis,
    );
  return {
    incomingPeriapsisSpeed,
    targetPeriapsisSpeed,
    captureDeltaV: incomingPeriapsisSpeed - targetPeriapsisSpeed,
  };
};
export const exampleInput = {
  mu: 1,
  periapsisRadius: 1,
  hyperbolicExcessSpeed: 1,
  targetSemimajorAxis: 1,
} satisfies Input;
export const exampleOutput = {
  incomingPeriapsisSpeed: 1.7320508075688772,
  targetPeriapsisSpeed: 1,
  captureDeltaV: 0.7320508075688772,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/hyperbolic-capture-insertion",
  title: "Hyperbolic Capture Insertion",
  description:
    "Calculate an aligned impulsive periapsis capture burn from a hyperbolic arrival to a specified elliptic orbit, excluding plane changes.",
  inputs: [
    {
      id: "mu",
      label: "Mu",
      kind: "number",
      description:
        "Gravitational parameter, using the same distance and time units throughout; km³/s² for km and seconds.",
    },
    { id: "periapsisRadius", label: "Periapsis radius", kind: "number" },
    {
      id: "hyperbolicExcessSpeed",
      label: "Hyperbolic excess speed",
      kind: "number",
    },
    {
      id: "targetSemimajorAxis",
      label: "Target semimajor axis",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "incomingPeriapsisSpeed",
      label: "Incoming periapsis speed",
      kind: "number",
    },
    {
      id: "targetPeriapsisSpeed",
      label: "Target periapsis speed",
      kind: "number",
    },
    { id: "captureDeltaV", label: "Capture delta v", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      mu: value.mu as number,
      periapsisRadius: value.periapsisRadius as number,
      hyperbolicExcessSpeed: value.hyperbolicExcessSpeed as number,
      targetSemimajorAxis: value.targetSemimajorAxis as number,
    }),
});
export const run = tool.execute;
export default tool;
