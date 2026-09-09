import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, peakWindow } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredStimulusRelativeTimesMs: readonly number[];
  readonly independentlyMeasuredBaselineCorrectedAmplitudes: readonly number[];
  readonly callerIdentifiedComponentWindowStartMs: number;
  readonly callerIdentifiedComponentWindowEndMs: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredStimulusRelativeTimesMs",
    label: "Independently measured stimulus relative times ms",
    kind: "numberList",
  },
  {
    id: "independentlyMeasuredBaselineCorrectedAmplitudes",
    label: "Independently measured baseline corrected amplitudes",
    kind: "numberList",
  },
  {
    id: "callerIdentifiedComponentWindowStartMs",
    label: "Caller identified component window start ms",
    kind: "number",
  },
  {
    id: "callerIdentifiedComponentWindowEndMs",
    label: "Caller identified component window end ms",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return peakWindow(
    input.independentlyMeasuredStimulusRelativeTimesMs,
    input.independentlyMeasuredBaselineCorrectedAmplitudes,
    input.callerIdentifiedComponentWindowStartMs,
    input.callerIdentifiedComponentWindowEndMs,
    1,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredStimulusRelativeTimesMs: [1, 2, 3, 4],
    independentlyMeasuredBaselineCorrectedAmplitudes: [0, 2, 2, 0],
    callerIdentifiedComponentWindowStartMs: 1,
    callerIdentifiedComponentWindowEndMs: 4,
  },
  output: {
    result: {
      sampledPeakTime: 2,
      sampledPeakAmplitude: 2,
      tiedSampledPeakTimes: [2, 3],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/f-wave-latency",
  title: "F-Wave Latency Calculator",
  description:
    "Actual sampled peak latency for independently identified F-wave response, not response onset. Supplied component-specific window, baseline, stimulus zero, artifact rejection and polarity independently established; ties retained, no norm/diagnosis or sub-sample interpolation.",
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
