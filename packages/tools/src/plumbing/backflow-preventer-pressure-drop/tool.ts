import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  interpolate,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerMatchedBackflowFlowKnotsLitersMinute: readonly number[];
  readonly callerMeasuredBackflowDropKnotsKpa: readonly number[];
  readonly observedQueryFlowsLitersMinute: readonly number[];
  readonly observedUpstreamGaugeKpa: number;
}>;
export type Output = Readonly<{
  readonly callerInterpolatedBackflowDropsKpa: readonly number[];
  readonly modeledDownstreamGaugeKpa: readonly number[];
}>;
const inputFields = [
  {
    id: "callerMatchedBackflowFlowKnotsLitersMinute",
    label: "Caller matched backflow flow knots liters minute",
    kind: "numberList",
  },
  {
    id: "callerMeasuredBackflowDropKnotsKpa",
    label: "Caller measured backflow drop knots kpa",
    kind: "numberList",
  },
  {
    id: "observedQueryFlowsLitersMinute",
    label: "Observed query flows liters minute",
    kind: "numberList",
  },
  {
    id: "observedUpstreamGaugeKpa",
    label: "Observed upstream gauge kpa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedBackflowFlowKnotsLitersMinute.forEach((v) =>
    nonnegative(v, "callerMatchedBackflowFlowKnotsLitersMinute"),
  );
  input.callerMeasuredBackflowDropKnotsKpa.forEach((v) =>
    nonnegative(v, "callerMeasuredBackflowDropKnotsKpa"),
  );
  input.observedQueryFlowsLitersMinute.forEach((v) =>
    nonnegative(v, "observedQueryFlowsLitersMinute"),
  );
  nonnegative(input.observedUpstreamGaugeKpa, "observedUpstreamGaugeKpa");
  const drops = input.observedQueryFlowsLitersMinute.map((v) =>
    interpolate(
      input.callerMatchedBackflowFlowKnotsLitersMinute,
      input.callerMeasuredBackflowDropKnotsKpa,
      v,
    ),
  );
  return {
    callerInterpolatedBackflowDropsKpa: drops,
    modeledDownstreamGaugeKpa: drops.map(
      (v) => input.observedUpstreamGaugeKpa - v,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMatchedBackflowFlowKnotsLitersMinute: [0, 10, 20],
  callerMeasuredBackflowDropKnotsKpa: [0, 5, 15],
  observedQueryFlowsLitersMinute: [5, 15],
  observedUpstreamGaugeKpa: 100,
} satisfies Input;
export const exampleOutput = {
  callerInterpolatedBackflowDropsKpa: [2.5, 10],
  modeledDownstreamGaugeKpa: [97.5, 90],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/backflow-preventer-pressure-drop",
  title: "Plumbing Backflow Preventer Pressure Drop Calculator",
  description:
    "Read actual matched backflow-device measured flow/drop curve and signed resulting downstream pressure; no generic valve Cv alias, extrapolation, contamination prevention or device certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerInterpolatedBackflowDropsKpa",
      label: "Caller interpolated backflow drops kpa",
      kind: "numberList",
    },
    {
      id: "modeledDownstreamGaugeKpa",
      label: "Modeled downstream gauge kpa",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMatchedBackflowFlowKnotsLitersMinute:
        value.callerMatchedBackflowFlowKnotsLitersMinute as readonly number[],
      callerMeasuredBackflowDropKnotsKpa:
        value.callerMeasuredBackflowDropKnotsKpa as readonly number[],
      observedQueryFlowsLitersMinute:
        value.observedQueryFlowsLitersMinute as readonly number[],
      observedUpstreamGaugeKpa: value.observedUpstreamGaugeKpa as number,
    }),
});
export const run = tool.execute;
export default tool;
