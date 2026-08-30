import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly slotCount: number;
  readonly rotationRpm: number;
  readonly openAngleDegrees: number;
}>;
export type Output = Readonly<{
  readonly chopFrequencyHertz: number;
  readonly dutyCyclePercent: number;
  readonly openTimeSeconds: number;
}>;

export const calculate = (input: Input): Output => {
  const chopFrequencyHertz = (input.slotCount * input.rotationRpm) / 60;
  const dutyCyclePercent = (input.openAngleDegrees / 360) * 100;
  return {
    chopFrequencyHertz,
    dutyCyclePercent,
    openTimeSeconds:
      chopFrequencyHertz === 0
        ? 0
        : dutyCyclePercent / 100 / chopFrequencyHertz,
  };
};

export const exampleInput = {
  slotCount: 10,
  rotationRpm: 600,
  openAngleDegrees: 180,
} satisfies Input;
export const exampleOutput = {
  chopFrequencyHertz: 100,
  dutyCyclePercent: 50,
  openTimeSeconds: 0.005,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      slotCount: input.slotCount as number,
      rotationRpm: input.rotationRpm as number,
      openAngleDegrees: input.openAngleDegrees as number,
    }),
  description:
    "Calculate optical-chopper frequency, duty cycle, and open time.",
  id: "laser/optical-chopper-timing",
  inputs: [
    {
      id: "slotCount",
      label: "Chopper slot count",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "rotationRpm",
      label: "Rotation speed",
      kind: "number",
      minimum: 0,
      unit: "rpm",
    },
    {
      id: "openAngleDegrees",
      label: "Open angle per slot",
      kind: "number",
      minimum: 0,
      maximum: 360,
      unit: "°",
    },
  ],
  outputs: [
    {
      id: "chopFrequencyHertz",
      label: "Chop frequency",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "dutyCyclePercent",
      label: "Open duty cycle",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "openTimeSeconds",
      label: "Open time per cycle",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  title: "Optical-Chopper Timing",
});

export const run = tool.execute;
export default tool;
