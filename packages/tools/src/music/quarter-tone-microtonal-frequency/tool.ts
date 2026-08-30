import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QuarterToneMicrotonalFrequencyInput = Readonly<{
  readonly referenceHertz: number;
  readonly quarterToneSteps: number;
}>;
export type QuarterToneMicrotonalFrequencyOutput = Readonly<{
  readonly frequencyHertz: number;
}>;

export const calculateQuarterToneMicrotonalFrequency = (
  x: QuarterToneMicrotonalFrequencyInput,
): QuarterToneMicrotonalFrequencyOutput => {
  if (!Number.isFinite(x.referenceHertz) || x.referenceHertz <= 0)
    simpleError("referenceHertz", "Provide a finite positive number.");
  if (!Number.isFinite(x.quarterToneSteps))
    simpleError("quarterToneSteps", "Provide a finite number.");
  const frequencyHertz = x.referenceHertz * 2 ** (x.quarterToneSteps / 24);
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
    quarterToneSteps: 24,
  },
  output: { frequencyHertz: 880 },
} satisfies ToolExample<
  QuarterToneMicrotonalFrequencyInput,
  QuarterToneMicrotonalFrequencyOutput
>;

export const tool = createSimpleTool({
  id: "music/quarter-tone-microtonal-frequency",
  title: "Quarter Tone Microtonal Frequency",
  description:
    "Frequency after a signed number of 50-cent quarter-tone steps in 24-TET.",
  inputs: [
    {
      id: "referenceHertz",
      kind: "number",
      label: "Reference Hertz",
      unit: "Hz",
      minimum: 0,
    },
    { id: "quarterToneSteps", kind: "number", label: "Quarter Tone Steps" },
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
    calculateQuarterToneMicrotonalFrequency({
      referenceHertz: input.referenceHertz as number,
      quarterToneSteps: input.quarterToneSteps as number,
    }),
});
export const quarterToneMicrotonalFrequencyTool = tool;
export const runQuarterToneMicrotonalFrequency = tool.execute;
export default tool;
