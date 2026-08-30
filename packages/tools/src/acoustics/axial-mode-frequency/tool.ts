import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AxialModeFrequencyInput = Readonly<{
  readonly soundSpeedMetersPerSecond: number;
  readonly modeOrder: number;
  readonly roomLengthMeters: number;
}>;
export type AxialModeFrequencyOutput = Readonly<{
  readonly modeHertz: number;
}>;

export const calculateAxialModeFrequency = (
  x: AxialModeFrequencyInput,
): AxialModeFrequencyOutput => {
  if (
    !Number.isFinite(x.soundSpeedMetersPerSecond) ||
    x.soundSpeedMetersPerSecond <= 0
  )
    simpleError(
      "soundSpeedMetersPerSecond",
      "Provide a finite positive number.",
    );
  if (
    !Number.isFinite(x.modeOrder) ||
    !Number.isSafeInteger(x.modeOrder) ||
    x.modeOrder < 1
  )
    simpleError("modeOrder", "Provide a positive safe integer.");
  if (!Number.isFinite(x.roomLengthMeters) || x.roomLengthMeters <= 0)
    simpleError("roomLengthMeters", "Provide a finite positive number.");
  const modeHertz =
    (x.modeOrder * x.soundSpeedMetersPerSecond) / (2 * x.roomLengthMeters);
  if (!Number.isFinite(modeHertz))
    simpleError(
      "modeHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { modeHertz: Object.is(modeHertz, -0) ? 0 : modeHertz };
};

export const example = {
  input: {
    soundSpeedMetersPerSecond: 343,
    modeOrder: 1,
    roomLengthMeters: 5,
  },
  output: { modeHertz: 34.3 },
} satisfies ToolExample<AxialModeFrequencyInput, AxialModeFrequencyOutput>;

export const tool = createSimpleTool({
  id: "acoustics/axial-mode-frequency",
  title: "Axial Mode Frequency",
  description:
    "Rectangular-room axial mode frequency along one dimension for a positive integer mode order.",
  inputs: [
    {
      id: "soundSpeedMetersPerSecond",
      kind: "number",
      label: "Sound Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    { id: "modeOrder", kind: "integer", label: "Mode Order", minimum: 1 },
    {
      id: "roomLengthMeters",
      kind: "number",
      label: "Room Length Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "modeHertz", kind: "number", label: "Mode Hertz", unit: "Hz" },
  ],
  calculate: (input) =>
    calculateAxialModeFrequency({
      soundSpeedMetersPerSecond: input.soundSpeedMetersPerSecond as number,
      modeOrder: input.modeOrder as number,
      roomLengthMeters: input.roomLengthMeters as number,
    }),
});
export const axialModeFrequencyTool = tool;
export const runAxialModeFrequency = tool.execute;
export default tool;
