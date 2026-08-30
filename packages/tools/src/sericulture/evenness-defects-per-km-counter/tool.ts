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
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly segmentLengthsM: readonly number[];
  readonly relativeLinearDensities: readonly number[];
  readonly thinThresholdRatio: number;
  readonly thickThresholdRatio: number;
}>;
export type Output = Readonly<{
  readonly thinEventCount: number;
  readonly thickEventCount: number;
  readonly thinEventsPerKm: number;
  readonly thickEventsPerKm: number;
  readonly outOfBandLengthFraction: number;
}>;
const inputFields = [
  { id: "segmentLengthsM", label: "Segment lengths m", kind: "numberList" },
  {
    id: "relativeLinearDensities",
    label: "Relative linear densities",
    kind: "numberList",
  },
  { id: "thinThresholdRatio", label: "Thin threshold ratio", kind: "number" },
  { id: "thickThresholdRatio", label: "Thick threshold ratio", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.segmentLengthsM.forEach((v) => positive(v, "segmentLengthsM"));
  positive(input.thinThresholdRatio, "thinThresholdRatio");
  positive(input.thickThresholdRatio, "thickThresholdRatio");
  input.relativeLinearDensities.forEach((v) =>
    nonnegative(v, "relativeLinearDensities"),
  );
  aligned(
    input.segmentLengthsM,
    input.relativeLinearDensities,
    "segmentLengthsM",
  );
  if (input.thinThresholdRatio >= 1 || input.thickThresholdRatio <= 1)
    simpleError("thresholds", "Thin below one and thick above one required.");
  let thinEventCount = 0,
    thickEventCount = 0,
    length = 0,
    previous = 0;
  input.relativeLinearDensities.forEach((v, i) => {
    const cls =
      v < input.thinThresholdRatio ? -1 : v > input.thickThresholdRatio ? 1 : 0;
    if (cls !== 0) {
      length += input.segmentLengthsM[i];
      if (cls !== previous) {
        if (cls < 0) thinEventCount++;
        else thickEventCount++;
      }
    }
    previous = cls;
  });
  const total = input.segmentLengthsM.reduce((a, b) => a + b, 0);
  return {
    thinEventCount,
    thickEventCount,
    thinEventsPerKm: (thinEventCount * 1000) / total,
    thickEventsPerKm: (thickEventCount * 1000) / total,
    outOfBandLengthFraction: length / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  segmentLengthsM: [100, 200, 100],
  relativeLinearDensities: [0.7, 0.8, 1.3],
  thinThresholdRatio: 0.9,
  thickThresholdRatio: 1.2,
} satisfies Input;
export const exampleOutput = {
  thinEventCount: 1,
  thickEventCount: 1,
  thinEventsPerKm: 2.5,
  thickEventsPerKm: 2.5,
  outOfBandLengthFraction: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/evenness-defects-per-km-counter",
  title: "Evenness Defects Per KM Counter",
  description:
    "Count contiguous thin/thick yarn episodes rather than every sample, normalizing by inspected length and reporting out-of-band length; thresholds are caller method definitions.",
  inputs: inputFields,
  outputs: [
    { id: "thinEventCount", label: "Thin event count", kind: "number" },
    { id: "thickEventCount", label: "Thick event count", kind: "number" },
    { id: "thinEventsPerKm", label: "Thin events per km", kind: "number" },
    { id: "thickEventsPerKm", label: "Thick events per km", kind: "number" },
    {
      id: "outOfBandLengthFraction",
      label: "Out of band length fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      segmentLengthsM: value.segmentLengthsM as readonly number[],
      relativeLinearDensities:
        value.relativeLinearDensities as readonly number[],
      thinThresholdRatio: value.thinThresholdRatio as number,
      thickThresholdRatio: value.thickThresholdRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
