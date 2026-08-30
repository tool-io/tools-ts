import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EqualTemperamentRatioFromSemitonesInput = Readonly<{
  readonly semitones: number;
}>;
export type EqualTemperamentRatioFromSemitonesOutput = Readonly<{
  readonly frequencyRatio: number;
}>;

export const calculateEqualTemperamentRatioFromSemitones = (
  x: EqualTemperamentRatioFromSemitonesInput,
): EqualTemperamentRatioFromSemitonesOutput => {
  if (!Number.isFinite(x.semitones))
    simpleError("semitones", "Provide a finite number.");
  const frequencyRatio = 2 ** (x.semitones / 12);
  if (!Number.isFinite(frequencyRatio))
    simpleError(
      "frequencyRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { frequencyRatio: Object.is(frequencyRatio, -0) ? 0 : frequencyRatio };
};

export const example = {
  input: {
    semitones: 12,
  },
  output: { frequencyRatio: 2 },
} satisfies ToolExample<
  EqualTemperamentRatioFromSemitonesInput,
  EqualTemperamentRatioFromSemitonesOutput
>;

export const tool = createSimpleTool({
  id: "music/equal-temperament-ratio-from-semitones",
  title: "Equal Temperament Ratio From Semitones",
  description:
    "Frequency ratio for a signed number of equal-tempered semitones in 12-TET.",
  inputs: [{ id: "semitones", kind: "number", label: "Semitones" }],
  outputs: [{ id: "frequencyRatio", kind: "number", label: "Frequency Ratio" }],
  calculate: (input) =>
    calculateEqualTemperamentRatioFromSemitones({
      semitones: input.semitones as number,
    }),
});
export const equalTemperamentRatioFromSemitonesTool = tool;
export const runEqualTemperamentRatioFromSemitones = tool.execute;
export default tool;
