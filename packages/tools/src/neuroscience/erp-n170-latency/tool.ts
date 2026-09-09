import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, peakWindow } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredTimesMs: readonly number[];
  readonly independentlyMeasuredBaselineCorrectedAmplitudes: readonly number[];
  readonly callerIdentifiedWindowStartMs: number;
  readonly callerIdentifiedWindowEndMs: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredTimesMs",
    label: "Independently measured times ms",
    kind: "numberList",
  },
  {
    id: "independentlyMeasuredBaselineCorrectedAmplitudes",
    label: "Independently measured baseline corrected amplitudes",
    kind: "numberList",
  },
  {
    id: "callerIdentifiedWindowStartMs",
    label: "Caller identified window start ms",
    kind: "number",
  },
  {
    id: "callerIdentifiedWindowEndMs",
    label: "Caller identified window end ms",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return peakWindow(
    input.independentlyMeasuredTimesMs,
    input.independentlyMeasuredBaselineCorrectedAmplitudes,
    input.callerIdentifiedWindowStartMs,
    input.callerIdentifiedWindowEndMs,
    -1,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredTimesMs: [100, 150, 170, 180, 200],
    independentlyMeasuredBaselineCorrectedAmplitudes: [0, -1, -3, -3, -1],
    callerIdentifiedWindowStartMs: 140,
    callerIdentifiedWindowEndMs: 190,
  },
  output: {
    result: {
      sampledPeakTime: 170,
      sampledPeakAmplitude: -3,
      tiedSampledPeakTimes: [170, 180],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/erp-n170-latency",
  title: "ERP N170 Latency Calculator",
  description:
    "Sampled negative N170extremum in an independently identified inclusive stimulus-relative ERPwindow, all tied sample times retained. Component assignment, baseline/artifacts, preprocessing and sampling externally validated; not face-processing diagnosis or interpolated peak.",
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
