import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly roundTripLengthMeters: number;
  readonly ringDownTimeSeconds: number;
}>;
export type Output = Readonly<{
  readonly effectiveRoundTripReflectivity: number;
  readonly roundTripLossPpm: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.roundTripLengthMeters <= 0 || input.ringDownTimeSeconds <= 0)
    simpleError(
      "roundTripLengthMeters",
      "Round-trip length and decay time must be positive.",
      "invalid_cavity",
    );
  const effectiveRoundTripReflectivity = Math.exp(
    -input.roundTripLengthMeters / (299792458 * input.ringDownTimeSeconds),
  );
  return {
    effectiveRoundTripReflectivity,
    roundTripLossPpm: (1 - effectiveRoundTripReflectivity) * 1e6,
  };
};

export const exampleInput = {
  roundTripLengthMeters: 0.2,
  ringDownTimeSeconds: 1e-6,
} satisfies Input;
export const exampleOutput = {
  effectiveRoundTripReflectivity: 0.9993330942901378,
  roundTripLossPpm: 666.9057098621645,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      roundTripLengthMeters: input.roundTripLengthMeters as number,
      ringDownTimeSeconds: input.ringDownTimeSeconds as number,
    }),
  description:
    "Extract effective round-trip reflectivity and loss from cavity ring-down time.",
  id: "laser/cavity-ring-down-reflectivity",
  inputs: [
    {
      id: "roundTripLengthMeters",
      label: "Cavity round-trip length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "ringDownTimeSeconds",
      label: "Intensity ring-down time",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  outputs: [
    {
      id: "effectiveRoundTripReflectivity",
      label: "Effective round-trip reflectivity",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "roundTripLossPpm",
      label: "Round-trip loss",
      kind: "number",
      minimum: 0,
      unit: "ppm",
    },
  ],
  title: "Cavity Ring-Down Reflectivity",
});

export const run = tool.execute;
export default tool;
