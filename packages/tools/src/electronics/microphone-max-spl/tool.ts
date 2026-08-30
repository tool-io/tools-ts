import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MicrophoneMaxSplInput = Readonly<{
  readonly maxPressurePascals: number;
}>;
export type MicrophoneMaxSplOutput = Readonly<{
  readonly maxSplDb: number;
}>;

export const calculateMicrophoneMaxSpl = (
  x: MicrophoneMaxSplInput,
): MicrophoneMaxSplOutput => {
  if (!Number.isFinite(x.maxPressurePascals) || x.maxPressurePascals < 0)
    simpleError("maxPressurePascals", "Provide a finite number at least 0.");
  const maxSplDb = 20 * Math.log10(x.maxPressurePascals / 0.00002);
  if (!Number.isFinite(maxSplDb))
    simpleError(
      "maxSplDb",
      "Inputs produce an undefined or non-finite result.",
    );
  return { maxSplDb: Object.is(maxSplDb, -0) ? 0 : maxSplDb };
};

export const example = {
  input: { maxPressurePascals: 2 },
  output: { maxSplDb: 100 },
} satisfies ToolExample<MicrophoneMaxSplInput, MicrophoneMaxSplOutput>;

export const tool = createSimpleTool({
  id: "electronics/microphone-max-spl",
  title: "Microphone Max Spl",
  description:
    "Maximum SPL from the microphone's maximum undistorted RMS sound pressure, referenced to 20 µPa.",
  inputs: [
    {
      id: "maxPressurePascals",
      kind: "number",
      label: "Max Pressure Pascals",
      unit: "Pa",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "maxSplDb", kind: "number", label: "Max Spl Db", unit: "dB SPL" },
  ],
  calculate: (input) =>
    calculateMicrophoneMaxSpl({
      maxPressurePascals: input.maxPressurePascals as number,
    }),
});
export const microphoneMaxSplTool = tool;
export const runMicrophoneMaxSpl = tool.execute;
export default tool;
