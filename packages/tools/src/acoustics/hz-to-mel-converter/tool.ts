import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HzToMelConverterInput = Readonly<{
  readonly frequencyHertz: number;
}>;
export type HzToMelConverterOutput = Readonly<{
  readonly mel: number;
}>;

export const calculateHzToMelConverter = (
  x: HzToMelConverterInput,
): HzToMelConverterOutput => {
  if (!Number.isFinite(x.frequencyHertz) || x.frequencyHertz < 0)
    simpleError("frequencyHertz", "Provide a finite nonnegative number.");
  const mel = 2595 * Math.log10(1 + x.frequencyHertz / 700);
  if (!Number.isFinite(mel))
    simpleError("mel", "Inputs produce an undefined or out-of-range result.");
  return { mel: Object.is(mel, -0) ? 0 : mel };
};

export const example = {
  input: {
    frequencyHertz: 1000,
  },
  output: { mel: 999.9855371396244 },
} satisfies ToolExample<HzToMelConverterInput, HzToMelConverterOutput>;

export const tool = createSimpleTool({
  id: "acoustics/hz-to-mel-converter",
  title: "Hz To Mel Converter",
  description:
    "Frequency in mels from hertz using the common 2595 log10(1+f/700) scale.",
  inputs: [
    {
      id: "frequencyHertz",
      kind: "number",
      label: "Frequency Hertz",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [{ id: "mel", kind: "number", label: "Mel", unit: "mel" }],
  calculate: (input) =>
    calculateHzToMelConverter({
      frequencyHertz: input.frequencyHertz as number,
    }),
});
export const hzToMelConverterTool = tool;
export const runHzToMelConverter = tool.execute;
export default tool;
