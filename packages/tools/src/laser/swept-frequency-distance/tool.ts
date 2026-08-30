import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly phaseSlopeRadiansPerHertz: number;
}>;
export type Output = Readonly<{
  readonly roundTripDelaySeconds: number;
  readonly distanceMeters: number;
}>;

export const calculate = (input: Input): Output => {
  const roundTripDelaySeconds = input.phaseSlopeRadiansPerHertz / (2 * Math.PI);
  return {
    roundTripDelaySeconds,
    distanceMeters: (299792458 * roundTripDelaySeconds) / 2,
  };
};

export const exampleInput = {
  phaseSlopeRadiansPerHertz: 6.283185307179586e-9,
} satisfies Input;
export const exampleOutput = {
  roundTripDelaySeconds: 1e-9,
  distanceMeters: 0.14989622900000002,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      phaseSlopeRadiansPerHertz: input.phaseSlopeRadiansPerHertz as number,
    }),
  description:
    "Convert swept-frequency phase slope to delay and one-way distance.",
  id: "laser/swept-frequency-distance",
  inputs: [
    {
      id: "phaseSlopeRadiansPerHertz",
      label: "Measured phase slope",
      kind: "number",
      unit: "rad/Hz",
    },
  ],
  outputs: [
    {
      id: "roundTripDelaySeconds",
      label: "Round-trip delay",
      kind: "number",
      unit: "s",
    },
    {
      id: "distanceMeters",
      label: "One-way distance",
      kind: "number",
      unit: "m",
    },
  ],
  title: "Swept-Frequency Distance",
});

export const run = tool.execute;
export default tool;
