import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly mainStreamLengthKm: number;
  readonly centroidStreamLengthKm: number;
  readonly callerSnyderLagCoefficient: number;
  readonly callerSnyderPeakingCoefficient: number;
  readonly catchmentAreaKm2: number;
}>;
export type Output = Readonly<{
  readonly snyderLagHours: number;
  readonly snyderUnitPeakM3SecondPerCm: number;
}>;
const inputFields = [
  { id: "mainStreamLengthKm", label: "Main stream length km", kind: "number" },
  {
    id: "centroidStreamLengthKm",
    label: "Centroid stream length km",
    kind: "number",
  },
  {
    id: "callerSnyderLagCoefficient",
    label: "Caller snyder lag coefficient",
    kind: "number",
  },
  {
    id: "callerSnyderPeakingCoefficient",
    label: "Caller snyder peaking coefficient",
    kind: "number",
  },
  { id: "catchmentAreaKm2", label: "Catchment area km2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.mainStreamLengthKm, "mainStreamLengthKm");
  positive(input.centroidStreamLengthKm, "centroidStreamLengthKm");
  positive(input.callerSnyderLagCoefficient, "callerSnyderLagCoefficient");
  positive(
    input.callerSnyderPeakingCoefficient,
    "callerSnyderPeakingCoefficient",
  );
  positive(input.catchmentAreaKm2, "catchmentAreaKm2");
  const lag =
    input.callerSnyderLagCoefficient *
    (input.mainStreamLengthKm * input.centroidStreamLengthKm) ** 0.3;
  return {
    snyderLagHours: lag,
    snyderUnitPeakM3SecondPerCm:
      (2.78 * input.callerSnyderPeakingCoefficient * input.catchmentAreaKm2) /
      lag,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  mainStreamLengthKm: 10,
  centroidStreamLengthKm: 5,
  callerSnyderLagCoefficient: 1,
  callerSnyderPeakingCoefficient: 0.5,
  catchmentAreaKm2: 2,
} satisfies Input;
export const exampleOutput = {
  snyderLagHours: 3.233635032886787,
  snyderUnitPeakM3SecondPerCm: 0.8597135952965569,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/hydrograph-snyder",
  title: "Snyder Unit Hydrograph Calculator",
  description:
    "Snyder empirical lag HOURS with caller calibrated km-based Ct and unit peak 2.78CpA/tlag PER CM excess, not PER MM or full shaped hydrograph. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    { id: "snyderLagHours", label: "Snyder lag hours", kind: "number" },
    {
      id: "snyderUnitPeakM3SecondPerCm",
      label: "Snyder unit peak m3 second per cm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      mainStreamLengthKm: value.mainStreamLengthKm as number,
      centroidStreamLengthKm: value.centroidStreamLengthKm as number,
      callerSnyderLagCoefficient: value.callerSnyderLagCoefficient as number,
      callerSnyderPeakingCoefficient:
        value.callerSnyderPeakingCoefficient as number,
      catchmentAreaKm2: value.catchmentAreaKm2 as number,
    }),
});
export const run = tool.execute;
export default tool;
