import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, linearFit } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedEpochDecimalYears: readonly number[];
  readonly observedMeanSeaLevelMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedSeaLevelTrendMmYear: number;
  readonly seaLevelTrendRSquared: number;
}>;
const inputFields = [
  {
    id: "observedEpochDecimalYears",
    label: "Observed epoch decimal years",
    kind: "numberList",
  },
  {
    id: "observedMeanSeaLevelMm",
    label: "Observed mean sea level mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const f = linearFit(
    input.observedEpochDecimalYears,
    input.observedMeanSeaLevelMm,
  );
  return {
    observedSeaLevelTrendMmYear: f.slope,
    seaLevelTrendRSquared: f.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEpochDecimalYears: [2000, 2001, 2003],
  observedMeanSeaLevelMm: [0, 2, 6],
} satisfies Input;
export const exampleOutput = {
  observedSeaLevelTrendMmYear: 2,
  seaLevelTrendRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/mean-sea-level-trend-mm-year",
  title: "Mean Sea Level Trend MM Year Calculator",
  description:
    "OLS actual mean-level/mm versus decimal-year trend, no forecast/uncertainty from a short record, seasonal/varying datum excluded externally. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedSeaLevelTrendMmYear",
      label: "Observed sea level trend mm year",
      kind: "number",
    },
    {
      id: "seaLevelTrendRSquared",
      label: "Sea level trend r squared",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedEpochDecimalYears:
        value.observedEpochDecimalYears as readonly number[],
      observedMeanSeaLevelMm: value.observedMeanSeaLevelMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
