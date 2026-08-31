import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
  range,
  fit,
} from "../shared.js";
export type Input = Readonly<{
  readonly measuredUsableSeatDepthCm: number;
  readonly measuredButtockPoplitealLengthsCm: readonly number[];
  readonly callerRequiredKneeGapBoundsCm: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedKneeGapsCm: readonly number[];
  readonly callerDepthFitFlags: readonly number[];
  readonly sampleFitPercent: number;
}>;
const inputFields = [
  {
    id: "measuredUsableSeatDepthCm",
    label: "Measured usable seat depth cm",
    kind: "number",
  },
  {
    id: "measuredButtockPoplitealLengthsCm",
    label: "Measured buttock popliteal lengths cm",
    kind: "numberList",
  },
  {
    id: "callerRequiredKneeGapBoundsCm",
    label: "Caller required knee gap bounds cm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredButtockPoplitealLengthsCm.forEach((v) =>
    positive(v, "measuredButtockPoplitealLengthsCm"),
  );
  nonnegative(input.measuredUsableSeatDepthCm, "measuredUsableSeatDepthCm");
  range(input.callerRequiredKneeGapBoundsCm, "kneeGapBounds");
  if (!input.measuredButtockPoplitealLengthsCm.length)
    simpleError("sample", "Observed body-length sample required.");
  const d = input.measuredButtockPoplitealLengthsCm.map(
      (v) => v - input.measuredUsableSeatDepthCm,
    ),
    flags = fit(
      d,
      ...(input.callerRequiredKneeGapBoundsCm as [number, number]),
    );
  return {
    observedKneeGapsCm: d,
    callerDepthFitFlags: flags,
    sampleFitPercent: (100 * sum(flags)) / flags.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredUsableSeatDepthCm: 40,
  measuredButtockPoplitealLengthsCm: [42, 48],
  callerRequiredKneeGapBoundsCm: [3, 8],
} satisfies Input;
export const exampleOutput = {
  observedKneeGapsCm: [2, 8],
  callerDepthFitFlags: [0, 1],
  sampleFitPercent: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/seat-depth-fit-checker",
  title: "Seat Depth Buttock-Popliteal Fit Checker",
  description:
    "Audit usable seat depth through measured behind-knee gaps across actual sample bodies, retaining signed deficits and fit coverage; not a population percentile model or safe-seat approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedKneeGapsCm",
      label: "Observed knee gaps cm",
      kind: "numberList",
    },
    {
      id: "callerDepthFitFlags",
      label: "Caller depth fit flags",
      kind: "numberList",
    },
    { id: "sampleFitPercent", label: "Sample fit percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      measuredUsableSeatDepthCm: value.measuredUsableSeatDepthCm as number,
      measuredButtockPoplitealLengthsCm:
        value.measuredButtockPoplitealLengthsCm as readonly number[],
      callerRequiredKneeGapBoundsCm:
        value.callerRequiredKneeGapBoundsCm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
