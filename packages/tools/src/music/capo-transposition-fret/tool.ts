import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapoTranspositionFretInput = Readonly<{
  readonly openStringMidi: number;
  readonly capoFret: number;
}>;
export type CapoTranspositionFretOutput = Readonly<{
  readonly soundingMidi: number;
}>;

export const calculateCapoTranspositionFret = (
  x: CapoTranspositionFretInput,
): CapoTranspositionFretOutput => {
  if (!Number.isFinite(x.openStringMidi) || x.openStringMidi < 0)
    simpleError("openStringMidi", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.capoFret) || x.capoFret < 0)
    simpleError("capoFret", "Provide a finite nonnegative number.");
  if (!(
    Number.isInteger(x.openStringMidi) &&
    Number.isInteger(x.capoFret) &&
    x.openStringMidi + x.capoFret <= 127
  ))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const soundingMidi = x.openStringMidi + x.capoFret;
  if (!Number.isFinite(soundingMidi))
    simpleError(
      "soundingMidi",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { soundingMidi: Object.is(soundingMidi, -0) ? 0 : soundingMidi };
};

export const example = {
  input: {
    openStringMidi: 64,
    capoFret: 2,
  },
  output: { soundingMidi: 66 },
} satisfies ToolExample<
  CapoTranspositionFretInput,
  CapoTranspositionFretOutput
>;

export const tool = createSimpleTool({
  id: "music/capo-transposition-fret",
  title: "Capo Transposition Fret",
  description:
    "Sounding equal-tempered MIDI note after placing a capo at a fret above the open-string note.",
  inputs: [
    {
      id: "openStringMidi",
      kind: "number",
      label: "Open String Midi",
      minimum: 0,
    },
    { id: "capoFret", kind: "number", label: "Capo Fret", minimum: 0 },
  ],
  outputs: [{ id: "soundingMidi", kind: "number", label: "Sounding Midi" }],
  calculate: (input) =>
    calculateCapoTranspositionFret({
      openStringMidi: input.openStringMidi as number,
      capoFret: input.capoFret as number,
    }),
});
export const capoTranspositionFretTool = tool;
export const runCapoTranspositionFret = tool.execute;
export default tool;
