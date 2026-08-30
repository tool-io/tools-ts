import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, ordered, hrf } from "../shared.js";
export type Input = Readonly<{
  readonly timesSeconds: readonly number[];
  readonly peakShape: number;
  readonly undershootShape: number;
  readonly scaleSeconds: number;
  readonly undershootRatio: number;
}>;
export type Output = Readonly<{
  readonly hrfValues: readonly number[];
  readonly sampledPeakTimeSeconds: number;
}>;
const inputFields = [
  { id: "timesSeconds", label: "Times seconds", kind: "numberList", unit: "s" },
  { id: "peakShape", label: "Peak shape", kind: "integer" },
  { id: "undershootShape", label: "Undershoot shape", kind: "integer" },
  { id: "scaleSeconds", label: "Scale seconds", kind: "number", unit: "s" },
  { id: "undershootRatio", label: "Undershoot ratio", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ordered(input.timesSeconds, "timesSeconds");
  const hrfValues = hrf(
      input.timesSeconds,
      input.peakShape,
      input.undershootShape,
      input.scaleSeconds,
      input.undershootRatio,
    ),
    peak = Math.max(...hrfValues);
  if (hrfValues.filter((v) => v === peak).length > 1)
    simpleError("timesSeconds", "Sampled HRF peak is tied.");
  return {
    hrfValues,
    sampledPeakTimeSeconds: input.timesSeconds[hrfValues.indexOf(peak)],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesSeconds: [0, 1, 2, 3],
  peakShape: 2,
  undershootShape: 3,
  scaleSeconds: 1,
  undershootRatio: 6,
} satisfies Input;
export const exampleOutput = {
  hrfValues: [0, 0.3372228210738221, 0.2255588053943545, 0.11202090382769388],
  sampledPeakTimeSeconds: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/sampled-double-gamma-hrf-peak",
  title: "HRF Peak",
  description:
    "Evaluate a supplied double-gamma HRF and identify its unique sampled peak; integer gamma shapes and caller scale/undershoot ratio define the model, not a universal response.",
  inputs: inputFields,
  outputs: [
    { id: "hrfValues", label: "Hrf values", kind: "numberList" },
    {
      id: "sampledPeakTimeSeconds",
      label: "Sampled peak time seconds",
      kind: "number",
      unit: "s",
    },
  ],
  calculate: (value) =>
    calculate({
      timesSeconds: value.timesSeconds as readonly number[],
      peakShape: value.peakShape as number,
      undershootShape: value.undershootShape as number,
      scaleSeconds: value.scaleSeconds as number,
      undershootRatio: value.undershootRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
