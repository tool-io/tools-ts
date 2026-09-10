import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyMeasuredInstantaneousFrequenciesHz: readonly number[];
  readonly matchedReferenceFrequencyHz: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyMeasuredInstantaneousFrequenciesHz",
    label: "Actual independently measured instantaneous frequencies hz",
    kind: "numberList",
  },
  {
    id: "matchedReferenceFrequencyHz",
    label: "Matched reference frequency hz",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualIndependentlyMeasuredInstantaneousFrequenciesHz.length)
    simpleError("trace", "Actual nonempty calibrated frequency samples.");
  return {
    signedObservedChirpOffsetsHz:
      input.actualIndependentlyMeasuredInstantaneousFrequenciesHz.map(
        (v) => v - input.matchedReferenceFrequencyHz,
      ),
    observedPeakToPeakFrequencyChirpHz:
      Math.max(...input.actualIndependentlyMeasuredInstantaneousFrequenciesHz) -
      Math.min(...input.actualIndependentlyMeasuredInstantaneousFrequenciesHz),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyMeasuredInstantaneousFrequenciesHz: [100, 110, 90],
    matchedReferenceFrequencyHz: 100,
  },
  output: {
    result: {
      signedObservedChirpOffsetsHz: [0, 10, -10],
      observedPeakToPeakFrequencyChirpHz: 20,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/laser-frequency-chirp",
  title: "Semiconductor Laser Frequency Chirp Calculator",
  description:
    "Actual calibrated laser instantaneous-frequency offsets and sampled range, not derive phase, frequency chirp from intensity alone or unsampled peak excursion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
