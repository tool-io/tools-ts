import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MicrophoneDirectivityIndexInput = Readonly<{
  readonly beamSolidAngleSteradians: number;
}>;
export type MicrophoneDirectivityIndexOutput = Readonly<{
  readonly directivityIndexDb: number;
}>;

export const calculateMicrophoneDirectivityIndex = (
  x: MicrophoneDirectivityIndexInput,
): MicrophoneDirectivityIndexOutput => {
  if (
    !Number.isFinite(x.beamSolidAngleSteradians) ||
    x.beamSolidAngleSteradians < 0
  )
    simpleError(
      "beamSolidAngleSteradians",
      "Provide a finite number at least 0.",
    );
  if (!(
    x.beamSolidAngleSteradians > 0 && x.beamSolidAngleSteradians <= 4 * Math.PI
  ))
    simpleError(
      "beamSolidAngleSteradians",
      "Beam solid angle must be in (0, 4π].",
    );
  const directivityIndexDb =
    10 * Math.log10((4 * Math.PI) / x.beamSolidAngleSteradians);
  if (!Number.isFinite(directivityIndexDb))
    simpleError("directivityIndexDb", "The inputs produce an invalid result.");
  return {
    directivityIndexDb: Object.is(directivityIndexDb, -0)
      ? 0
      : directivityIndexDb,
  };
};

export const example = {
  input: { beamSolidAngleSteradians: 6.283185307179586 },
  output: { directivityIndexDb: 3.010299956639812 },
} satisfies ToolExample<
  MicrophoneDirectivityIndexInput,
  MicrophoneDirectivityIndexOutput
>;

export const tool = createSimpleTool({
  id: "electronics/microphone-directivity-index",
  title: "Microphone Directivity Index",
  description:
    "Compute ideal directivity index from a measured or modeled effective acoustic beam solid angle.",
  inputs: [
    {
      id: "beamSolidAngleSteradians",
      kind: "number",
      label: "Effective beam solid angle",
      unit: "sr",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "directivityIndexDb",
      kind: "number",
      label: "Directivity index",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateMicrophoneDirectivityIndex({
      beamSolidAngleSteradians: input.beamSolidAngleSteradians as number,
    }),
});
export const microphoneDirectivityIndexTool = tool;
export const runMicrophoneDirectivityIndex = tool.execute;
export default tool;
