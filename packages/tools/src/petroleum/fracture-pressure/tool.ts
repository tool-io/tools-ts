import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  crossings,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedAlreadyCompletedPressureTestPa: readonly number[];
  readonly observedFractureIndicatorMetric: readonly number[];
  readonly callerIndependentlyEstablishedFractureIndicatorThreshold: number;
}>;
export type Output = Readonly<{
  readonly observedFractureCriterionCrossingsPa: readonly number[];
}>;
const inputFields = [
  {
    id: "observedAlreadyCompletedPressureTestPa",
    label: "Observed already completed pressure test pa",
    kind: "numberList",
  },
  {
    id: "observedFractureIndicatorMetric",
    label: "Observed fracture indicator metric",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyEstablishedFractureIndicatorThreshold",
    label: "Caller independently established fracture indicator threshold",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAlreadyCompletedPressureTestPa.forEach((v) =>
    positive(v, "observedAlreadyCompletedPressureTestPa"),
  );
  nonnegative(
    input.callerIndependentlyEstablishedFractureIndicatorThreshold,
    "callerIndependentlyEstablishedFractureIndicatorThreshold",
  );
  return {
    observedFractureCriterionCrossingsPa: crossings(
      input.observedAlreadyCompletedPressureTestPa,
      input.observedFractureIndicatorMetric,
      input.callerIndependentlyEstablishedFractureIndicatorThreshold,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlreadyCompletedPressureTestPa: [1, 2, 3],
  observedFractureIndicatorMetric: [0, 0, 2],
  callerIndependentlyEstablishedFractureIndicatorThreshold: 1,
} satisfies Input;
export const exampleOutput = {
  observedFractureCriterionCrossingsPa: [2.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/fracture-pressure",
  title: "Petroleum Fracture Pressure Calculator",
  description:
    "Extract actual independently identified fracture-indicator pressure crossings from already completed records, no fracture test instructions, required injection or safe formation pressure. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedFractureCriterionCrossingsPa",
      label: "Observed fracture criterion crossings pa",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAlreadyCompletedPressureTestPa:
        value.observedAlreadyCompletedPressureTestPa as readonly number[],
      observedFractureIndicatorMetric:
        value.observedFractureIndicatorMetric as readonly number[],
      callerIndependentlyEstablishedFractureIndicatorThreshold:
        value.callerIndependentlyEstablishedFractureIndicatorThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;
