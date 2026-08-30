import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpeakerBoxVolumeInput = Readonly<{
  readonly widthCentimeters: number;
  readonly heightCentimeters: number;
  readonly depthCentimeters: number;
}>;
export type SpeakerBoxVolumeOutput = Readonly<{
  readonly volumeLiters: number;
}>;

export const calculateSpeakerBoxVolume = (
  x: SpeakerBoxVolumeInput,
): SpeakerBoxVolumeOutput => {
  if (!Number.isFinite(x.widthCentimeters) || x.widthCentimeters < 0)
    simpleError("widthCentimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.heightCentimeters) || x.heightCentimeters < 0)
    simpleError("heightCentimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.depthCentimeters) || x.depthCentimeters < 0)
    simpleError("depthCentimeters", "Provide a finite number at least 0.");
  const volumeLiters =
    (x.widthCentimeters * x.heightCentimeters * x.depthCentimeters) / 1000;
  if (!Number.isFinite(volumeLiters))
    simpleError(
      "volumeLiters",
      "Inputs produce an undefined or non-finite result.",
    );
  return { volumeLiters: Object.is(volumeLiters, -0) ? 0 : volumeLiters };
};

export const example = {
  input: { widthCentimeters: 30, heightCentimeters: 40, depthCentimeters: 20 },
  output: { volumeLiters: 24 },
} satisfies ToolExample<SpeakerBoxVolumeInput, SpeakerBoxVolumeOutput>;

export const tool = createSimpleTool({
  id: "electronics/speaker-box-volume",
  title: "Speaker Box Volume",
  description:
    "Internal rectangular speaker enclosure volume from internal width, height and depth; excludes drivers and bracing displacement.",
  inputs: [
    {
      id: "widthCentimeters",
      kind: "number",
      label: "Width Centimeters",
      unit: "cm",
      minimum: 0,
    },
    {
      id: "heightCentimeters",
      kind: "number",
      label: "Height Centimeters",
      unit: "cm",
      minimum: 0,
    },
    {
      id: "depthCentimeters",
      kind: "number",
      label: "Depth Centimeters",
      unit: "cm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "volumeLiters", kind: "number", label: "Volume Liters", unit: "L" },
  ],
  calculate: (input) =>
    calculateSpeakerBoxVolume({
      widthCentimeters: input.widthCentimeters as number,
      heightCentimeters: input.heightCentimeters as number,
      depthCentimeters: input.depthCentimeters as number,
    }),
});
export const speakerBoxVolumeTool = tool;
export const runSpeakerBoxVolume = tool.execute;
export default tool;
