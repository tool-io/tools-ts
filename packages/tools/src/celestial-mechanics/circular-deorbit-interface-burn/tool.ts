import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, speed } from "../shared.js";

export type Input = Readonly<{
  readonly mu: number;
  readonly initialOrbitRadius: number;
  readonly targetPeriapsisRadius: number;
}>;
export type Output = Readonly<{
  readonly retrogradeDeltaV: number;
  readonly transferSemimajorAxis: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.mu, "mu");
  positive(input.initialOrbitRadius, "initialOrbitRadius");
  positive(input.targetPeriapsisRadius, "targetPeriapsisRadius");
  if (input.targetPeriapsisRadius > input.initialOrbitRadius)
    simpleError(
      "targetPeriapsisRadius",
      "Target interface periapsis cannot exceed the initial circular radius.",
    );
  const transferSemimajorAxis =
    (input.initialOrbitRadius + input.targetPeriapsisRadius) / 2;
  return {
    retrogradeDeltaV:
      Math.sqrt(input.mu / input.initialOrbitRadius) -
      speed(input.mu, input.initialOrbitRadius, transferSemimajorAxis),
    transferSemimajorAxis,
  };
};
export const exampleInput = {
  mu: 1,
  initialOrbitRadius: 2,
  targetPeriapsisRadius: 1,
} satisfies Input;
export const exampleOutput = {
  retrogradeDeltaV: 0.12975651199692184,
  transferSemimajorAxis: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/circular-deorbit-interface-burn",
  title: "Circular Deorbit Interface Burn",
  description:
    "Calculate an impulsive retrograde burn from a circular orbit to a supplied interface periapsis in consistent km/s units; no atmospheric landing path is inferred.",
  inputs: [
    {
      id: "mu",
      label: "Mu",
      kind: "number",
      description:
        "Gravitational parameter, using the same distance and time units throughout; km³/s² for km and seconds.",
    },
    { id: "initialOrbitRadius", label: "Initial orbit radius", kind: "number" },
    {
      id: "targetPeriapsisRadius",
      label: "Target periapsis radius",
      kind: "number",
    },
  ],
  outputs: [
    { id: "retrogradeDeltaV", label: "Retrograde delta v", kind: "number" },
    {
      id: "transferSemimajorAxis",
      label: "Transfer semimajor axis",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      mu: value.mu as number,
      initialOrbitRadius: value.initialOrbitRadius as number,
      targetPeriapsisRadius: value.targetPeriapsisRadius as number,
    }),
});
export const run = tool.execute;
export default tool;
