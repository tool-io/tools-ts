import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MelToHzConverterInput = Readonly<{
  readonly mel: number;
}>;
export type MelToHzConverterOutput = Readonly<{
  readonly frequencyHertz: number;
}>;

export const calculateMelToHzConverter = (
  x: MelToHzConverterInput,
): MelToHzConverterOutput => {
  if (!Number.isFinite(x.mel) || x.mel < 0)
    simpleError("mel", "Provide a finite nonnegative number.");
  const frequencyHertz = 700 * (10 ** (x.mel / 2595) - 1);
  if (!Number.isFinite(frequencyHertz))
    simpleError(
      "frequencyHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { frequencyHertz: Object.is(frequencyHertz, -0) ? 0 : frequencyHertz };
};

export const example = {
  input: {
    mel: 1000,
  },
  output: { frequencyHertz: 1000.021816457287 },
} satisfies ToolExample<MelToHzConverterInput, MelToHzConverterOutput>;

export const tool = createSimpleTool({
  id: "acoustics/mel-to-hz-converter",
  title: "Mel To Hz Converter",
  description:
    "Frequency in hertz from mels using the inverse of the 2595-log mel scale.",
  inputs: [
    { id: "mel", kind: "number", label: "Mel", unit: "mel", minimum: 0 },
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
    calculateMelToHzConverter({
      mel: input.mel as number,
    }),
});
export const melToHzConverterTool = tool;
export const runMelToHzConverter = tool.execute;
export default tool;
