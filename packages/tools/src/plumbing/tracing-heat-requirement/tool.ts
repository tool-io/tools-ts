import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedTraceRunLengthsM: readonly number[];
  readonly callerMatchedPipeLossWattsM: readonly number[];
  readonly independentlyMeasuredFittingHeatLossWatts: readonly number[];
  readonly callerAdditionalHeatBudgetFraction: number;
}>;
export type Output = Readonly<{
  readonly requiredTraceWattsByRun: readonly number[];
  readonly totalRequiredTraceWatts: number;
}>;
const inputFields = [
  {
    id: "observedTraceRunLengthsM",
    label: "Observed trace run lengths m",
    kind: "numberList",
  },
  {
    id: "callerMatchedPipeLossWattsM",
    label: "Caller matched pipe loss watts m",
    kind: "numberList",
  },
  {
    id: "independentlyMeasuredFittingHeatLossWatts",
    label: "Independently measured fitting heat loss watts",
    kind: "numberList",
  },
  {
    id: "callerAdditionalHeatBudgetFraction",
    label: "Caller additional heat budget fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedTraceRunLengthsM.forEach((v) =>
    nonnegative(v, "observedTraceRunLengthsM"),
  );
  input.callerMatchedPipeLossWattsM.forEach((v) =>
    nonnegative(v, "callerMatchedPipeLossWattsM"),
  );
  input.independentlyMeasuredFittingHeatLossWatts.forEach((v) =>
    nonnegative(v, "independentlyMeasuredFittingHeatLossWatts"),
  );
  nonnegative(
    input.callerAdditionalHeatBudgetFraction,
    "callerAdditionalHeatBudgetFraction",
  );
  aligned(
    input.observedTraceRunLengthsM,
    input.callerMatchedPipeLossWattsM,
    "observedTraceRunLengthsM",
  );
  aligned(
    input.observedTraceRunLengthsM,
    input.independentlyMeasuredFittingHeatLossWatts,
    "observedTraceRunLengthsM",
  );
  const heat = input.observedTraceRunLengthsM.map(
    (v, i) =>
      (v * input.callerMatchedPipeLossWattsM[i] +
        input.independentlyMeasuredFittingHeatLossWatts[i]) *
      (1 + input.callerAdditionalHeatBudgetFraction),
  );
  return { requiredTraceWattsByRun: heat, totalRequiredTraceWatts: sum(heat) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTraceRunLengthsM: [10, 20],
  callerMatchedPipeLossWattsM: [5, 8],
  independentlyMeasuredFittingHeatLossWatts: [10, 20],
  callerAdditionalHeatBudgetFraction: 0.2,
} satisfies Input;
export const exampleOutput = {
  requiredTraceWattsByRun: [72, 216],
  totalRequiredTraceWatts: 288,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/tracing-heat-requirement",
  title: "Plumbing Tracing Heat Requirement Calculator",
  description:
    "Reconcile actual trace run linear losses, independent fittings and caller extra heat budget; no electrical circuit/trace cable selection, ignition/freeze protection or installation approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredTraceWattsByRun",
      label: "Required trace watts by run",
      kind: "numberList",
    },
    {
      id: "totalRequiredTraceWatts",
      label: "Total required trace watts",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTraceRunLengthsM:
        value.observedTraceRunLengthsM as readonly number[],
      callerMatchedPipeLossWattsM:
        value.callerMatchedPipeLossWattsM as readonly number[],
      independentlyMeasuredFittingHeatLossWatts:
        value.independentlyMeasuredFittingHeatLossWatts as readonly number[],
      callerAdditionalHeatBudgetFraction:
        value.callerAdditionalHeatBudgetFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
