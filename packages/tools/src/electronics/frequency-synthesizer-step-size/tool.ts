import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FrequencySynthesizerStepSizeInput = Readonly<{
  readonly referenceHertz: number;
  readonly referenceDivider: number;
}>;
export type FrequencySynthesizerStepSizeOutput = Readonly<{
  readonly stepHertz: number;
}>;

export const calculateFrequencySynthesizerStepSize = (
  x: FrequencySynthesizerStepSizeInput,
): FrequencySynthesizerStepSizeOutput => {
  if (!Number.isFinite(x.referenceHertz) || x.referenceHertz < 0)
    simpleError("referenceHertz", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.referenceDivider) || x.referenceDivider < 1)
    simpleError(
      "referenceDivider",
      "Provide a positive integer reference divider.",
    );
  const stepHertz = x.referenceHertz / x.referenceDivider;
  if (!Number.isFinite(stepHertz))
    simpleError(
      "stepHertz",
      "Inputs produce an undefined or non-finite result.",
    );
  return { stepHertz: Object.is(stepHertz, -0) ? 0 : stepHertz };
};

export const example = {
  input: { referenceHertz: 10000000, referenceDivider: 10 },
  output: { stepHertz: 1000000 },
} satisfies ToolExample<
  FrequencySynthesizerStepSizeInput,
  FrequencySynthesizerStepSizeOutput
>;

export const tool = createSimpleTool({
  id: "electronics/frequency-synthesizer-step-size",
  title: "Frequency Synthesizer Step Size",
  description:
    "Frequency increment for an integer-N PLL synthesizer after reference divider R.",
  inputs: [
    {
      id: "referenceHertz",
      kind: "number",
      label: "Reference Hertz",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "referenceDivider",
      kind: "integer",
      label: "Reference Divider",
      minimum: 1,
    },
  ],
  outputs: [
    { id: "stepHertz", kind: "number", label: "Step Hertz", unit: "Hz" },
  ],
  calculate: (input) =>
    calculateFrequencySynthesizerStepSize({
      referenceHertz: input.referenceHertz as number,
      referenceDivider: input.referenceDivider as number,
    }),
});
export const frequencySynthesizerStepSizeTool = tool;
export const runFrequencySynthesizerStepSize = tool.execute;
export default tool;
