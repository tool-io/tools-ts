import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedGa2o3BreakdownV: readonly number[];
  readonly observedDepletionWidthM: readonly number[];
  readonly callerIndependentlyEstablishedPeakToMeanFieldFactor: readonly number[];
}>;
export type Output = Readonly<{
  readonly inferredPeakGa2o3BreakdownFieldsVoltM: readonly number[];
}>;
const inputFields = [
  {
    id: "observedGa2o3BreakdownV",
    label: "Observed ga2o3 breakdown v",
    kind: "numberList",
  },
  {
    id: "observedDepletionWidthM",
    label: "Observed depletion width m",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyEstablishedPeakToMeanFieldFactor",
    label: "Caller independently established peak to mean field factor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedGa2o3BreakdownV.forEach((v) =>
    positive(v, "observedGa2o3BreakdownV"),
  );
  input.observedDepletionWidthM.forEach((v) =>
    positive(v, "observedDepletionWidthM"),
  );
  input.callerIndependentlyEstablishedPeakToMeanFieldFactor.forEach((v) =>
    positive(v, "callerIndependentlyEstablishedPeakToMeanFieldFactor"),
  );
  aligned(
    input.observedGa2o3BreakdownV,
    input.observedDepletionWidthM,
    "observedGa2o3BreakdownV",
  );
  aligned(
    input.observedGa2o3BreakdownV,
    input.callerIndependentlyEstablishedPeakToMeanFieldFactor,
    "observedGa2o3BreakdownV",
  );
  return {
    inferredPeakGa2o3BreakdownFieldsVoltM: input.observedGa2o3BreakdownV.map(
      (v, i) =>
        (v / input.observedDepletionWidthM[i]) *
        input.callerIndependentlyEstablishedPeakToMeanFieldFactor[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGa2o3BreakdownV: [10, 20],
  observedDepletionWidthM: [1, 2],
  callerIndependentlyEstablishedPeakToMeanFieldFactor: [2, 3],
} satisfies Input;
export const exampleOutput = {
  inferredPeakGa2o3BreakdownFieldsVoltM: [20, 30],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/beta-ga2o3-breakdown-field",
  title: "Semiconductor Beta Ga2o3 Breakdown Field Calculator",
  description:
    "Infer actual β-Ga2O3 peak breakdown field from observed breakdown/depletion and independently established field-shape factor; no universal critical-field default or safe voltage.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredPeakGa2o3BreakdownFieldsVoltM",
      label: "Inferred peak ga2o3 breakdown fields volt m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedGa2o3BreakdownV:
        value.observedGa2o3BreakdownV as readonly number[],
      observedDepletionWidthM:
        value.observedDepletionWidthM as readonly number[],
      callerIndependentlyEstablishedPeakToMeanFieldFactor:
        value.callerIndependentlyEstablishedPeakToMeanFieldFactor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
