import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedFilterMediaAreaM2: number;
  readonly callerVerifiedMaximumMatchedLoadingM3HourM2: number;
  readonly observedCirculationFlowM3Hour: number;
}>;
export type Output = Readonly<{
  readonly callerFilterLoadingCapacityM3Hour: number;
  readonly observedFilterLoadingM3HourM2: number;
  readonly signedFilterFlowCapacityMarginM3Hour: number;
}>;
const inputFields = [
  {
    id: "observedFilterMediaAreaM2",
    label: "Observed filter media area m2",
    kind: "number",
  },
  {
    id: "callerVerifiedMaximumMatchedLoadingM3HourM2",
    label: "Caller verified maximum matched loading m3 hour m2",
    kind: "number",
  },
  {
    id: "observedCirculationFlowM3Hour",
    label: "Observed circulation flow m3 hour",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedFilterMediaAreaM2, "observedFilterMediaAreaM2");
  positive(
    input.callerVerifiedMaximumMatchedLoadingM3HourM2,
    "callerVerifiedMaximumMatchedLoadingM3HourM2",
  );
  nonnegative(
    input.observedCirculationFlowM3Hour,
    "observedCirculationFlowM3Hour",
  );
  const capacity =
    input.observedFilterMediaAreaM2 *
    input.callerVerifiedMaximumMatchedLoadingM3HourM2;
  return {
    callerFilterLoadingCapacityM3Hour: capacity,
    observedFilterLoadingM3HourM2:
      input.observedCirculationFlowM3Hour / input.observedFilterMediaAreaM2,
    signedFilterFlowCapacityMarginM3Hour:
      capacity - input.observedCirculationFlowM3Hour,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFilterMediaAreaM2: 2,
  callerVerifiedMaximumMatchedLoadingM3HourM2: 10,
  observedCirculationFlowM3Hour: 25,
} satisfies Input;
export const exampleOutput = {
  callerFilterLoadingCapacityM3Hour: 20,
  observedFilterLoadingM3HourM2: 12.5,
  signedFilterFlowCapacityMarginM3Hour: -5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/pool-filter-flow-rate",
  title: "Plumbing Pool Filter Flow Rate Calculator",
  description:
    "Audit actual pool filter area/flow under independently verified matched-media loading ceiling; not turnover rate, head-loss curve or filtration/disinfection certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerFilterLoadingCapacityM3Hour",
      label: "Caller filter loading capacity m3 hour",
      kind: "number",
    },
    {
      id: "observedFilterLoadingM3HourM2",
      label: "Observed filter loading m3 hour m2",
      kind: "number",
    },
    {
      id: "signedFilterFlowCapacityMarginM3Hour",
      label: "Signed filter flow capacity margin m3 hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFilterMediaAreaM2: value.observedFilterMediaAreaM2 as number,
      callerVerifiedMaximumMatchedLoadingM3HourM2:
        value.callerVerifiedMaximumMatchedLoadingM3HourM2 as number,
      observedCirculationFlowM3Hour:
        value.observedCirculationFlowM3Hour as number,
    }),
});
export const run = tool.execute;
export default tool;
