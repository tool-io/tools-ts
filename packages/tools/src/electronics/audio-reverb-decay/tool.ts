import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AudioReverbDecayInput = Readonly<{
  readonly roomCubicMeters: number;
  readonly equivalentAbsorptionSquareMeters: number;
}>;
export type AudioReverbDecayOutput = Readonly<{
  readonly decaySeconds: number;
}>;

export const calculateAudioReverbDecay = (
  x: AudioReverbDecayInput,
): AudioReverbDecayOutput => {
  if (!Number.isFinite(x.roomCubicMeters) || x.roomCubicMeters < 0)
    simpleError("roomCubicMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.equivalentAbsorptionSquareMeters) ||
    x.equivalentAbsorptionSquareMeters < 0
  )
    simpleError(
      "equivalentAbsorptionSquareMeters",
      "Provide a finite number at least 0.",
    );
  const decaySeconds =
    (0.161 * x.roomCubicMeters) / x.equivalentAbsorptionSquareMeters;
  if (!Number.isFinite(decaySeconds))
    simpleError(
      "decaySeconds",
      "Inputs produce an undefined or non-finite result.",
    );
  return { decaySeconds: Object.is(decaySeconds, -0) ? 0 : decaySeconds };
};

export const example = {
  input: { roomCubicMeters: 100, equivalentAbsorptionSquareMeters: 10 },
  output: { decaySeconds: 1.61 },
} satisfies ToolExample<AudioReverbDecayInput, AudioReverbDecayOutput>;

export const tool = createSimpleTool({
  id: "electronics/audio-reverb-decay",
  title: "Audio Reverb Decay",
  description:
    "Sabine T60 estimate for a diffuse room from volume and equivalent absorption area in metric units.",
  inputs: [
    {
      id: "roomCubicMeters",
      kind: "number",
      label: "Room Cubic Meters",
      unit: "m³",
      minimum: 0,
    },
    {
      id: "equivalentAbsorptionSquareMeters",
      kind: "number",
      label: "Equivalent Absorption Square Meters",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "decaySeconds", kind: "number", label: "Decay Seconds", unit: "s" },
  ],
  calculate: (input) =>
    calculateAudioReverbDecay({
      roomCubicMeters: input.roomCubicMeters as number,
      equivalentAbsorptionSquareMeters:
        input.equivalentAbsorptionSquareMeters as number,
    }),
});
export const audioReverbDecayTool = tool;
export const runAudioReverbDecay = tool.execute;
export default tool;
