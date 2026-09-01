import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
  aligned,
  sum,
  interpolate,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerMeasuredEmitterPressureKpaKnots: readonly number[];
  readonly callerMatchedEmitterLitersHourKnots: readonly number[];
  readonly observedEmitterPressuresKpa: readonly number[];
  readonly observedEmitterCountsAtPressures: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerInterpolatedEmitterLitersHour: readonly number[];
  readonly totalModeledEmitterLitersHour: number;
}>;
const inputFields = [
  {
    id: "callerMeasuredEmitterPressureKpaKnots",
    label: "Caller measured emitter pressure kpa knots",
    kind: "numberList",
  },
  {
    id: "callerMatchedEmitterLitersHourKnots",
    label: "Caller matched emitter liters hour knots",
    kind: "numberList",
  },
  {
    id: "observedEmitterPressuresKpa",
    label: "Observed emitter pressures kpa",
    kind: "numberList",
  },
  {
    id: "observedEmitterCountsAtPressures",
    label: "Observed emitter counts at pressures",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedEmitterLitersHourKnots.forEach((v) =>
    nonnegative(v, "callerMatchedEmitterLitersHourKnots"),
  );
  input.observedEmitterPressuresKpa.forEach((v) =>
    nonnegative(v, "observedEmitterPressuresKpa"),
  );
  aligned(
    input.observedEmitterPressuresKpa,
    input.observedEmitterCountsAtPressures,
    "observedEmitterPressuresKpa",
  );
  input.observedEmitterCountsAtPressures.forEach((v) =>
    bounded(v, "emitters", 0, 1000000),
  );
  const flows = input.observedEmitterPressuresKpa.map((v) =>
    interpolate(
      input.callerMeasuredEmitterPressureKpaKnots,
      input.callerMatchedEmitterLitersHourKnots,
      v,
    ),
  );
  return {
    callerInterpolatedEmitterLitersHour: flows,
    totalModeledEmitterLitersHour: sum(
      flows.map((v, i) => v * input.observedEmitterCountsAtPressures[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMeasuredEmitterPressureKpaKnots: [50, 100, 150],
  callerMatchedEmitterLitersHourKnots: [1, 2, 3],
  observedEmitterPressuresKpa: [75, 125],
  observedEmitterCountsAtPressures: [10, 20],
} satisfies Input;
export const exampleOutput = {
  callerInterpolatedEmitterLitersHour: [1.5, 2.5],
  totalModeledEmitterLitersHour: 65,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/drip-irrigation-emitter-flow",
  title: "Plumbing Drip Irrigation Emitter Flow Calculator",
  description:
    "Read actual matched emitter pressure/discharge calibration and independently observed emitter inventory, without universal pressure exponent or inferred low-quarter uniformity.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerInterpolatedEmitterLitersHour",
      label: "Caller interpolated emitter liters hour",
      kind: "numberList",
    },
    {
      id: "totalModeledEmitterLitersHour",
      label: "Total modeled emitter liters hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMeasuredEmitterPressureKpaKnots:
        value.callerMeasuredEmitterPressureKpaKnots as readonly number[],
      callerMatchedEmitterLitersHourKnots:
        value.callerMatchedEmitterLitersHourKnots as readonly number[],
      observedEmitterPressuresKpa:
        value.observedEmitterPressuresKpa as readonly number[],
      observedEmitterCountsAtPressures:
        value.observedEmitterCountsAtPressures as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
