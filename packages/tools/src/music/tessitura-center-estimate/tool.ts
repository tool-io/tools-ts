import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TessituraCenterEstimateInput = Readonly<{
  readonly comfortableLowMidi: number;
  readonly comfortableHighMidi: number;
}>;
export type TessituraCenterEstimateOutput = Readonly<{
  readonly centerMidi: number;
}>;

export const calculateTessituraCenterEstimate = (
  x: TessituraCenterEstimateInput,
): TessituraCenterEstimateOutput => {
  if (!Number.isFinite(x.comfortableLowMidi) || x.comfortableLowMidi < 0)
    simpleError("comfortableLowMidi", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.comfortableHighMidi) || x.comfortableHighMidi < 0)
    simpleError("comfortableHighMidi", "Provide a finite nonnegative number.");
  if (!(
    x.comfortableHighMidi >= x.comfortableLowMidi &&
    x.comfortableHighMidi <= 127
  ))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const centerMidi = (x.comfortableLowMidi + x.comfortableHighMidi) / 2;
  if (!Number.isFinite(centerMidi))
    simpleError(
      "centerMidi",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { centerMidi: Object.is(centerMidi, -0) ? 0 : centerMidi };
};

export const example = {
  input: {
    comfortableLowMidi: 60,
    comfortableHighMidi: 72,
  },
  output: { centerMidi: 66 },
} satisfies ToolExample<
  TessituraCenterEstimateInput,
  TessituraCenterEstimateOutput
>;

export const tool = createSimpleTool({
  id: "music/tessitura-center-estimate",
  title: "Tessitura Center Estimate",
  description:
    "Simple midpoint estimate of a singer's comfortable lower and upper pitches in MIDI semitones.",
  inputs: [
    {
      id: "comfortableLowMidi",
      kind: "number",
      label: "Comfortable Low Midi",
      minimum: 0,
    },
    {
      id: "comfortableHighMidi",
      kind: "number",
      label: "Comfortable High Midi",
      minimum: 0,
    },
  ],
  outputs: [{ id: "centerMidi", kind: "number", label: "Center Midi" }],
  calculate: (input) =>
    calculateTessituraCenterEstimate({
      comfortableLowMidi: input.comfortableLowMidi as number,
      comfortableHighMidi: input.comfortableHighMidi as number,
    }),
});
export const tessituraCenterEstimateTool = tool;
export const runTessituraCenterEstimate = tool.execute;
export default tool;
