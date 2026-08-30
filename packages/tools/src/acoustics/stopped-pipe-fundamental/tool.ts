import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StoppedPipeFundamentalInput = Readonly<{
  readonly soundSpeedMetersPerSecond: number;
  readonly lengthMeters: number;
}>;
export type StoppedPipeFundamentalOutput = Readonly<{
  readonly frequencyHertz: number;
}>;

export const calculateStoppedPipeFundamental = (
  x: StoppedPipeFundamentalInput,
): StoppedPipeFundamentalOutput => {
  if (
    !Number.isFinite(x.soundSpeedMetersPerSecond) ||
    x.soundSpeedMetersPerSecond <= 0
  )
    simpleError(
      "soundSpeedMetersPerSecond",
      "Provide a finite positive number.",
    );
  if (!Number.isFinite(x.lengthMeters) || x.lengthMeters <= 0)
    simpleError("lengthMeters", "Provide a finite positive number.");
  const frequencyHertz = x.soundSpeedMetersPerSecond / (4 * x.lengthMeters);
  if (!Number.isFinite(frequencyHertz))
    simpleError(
      "frequencyHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { frequencyHertz: Object.is(frequencyHertz, -0) ? 0 : frequencyHertz };
};

export const example = {
  input: {
    soundSpeedMetersPerSecond: 343,
    lengthMeters: 1,
  },
  output: { frequencyHertz: 85.75 },
} satisfies ToolExample<
  StoppedPipeFundamentalInput,
  StoppedPipeFundamentalOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/stopped-pipe-fundamental",
  title: "Stopped Pipe Fundamental",
  description:
    "Ideal first resonance of a pipe stopped at one end, neglecting end corrections.",
  inputs: [
    {
      id: "soundSpeedMetersPerSecond",
      kind: "number",
      label: "Sound Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    {
      id: "lengthMeters",
      kind: "number",
      label: "Length Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "frequencyHertz",
      kind: "number",
      label: "Frequency Hertz",
      unit: "Hz",
    },
  ],
  calculate: (input) =>
    calculateStoppedPipeFundamental({
      soundSpeedMetersPerSecond: input.soundSpeedMetersPerSecond as number,
      lengthMeters: input.lengthMeters as number,
    }),
});
export const stoppedPipeFundamentalTool = tool;
export const runStoppedPipeFundamental = tool.execute;
export default tool;
