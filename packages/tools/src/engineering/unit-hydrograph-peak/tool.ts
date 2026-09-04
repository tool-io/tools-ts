import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  integral,
  extrema,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerUnitHydrographTimesHours: readonly number[];
  readonly callerUnitHydrographFlowM3SecondPerMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly sampledUnitHydrographPeakTimesHours: readonly number[];
  readonly sampledUnitHydrographPeakM3SecondPerMm: number;
  readonly hydrographIntegratedM3PerMm: number;
}>;
const inputFields = [
  {
    id: "callerUnitHydrographTimesHours",
    label: "Caller unit hydrograph times hours",
    kind: "numberList",
  },
  {
    id: "callerUnitHydrographFlowM3SecondPerMm",
    label: "Caller unit hydrograph flow m3 second per mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerUnitHydrographTimesHours.forEach((v) =>
    nonnegative(v, "callerUnitHydrographTimesHours"),
  );
  input.callerUnitHydrographFlowM3SecondPerMm.forEach((v) =>
    nonnegative(v, "callerUnitHydrographFlowM3SecondPerMm"),
  );
  const e = extrema(
    input.callerUnitHydrographTimesHours,
    input.callerUnitHydrographFlowM3SecondPerMm,
    true,
  );
  return {
    sampledUnitHydrographPeakTimesHours: e.coordinates,
    sampledUnitHydrographPeakM3SecondPerMm: e.value,
    hydrographIntegratedM3PerMm:
      3600 *
      integral(
        input.callerUnitHydrographTimesHours,
        input.callerUnitHydrographFlowM3SecondPerMm,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerUnitHydrographTimesHours: [0, 1, 3],
  callerUnitHydrographFlowM3SecondPerMm: [0, 2, 0],
} satisfies Input;
export const exampleOutput = {
  sampledUnitHydrographPeakTimesHours: [1],
  sampledUnitHydrographPeakM3SecondPerMm: 2,
  hydrographIntegratedM3PerMm: 10800,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/unit-hydrograph-peak",
  title: "Unit Hydrograph Peak Calculator",
  description:
    "Actual independently calibrated unit-hydrograph peak/ties plus integrated unit-runoff volume over unequal times, no rational-method peak alias. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "sampledUnitHydrographPeakTimesHours",
      label: "Sampled unit hydrograph peak times hours",
      kind: "numberList",
    },
    {
      id: "sampledUnitHydrographPeakM3SecondPerMm",
      label: "Sampled unit hydrograph peak m3 second per mm",
      kind: "number",
    },
    {
      id: "hydrographIntegratedM3PerMm",
      label: "Hydrograph integrated m3 per mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerUnitHydrographTimesHours:
        value.callerUnitHydrographTimesHours as readonly number[],
      callerUnitHydrographFlowM3SecondPerMm:
        value.callerUnitHydrographFlowM3SecondPerMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
