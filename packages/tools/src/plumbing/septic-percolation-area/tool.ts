import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  interpolate,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedPercolationMinutesPerCm: number;
  readonly callerVerifiedRateKnotsMinutesCm: readonly number[];
  readonly callerVerifiedLoadingKnotsLitersM2Day: readonly number[];
  readonly callerWastewaterLitersDay: number;
}>;
export type Output = Readonly<{
  readonly callerInterpolatedSoilLoadingLitersM2Day: number;
  readonly callerPercolationDerivedAreaM2: number;
}>;
const inputFields = [
  {
    id: "observedPercolationMinutesPerCm",
    label: "Observed percolation minutes per cm",
    kind: "number",
  },
  {
    id: "callerVerifiedRateKnotsMinutesCm",
    label: "Caller verified rate knots minutes cm",
    kind: "numberList",
  },
  {
    id: "callerVerifiedLoadingKnotsLitersM2Day",
    label: "Caller verified loading knots liters m2 day",
    kind: "numberList",
  },
  {
    id: "callerWastewaterLitersDay",
    label: "Caller wastewater liters day",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedPercolationMinutesPerCm,
    "observedPercolationMinutesPerCm",
  );
  input.callerVerifiedLoadingKnotsLitersM2Day.forEach((v) =>
    positive(v, "callerVerifiedLoadingKnotsLitersM2Day"),
  );
  nonnegative(input.callerWastewaterLitersDay, "callerWastewaterLitersDay");
  const loading = interpolate(
    input.callerVerifiedRateKnotsMinutesCm,
    input.callerVerifiedLoadingKnotsLitersM2Day,
    input.observedPercolationMinutesPerCm,
  );
  positive(loading, "loading");
  return {
    callerInterpolatedSoilLoadingLitersM2Day: loading,
    callerPercolationDerivedAreaM2: input.callerWastewaterLitersDay / loading,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPercolationMinutesPerCm: 8,
  callerVerifiedRateKnotsMinutesCm: [5, 10, 20],
  callerVerifiedLoadingKnotsLitersM2Day: [30, 20, 10],
  callerWastewaterLitersDay: 600,
} satisfies Input;
export const exampleOutput = {
  callerInterpolatedSoilLoadingLitersM2Day: 24,
  callerPercolationDerivedAreaM2: 25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/septic-percolation-area",
  title: "Plumbing Septic Percolation Area Calculator",
  description:
    "Use actual percolation rate only through explicit independently justified caller rate/loading curve, then budget area; distinct from direct soil-loading area tool, no default correlation or permit.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerInterpolatedSoilLoadingLitersM2Day",
      label: "Caller interpolated soil loading liters m2 day",
      kind: "number",
    },
    {
      id: "callerPercolationDerivedAreaM2",
      label: "Caller percolation derived area m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPercolationMinutesPerCm:
        value.observedPercolationMinutesPerCm as number,
      callerVerifiedRateKnotsMinutesCm:
        value.callerVerifiedRateKnotsMinutesCm as readonly number[],
      callerVerifiedLoadingKnotsLitersM2Day:
        value.callerVerifiedLoadingKnotsLitersM2Day as readonly number[],
      callerWastewaterLitersDay: value.callerWastewaterLitersDay as number,
    }),
});
export const run = tool.execute;
export default tool;
