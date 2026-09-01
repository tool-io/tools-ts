import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  strictlyIncreasing,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedSewerStationDistancesM: readonly number[];
  readonly observedInvertElevationsM: readonly number[];
  readonly callerMinimumDownstreamSlope: number;
}>;
export type Output = Readonly<{
  readonly signedObservedSewerSlopes: readonly number[];
  readonly segmentsBelowCallerSlope: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSewerStationDistancesM",
    label: "Observed sewer station distances m",
    kind: "numberList",
  },
  {
    id: "observedInvertElevationsM",
    label: "Observed invert elevations m",
    kind: "numberList",
  },
  {
    id: "callerMinimumDownstreamSlope",
    label: "Caller minimum downstream slope",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerMinimumDownstreamSlope,
    "callerMinimumDownstreamSlope",
  );
  aligned(
    input.observedSewerStationDistancesM,
    input.observedInvertElevationsM,
    "observedSewerStationDistancesM",
  );
  strictlyIncreasing(input.observedSewerStationDistancesM, "stations");
  const slopes = input.observedInvertElevationsM
    .slice(1)
    .map(
      (v, i) =>
        (input.observedInvertElevationsM[i] - v) /
        (input.observedSewerStationDistancesM[i + 1] -
          input.observedSewerStationDistancesM[i]),
    );
  return {
    signedObservedSewerSlopes: slopes,
    segmentsBelowCallerSlope: slopes.flatMap((v, i) =>
      v < input.callerMinimumDownstreamSlope ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSewerStationDistancesM: [0, 10, 30],
  observedInvertElevationsM: [5, 4.9, 4.5],
  callerMinimumDownstreamSlope: 0.015,
} satisfies Input;
export const exampleOutput = {
  signedObservedSewerSlopes: [0.01, 0.02],
  segmentsBelowCallerSlope: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/sewer-slope",
  title: "Plumbing Sewer Slope Calculator",
  description:
    "Audit actual station/invert sewer profile with signed downstream slopes and caller criterion; not generic two-point slope, self-cleansing guarantee, datum transformation or geodesy.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedObservedSewerSlopes",
      label: "Signed observed sewer slopes",
      kind: "numberList",
    },
    {
      id: "segmentsBelowCallerSlope",
      label: "Segments below caller slope",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSewerStationDistancesM:
        value.observedSewerStationDistancesM as readonly number[],
      observedInvertElevationsM:
        value.observedInvertElevationsM as readonly number[],
      callerMinimumDownstreamSlope:
        value.callerMinimumDownstreamSlope as number,
    }),
});
export const run = tool.execute;
export default tool;
