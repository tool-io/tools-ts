import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OpenPipeFundamentalInput = Readonly<{
  readonly soundSpeedMetersPerSecond: number;
  readonly lengthMeters: number;
}>;
export type OpenPipeFundamentalOutput = Readonly<{
  readonly frequencyHertz: number;
}>;

export const calculateOpenPipeFundamental = (
  x: OpenPipeFundamentalInput,
): OpenPipeFundamentalOutput => {
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
  const frequencyHertz = x.soundSpeedMetersPerSecond / (2 * x.lengthMeters);
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
  output: { frequencyHertz: 171.5 },
} satisfies ToolExample<OpenPipeFundamentalInput, OpenPipeFundamentalOutput>;

export const tool = createSimpleTool({
  id: "acoustics/open-pipe-fundamental",
  title: "Open Pipe Fundamental",
  description:
    "Ideal first resonance of a pipe open at both ends, neglecting end corrections.",
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
    calculateOpenPipeFundamental({
      soundSpeedMetersPerSecond: input.soundSpeedMetersPerSecond as number,
      lengthMeters: input.lengthMeters as number,
    }),
});
export const openPipeFundamentalTool = tool;
export const runOpenPipeFundamental = tool.execute;
export default tool;
