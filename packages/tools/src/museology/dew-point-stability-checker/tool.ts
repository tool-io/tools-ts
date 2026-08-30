import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  minimum,
} from "../shared.js";
export type Input = Readonly<{
  readonly measuredSurfaceTemperaturesC: readonly number[];
  readonly independentlyMeasuredDewPointsC: readonly number[];
  readonly representedHours: readonly number[];
  readonly callerMinimumSurfaceDewpointMarginC: number;
}>;
export type Output = Readonly<{
  readonly surfaceMinusDewpointMarginsC: readonly number[];
  readonly hoursBelowCallerMargin: number;
  readonly minimumObservedSurfaceMarginC: number;
}>;
const inputFields = [
  {
    id: "measuredSurfaceTemperaturesC",
    label: "Measured surface temperatures c",
    kind: "numberList",
  },
  {
    id: "independentlyMeasuredDewPointsC",
    label: "Independently measured dew points c",
    kind: "numberList",
  },
  { id: "representedHours", label: "Represented hours", kind: "numberList" },
  {
    id: "callerMinimumSurfaceDewpointMarginC",
    label: "Caller minimum surface dewpoint margin c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedHours.forEach((v) => nonnegative(v, "representedHours"));
  aligned(
    input.measuredSurfaceTemperaturesC,
    input.independentlyMeasuredDewPointsC,
    "measuredSurfaceTemperaturesC",
  );
  aligned(
    input.measuredSurfaceTemperaturesC,
    input.representedHours,
    "measuredSurfaceTemperaturesC",
  );
  const m = input.measuredSurfaceTemperaturesC.map(
    (v, i) => v - input.independentlyMeasuredDewPointsC[i],
  );
  return {
    surfaceMinusDewpointMarginsC: m,
    hoursBelowCallerMargin: input.representedHours.reduce(
      (s, v, i) =>
        s + (m[i] < input.callerMinimumSurfaceDewpointMarginC ? v : 0),
      0,
    ),
    minimumObservedSurfaceMarginC: minimum(m),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredSurfaceTemperaturesC: [10, 8, 12],
  independentlyMeasuredDewPointsC: [9, 9, 9],
  representedHours: [1, 2, 1],
  callerMinimumSurfaceDewpointMarginC: 1,
} satisfies Input;
export const exampleOutput = {
  surfaceMinusDewpointMarginsC: [1, -1, 3],
  hoursBelowCallerMargin: 2,
  minimumObservedSurfaceMarginC: -1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/dew-point-stability-checker",
  title: "Dew Point Stability Preservation Checker",
  description:
    "Compare independently observed case surface temperatures and dewpoints with explicit exposure margins; no duplicate humidity-to-dewpoint derivation or condensation-free assurance.",
  inputs: inputFields,
  outputs: [
    {
      id: "surfaceMinusDewpointMarginsC",
      label: "Surface minus dewpoint margins c",
      kind: "numberList",
    },
    {
      id: "hoursBelowCallerMargin",
      label: "Hours below caller margin",
      kind: "number",
    },
    {
      id: "minimumObservedSurfaceMarginC",
      label: "Minimum observed surface margin c",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredSurfaceTemperaturesC:
        value.measuredSurfaceTemperaturesC as readonly number[],
      independentlyMeasuredDewPointsC:
        value.independentlyMeasuredDewPointsC as readonly number[],
      representedHours: value.representedHours as readonly number[],
      callerMinimumSurfaceDewpointMarginC:
        value.callerMinimumSurfaceDewpointMarginC as number,
    }),
});
export const run = tool.execute;
export default tool;
