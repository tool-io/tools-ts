import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredBaselineCorrectedAmplitudesMv: readonly number[];
  readonly callerVerifiedBaselineMv: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredBaselineCorrectedAmplitudesMv",
    label: "Independently measured baseline corrected amplitudes mv",
    kind: "numberList",
  },
  {
    id: "callerVerifiedBaselineMv",
    label: "Caller verified baseline mv",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.independentlyMeasuredBaselineCorrectedAmplitudesMv.length)
    simpleError("samples", "Nonempty independently identified component.");
  const lo = Math.min(
      ...input.independentlyMeasuredBaselineCorrectedAmplitudesMv,
    ),
    hi = Math.max(...input.independentlyMeasuredBaselineCorrectedAmplitudesMv);
  if (
    input.callerVerifiedBaselineMv < lo ||
    input.callerVerifiedBaselineMv > hi
  )
    simpleError(
      "baseline",
      "Explicit baseline within qualified component extrema.",
    );
  return {
    observedPeakToPeakAmplitudeMv: hi - lo,
    observedBaselineToNegativePeakMv: input.callerVerifiedBaselineMv - lo,
    observedBaselineToPositivePeakMv: hi - input.callerVerifiedBaselineMv,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredBaselineCorrectedAmplitudesMv: [0, -2, 3, 0],
    callerVerifiedBaselineMv: 0,
  },
  output: {
    result: {
      observedPeakToPeakAmplitudeMv: 5,
      observedBaselineToNegativePeakMv: 2,
      observedBaselineToPositivePeakMv: 3,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/m-wave-amplitude",
  title: "M-Wave Amplitude Calculator",
  description:
    "Actual M-wave waveform peak-to-peak and baseline-to-negative/positive sampled amplitudes with explicit independent baseline, not automatic waveform/component detection or a universal nerve norm.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
