import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedConkHeightM: readonly number[];
  readonly callerIndependentlyMeasuredRotBelowConkM: readonly number[];
  readonly callerIndependentlyMeasuredRotAboveConkM: readonly number[];
  readonly observedTreeHeightM: readonly number[];
}>;
export type Output = Readonly<{
  readonly assessedRotColumnLowerM: readonly number[];
  readonly assessedRotColumnUpperM: readonly number[];
  readonly assessedRotColumnLengthsM: readonly number[];
}>;
const inputFields = [
  {
    id: "observedConkHeightM",
    label: "Observed conk height m",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyMeasuredRotBelowConkM",
    label: "Caller independently measured rot below conk m",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyMeasuredRotAboveConkM",
    label: "Caller independently measured rot above conk m",
    kind: "numberList",
  },
  {
    id: "observedTreeHeightM",
    label: "Observed tree height m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedTreeHeightM.forEach((v) => positive(v, "observedTreeHeightM"));
  input.observedConkHeightM.forEach((v) =>
    nonnegative(v, "observedConkHeightM"),
  );
  input.callerIndependentlyMeasuredRotBelowConkM.forEach((v) =>
    nonnegative(v, "callerIndependentlyMeasuredRotBelowConkM"),
  );
  input.callerIndependentlyMeasuredRotAboveConkM.forEach((v) =>
    nonnegative(v, "callerIndependentlyMeasuredRotAboveConkM"),
  );
  aligned(
    input.observedConkHeightM,
    input.callerIndependentlyMeasuredRotBelowConkM,
    "observedConkHeightM",
  );
  aligned(
    input.observedConkHeightM,
    input.callerIndependentlyMeasuredRotAboveConkM,
    "observedConkHeightM",
  );
  aligned(
    input.observedConkHeightM,
    input.observedTreeHeightM,
    "observedConkHeightM",
  );
  const lower = input.observedConkHeightM.map(
      (v, i) => v - input.callerIndependentlyMeasuredRotBelowConkM[i],
    ),
    upper = input.observedConkHeightM.map(
      (v, i) => v + input.callerIndependentlyMeasuredRotAboveConkM[i],
    );
  lower.forEach((v, i) => {
    if (v < 0 || upper[i] > input.observedTreeHeightM[i])
      simpleError(
        "rot",
        "Independently assessed rot endpoints must fit observed tree.",
      );
  });
  return {
    assessedRotColumnLowerM: lower,
    assessedRotColumnUpperM: upper,
    assessedRotColumnLengthsM: upper.map((v, i) => v - lower[i]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedConkHeightM: [2, 4],
  callerIndependentlyMeasuredRotBelowConkM: [1, 2],
  callerIndependentlyMeasuredRotAboveConkM: [2, 1],
  observedTreeHeightM: [10, 10],
} satisfies Input;
export const exampleOutput = {
  assessedRotColumnLowerM: [1, 2],
  assessedRotColumnUpperM: [4, 5],
  assessedRotColumnLengthsM: [3, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/heart-rot-column-height-estimate-from-conk-position",
  title: "Heart Rot Column Height From Conk Position Estimator",
  description:
    "Reconstruct independently assessed rot extents relative to observed conk positions, not inferring hidden decay from conk height alone or tree stability. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "assessedRotColumnLowerM",
      label: "Assessed rot column lower m",
      kind: "numberList",
    },
    {
      id: "assessedRotColumnUpperM",
      label: "Assessed rot column upper m",
      kind: "numberList",
    },
    {
      id: "assessedRotColumnLengthsM",
      label: "Assessed rot column lengths m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedConkHeightM: value.observedConkHeightM as readonly number[],
      callerIndependentlyMeasuredRotBelowConkM:
        value.callerIndependentlyMeasuredRotBelowConkM as readonly number[],
      callerIndependentlyMeasuredRotAboveConkM:
        value.callerIndependentlyMeasuredRotAboveConkM as readonly number[],
      observedTreeHeightM: value.observedTreeHeightM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
