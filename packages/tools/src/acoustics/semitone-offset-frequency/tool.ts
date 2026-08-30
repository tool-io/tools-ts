import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SemitoneOffsetFrequencyInput = Readonly<{
  readonly referenceHertz: number;
  readonly semitones: number;
}>;
export type SemitoneOffsetFrequencyOutput = Readonly<{
  readonly frequencyHertz: number;
}>;

export const calculateSemitoneOffsetFrequency = (
  x: SemitoneOffsetFrequencyInput,
): SemitoneOffsetFrequencyOutput => {
  if (!Number.isFinite(x.referenceHertz) || x.referenceHertz <= 0)
    simpleError("referenceHertz", "Provide a finite positive number.");
  if (!Number.isFinite(x.semitones))
    simpleError("semitones", "Provide a finite number.");
  const frequencyHertz = x.referenceHertz * 2 ** (x.semitones / 12);
  if (!Number.isFinite(frequencyHertz))
    simpleError(
      "frequencyHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { frequencyHertz: Object.is(frequencyHertz, -0) ? 0 : frequencyHertz };
};

export const example = {
  input: {
    referenceHertz: 440,
    semitones: 12,
  },
  output: { frequencyHertz: 880 },
} satisfies ToolExample<
  SemitoneOffsetFrequencyInput,
  SemitoneOffsetFrequencyOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/semitone-offset-frequency",
  title: "Semitone Offset Frequency",
  description:
    "Frequency after a signed number of semitones in 12-tone equal temperament.",
  inputs: [
    {
      id: "referenceHertz",
      kind: "number",
      label: "Reference Hertz",
      unit: "Hz",
      minimum: 0,
    },
    { id: "semitones", kind: "number", label: "Semitones" },
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
    calculateSemitoneOffsetFrequency({
      referenceHertz: input.referenceHertz as number,
      semitones: input.semitones as number,
    }),
});
export const semitoneOffsetFrequencyTool = tool;
export const runSemitoneOffsetFrequency = tool.execute;
export default tool;
