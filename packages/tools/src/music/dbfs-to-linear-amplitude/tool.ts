import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DbfsToLinearAmplitudeInput = Readonly<{
  readonly decibelsFullScale: number;
}>;
export type DbfsToLinearAmplitudeOutput = Readonly<{
  readonly amplitudeRatio: number;
}>;

export const calculateDbfsToLinearAmplitude = (
  x: DbfsToLinearAmplitudeInput,
): DbfsToLinearAmplitudeOutput => {
  if (!Number.isFinite(x.decibelsFullScale))
    simpleError("decibelsFullScale", "Provide a finite number.");
  const amplitudeRatio = 10 ** (x.decibelsFullScale / 20);
  if (!Number.isFinite(amplitudeRatio))
    simpleError(
      "amplitudeRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { amplitudeRatio: Object.is(amplitudeRatio, -0) ? 0 : amplitudeRatio };
};

export const example = {
  input: {
    decibelsFullScale: -6.020599913279624,
  },
  output: { amplitudeRatio: 0.5 },
} satisfies ToolExample<
  DbfsToLinearAmplitudeInput,
  DbfsToLinearAmplitudeOutput
>;

export const tool = createSimpleTool({
  id: "music/dbfs-to-linear-amplitude",
  title: "Dbfs To Linear Amplitude",
  description:
    "Linear full-scale amplitude ratio from a signed dBFS level, using 20 log10 amplitude.",
  inputs: [
    {
      id: "decibelsFullScale",
      kind: "number",
      label: "Decibels Full Scale",
      unit: "dB",
    },
  ],
  outputs: [{ id: "amplitudeRatio", kind: "number", label: "Amplitude Ratio" }],
  calculate: (input) =>
    calculateDbfsToLinearAmplitude({
      decibelsFullScale: input.decibelsFullScale as number,
    }),
});
export const dbfsToLinearAmplitudeTool = tool;
export const runDbfsToLinearAmplitude = tool.execute;
export default tool;
